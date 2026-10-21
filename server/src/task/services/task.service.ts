import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Task as TaskEntity } from '../../shared/entities/task.entity';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { Task } from '../../shared/interfaces/task.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CategoryService } from '../../category/services/category.service';
import { User } from '../../shared/interfaces/user.interface';
import {
  lockBoardOfCategory,
  lockBoardOfTask,
} from '../../shared/utils/board-lock.utils';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private readonly categoryService: CategoryService
  ) {}

  async getTaskById(
    taskId: number,
    manager: EntityManager = this.taskRepository.manager
  ): Promise<Task> {
    const task = await manager
      .createQueryBuilder(TaskEntity, 'task')
      .leftJoinAndSelect('task.category', 'category')
      .where('task.id = :taskId', { taskId })
      .getOne();
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
    const { categoryId, ...taskDto } = createTaskDto;

    const isMember = await this.categoryService.isMember(user, categoryId);
    if (!isMember) {
      throw new ForbiddenException(
        'You have rights to create a task for this category'
      );
    }

    return await this.taskRepository.manager.transaction(async (manager) => {
      await lockBoardOfCategory(manager, categoryId);
      const index = await this.countTasks(manager, categoryId);
      const task = manager.create(TaskEntity, {
        ...taskDto,
        category: { id: categoryId },
        index,
      });
      return await manager.save(task);
    });
  }

  /** Renames in place; a new index moves the card within its list or into another list of the same board. */
  async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const { name, description, index, categoryId } = updateTaskDto;
    const fields: Partial<Task> = {};
    if (name !== undefined) {
      fields.name = name;
    }
    if (description !== undefined) {
      fields.description = description;
    }

    if (index === undefined) {
      const task = await this.getTaskById(taskId);
      if (Object.keys(fields).length > 0) {
        await this.taskRepository.update(taskId, fields);
      }
      return { ...task, ...fields };
    }

    return await this.taskRepository.manager.transaction(async (manager) => {
      await lockBoardOfTask(manager, taskId);
      const task = await this.getTaskById(taskId, manager);
      const fromCategoryId = task.category.id;
      let category = task.category;

      if (categoryId === fromCategoryId) {
        const count = await this.countTasks(manager, fromCategoryId);
        if (index > count - 1) {
          throw new BadRequestException(
            'Index cannot be bigger than the current length of tasks'
          );
        }
        if (task.index < index) {
          await this.shiftTasks(
            manager,
            fromCategoryId,
            -1,
            task.index + 1,
            index
          );
        } else if (task.index > index) {
          await this.shiftTasks(
            manager,
            fromCategoryId,
            1,
            index,
            task.index - 1
          );
        }
      } else {
        category = await manager
          .createQueryBuilder(CategoryEntity, 'category')
          .innerJoin('category.project', 'project')
          .innerJoin('project.categories', 'source')
          .where('category.id = :categoryId', { categoryId })
          .andWhere('source.id = :fromCategoryId', { fromCategoryId })
          .getOne();
        if (!category) {
          throw new BadRequestException(
            'Cannot move to different to category in different project'
          );
        }
        const count = await this.countTasks(manager, categoryId);
        if (index > count) {
          throw new BadRequestException(
            'Index cannot be bigger than the current length of tasks'
          );
        }
        await this.shiftTasks(manager, fromCategoryId, -1, task.index + 1);
        await this.shiftTasks(manager, categoryId, 1, index);
      }

      await manager.update(TaskEntity, taskId, {
        ...fields,
        index,
        category: { id: category.id },
      });
      return { ...task, ...fields, index, category };
    });
  }

  async deleteTask(taskId: number): Promise<Task> {
    return await this.taskRepository.manager.transaction(async (manager) => {
      await lockBoardOfTask(manager, taskId);
      const task = await this.getTaskById(taskId, manager);
      await manager.delete(TaskEntity, taskId);
      await this.shiftTasks(manager, task.category.id, -1, task.index + 1);
      return task;
    });
  }

  async isMember(user: Partial<User>, taskId: number): Promise<boolean> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.category', 'category')
      .innerJoin('category.project', 'project')
      .innerJoin('project.group', 'group')
      .innerJoin('group.users', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .where('task.id = :taskId', { taskId })
      .getExists();
  }

  private async countTasks(
    manager: EntityManager,
    categoryId: number
  ): Promise<number> {
    return await manager
      .createQueryBuilder(TaskEntity, 'task')
      .where('task.categoryId = :categoryId', { categoryId })
      .getCount();
  }

  /** Adds delta to the index of every card in the list whose index is in [from, to], in one statement. */
  private async shiftTasks(
    manager: EntityManager,
    categoryId: number,
    delta: 1 | -1,
    from: number,
    to?: number
  ): Promise<void> {
    const query = manager
      .createQueryBuilder()
      .update(TaskEntity)
      .set({ index: () => `"index" + ${delta}` })
      .where('"categoryId" = :categoryId', { categoryId })
      .andWhere('"index" >= :from', { from });
    if (to !== undefined) {
      query.andWhere('"index" <= :to', { to });
    }
    await query.execute();
  }
}
