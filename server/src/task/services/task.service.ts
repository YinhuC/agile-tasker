import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task as TaskEntity } from '../../shared/entities/task.entity';
import { Task } from '../../shared/interfaces/task.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CategoryService } from '../../category/services/category.service';
import { User } from '../../shared/interfaces/user.interface';
import {
  insertIndexValue,
  removeIndexValue,
  updateIndexValues,
} from '../../shared/utils/array.utils';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private readonly categoryService: CategoryService
  ) {}

  async getAllTasksByCategoryId(
    user: User,
    categoryId: number
  ): Promise<Task[]> {
    const isMember = await this.categoryService.isMember(user, categoryId);
    if (!isMember) {
      throw new ForbiddenException(
        'You have no access to projects from this group'
      );
    }
    return await this.taskRepository.find({
      where: { category: { id: categoryId } },
      relations: {
        category: true,
      },
    });
  }

  async getTaskById(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: {
        category: true,
      },
    });
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

    const existingTasks = await this.getAllTasksByCategoryId(user, categoryId);
    const nextIndex = existingTasks.length > 0 ? existingTasks.length + 1 : 0;

    const category = await this.categoryService.getCategoryById(categoryId);
    const task = {
      ...taskDto,
      category,
      index: nextIndex,
    };
    const newTask = this.taskRepository.create(task);
    return await this.taskRepository.save(newTask);
  }

  async updateTask(
    user: User,
    taskId: number,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const { categoryId, index } = updateTaskDto;
    const task = await this.getTaskById(taskId);
    const tasks = await this.getAllTasksByCategoryId(user, task.category.id);
    const updatedTask = { ...task, ...updateTaskDto };

    if (index !== undefined && categoryId === task.category.id) {
      if (index > tasks.length - 1) {
        throw new BadRequestException(
          'Index cannot be bigger than the current length of tasks'
        );
      }

      const oldIndex = task.index;
      const newIndex = index;
      const modifiedTasks = updateIndexValues(tasks, oldIndex, newIndex);

      updatedTask.index = newIndex;

      await this.taskRepository.save(modifiedTasks);
    } else if (index !== undefined) {
      const newTasks = await this.getAllTasksByCategoryId(user, categoryId);
      if (index > newTasks.length) {
        throw new BadRequestException(
          'Index cannot be bigger than the current length of tasks'
        );
      }
      const oldCategory = await this.categoryService.getCategoryById(
        task.category.id
      );
      const newCategory =
        await this.categoryService.getCategoryById(categoryId);
      if (oldCategory.project.id !== newCategory.project.id) {
        throw new BadRequestException(
          'Cannot move to different to category in different project'
        );
      }

      const oldIndex = task.index;
      const newIndex = updateTaskDto.index;
      const newModifiedTasks = insertIndexValue(newTasks, newIndex);
      const oldModifiedTasks = removeIndexValue(tasks, oldIndex);

      updatedTask.index = newIndex;
      updatedTask.category = newCategory;

      await this.taskRepository.save(newModifiedTasks);
      await this.taskRepository.save(oldModifiedTasks);
    }

    return await this.taskRepository.save(updatedTask);
  }

  async deleteTask(user: User, taskId: number): Promise<Task> {
    const task = await this.getTaskById(taskId);
    const tasks = await this.getAllTasksByCategoryId(user, task.category.id);
    const modifiedTasks = removeIndexValue(tasks, task.index);
    await this.taskRepository.save(modifiedTasks);

    const result = await this.taskRepository.delete(taskId);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async isMember(user: Partial<User>, taskId: number): Promise<boolean> {
    const task = await this.getTaskById(taskId);
    return await this.categoryService.isMember(user, task.category.id);
  }
}
