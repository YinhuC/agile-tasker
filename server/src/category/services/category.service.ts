import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { Category } from '../../shared/interfaces/category.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { User } from '../../shared/interfaces/user.interface';
import { ProjectService } from '../../project/services/project.service';
import {
  lockBoardOfCategory,
  lockBoardOfProject,
} from '../../shared/utils/board-lock.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private readonly projectService: ProjectService
  ) {}

  async getCategoryById(
    categoryId: number,
    manager: EntityManager = this.categoryRepository.manager
  ): Promise<Category> {
    const category = await manager
      .createQueryBuilder(CategoryEntity, 'category')
      .leftJoinAndSelect('category.project', 'project')
      .where('category.id = :categoryId', { categoryId })
      .getOne();
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return category;
  }

  async createCategory(
    user: User,
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { projectId, ...categoryDto } = createCategoryDto;

    const isMember = await this.projectService.isMember(user, projectId);
    if (!isMember) {
      throw new ForbiddenException(
        'You have rights to create a category for this project'
      );
    }

    return await this.categoryRepository.manager.transaction(
      async (manager) => {
        await lockBoardOfProject(manager, projectId);
        const index = await this.countCategories(manager, projectId);
        const category = manager.create(CategoryEntity, {
          ...categoryDto,
          project: { id: projectId },
          index,
        });
        return await manager.save(category);
      }
    );
  }

  /** Renames in place; a new index moves the list along its board. */
  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const { name, index } = updateCategoryDto;

    const fields: Partial<Category> = {};
    if (name !== undefined) {
      fields.name = name;
    }

    if (index === undefined) {
      const category = await this.getCategoryById(categoryId);
      if (name !== undefined) {
        await this.categoryRepository.update(categoryId, fields);
      }
      return { ...category, ...fields };
    }

    return await this.categoryRepository.manager.transaction(
      async (manager) => {
        await lockBoardOfCategory(manager, categoryId);
        const category = await this.getCategoryById(categoryId, manager);
        const projectId = category.project.id;
        const count = await this.countCategories(manager, projectId);
        if (index > count - 1) {
          throw new BadRequestException(
            'Index cannot be bigger than the current length of categories'
          );
        }
        if (category.index < index) {
          await this.shiftCategories(
            manager,
            projectId,
            -1,
            category.index + 1,
            index
          );
        } else if (category.index > index) {
          await this.shiftCategories(
            manager,
            projectId,
            1,
            index,
            category.index - 1
          );
        }
        await manager.update(CategoryEntity, categoryId, { ...fields, index });
        return { ...category, ...fields, index };
      }
    );
  }

  async deleteCategory(categoryId: number): Promise<Category> {
    return await this.categoryRepository.manager.transaction(
      async (manager) => {
        await lockBoardOfCategory(manager, categoryId);
        const category = await this.getCategoryById(categoryId, manager);
        await manager.delete(CategoryEntity, categoryId);
        await this.shiftCategories(
          manager,
          category.project.id,
          -1,
          category.index + 1
        );
        return category;
      }
    );
  }

  async isMember(user: Partial<User>, categoryId: number): Promise<boolean> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoin('category.project', 'project')
      .innerJoin('project.group', 'group')
      .innerJoin('group.users', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .where('category.id = :categoryId', { categoryId })
      .getExists();
  }

  private async countCategories(
    manager: EntityManager,
    projectId: number
  ): Promise<number> {
    return await manager
      .createQueryBuilder(CategoryEntity, 'category')
      .where('category.projectId = :projectId', { projectId })
      .getCount();
  }

  /** Adds delta to the index of every list on the board whose index is in [from, to], in one statement. */
  private async shiftCategories(
    manager: EntityManager,
    projectId: number,
    delta: 1 | -1,
    from: number,
    to?: number
  ): Promise<void> {
    const query = manager
      .createQueryBuilder()
      .update(CategoryEntity)
      .set({ index: () => `"index" + ${delta}` })
      .where('"projectId" = :projectId', { projectId })
      .andWhere('"index" >= :from', { from });
    if (to !== undefined) {
      query.andWhere('"index" <= :to', { to });
    }
    await query.execute();
  }
}
