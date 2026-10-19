import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { Category } from '../../shared/interfaces/category.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { User } from '../../shared/interfaces/user.interface';
import { ProjectService } from '../../project/services/project.service';
import {
  removeIndexValue,
  updateIndexValues,
} from '../../shared/utils/array.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private readonly projectService: ProjectService
  ) {}

  async getAllCategoriesByProjectId(
    user: User,
    projectId: number
  ): Promise<Category[]> {
    const isMember = await this.projectService.isMember(user, projectId);
    if (!isMember) {
      throw new ForbiddenException(
        'You have no access to projects from this group'
      );
    }
    return await this.categoryRepository.find({
      where: { project: { id: projectId } },
      relations: {
        project: true,
      },
    });
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: {
        project: true,
      },
    });
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

    const existingCategories = await this.getAllCategoriesByProjectId(
      user,
      projectId
    );
    const nextIndex =
      existingCategories.length > 0 ? existingCategories.length + 1 : 0;

    const project = await this.projectService.getProjectById(projectId);

    const category = {
      ...categoryDto,
      project,
      index: nextIndex,
    };
    const newCategory = this.categoryRepository.create(category);
    return await this.categoryRepository.save(newCategory);
  }

  async updateCategory(
    user: User,
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const category = await this.getCategoryById(categoryId);
    const categories = await this.getAllCategoriesByProjectId(
      user,
      category.project.id
    );
    const updatedCategory = { ...category, ...updateCategoryDto };

    if (updateCategoryDto.index !== undefined) {
      if (updateCategoryDto.index > categories.length - 1) {
        throw new BadRequestException(
          'Index cannot be bigger than the current length of categories'
        );
      }

      const oldIndex = category.index;
      const newIndex = updateCategoryDto.index;
      const modifiedCategories = updateIndexValues(
        categories,
        oldIndex,
        newIndex
      );

      await this.categoryRepository.save(modifiedCategories);
      updatedCategory.index = newIndex;
    }

    return await this.categoryRepository.save(updatedCategory);
  }

  async deleteCategory(user: User, id: number): Promise<Category> {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    const categories = await this.getAllCategoriesByProjectId(
      user,
      category.project.id
    );
    const modifiedCategories = removeIndexValue(categories, category.index);
    await this.categoryRepository.save(modifiedCategories);

    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async isMember(user: Partial<User>, categoryId: number): Promise<boolean> {
    const category = await this.getCategoryById(categoryId);
    return await this.projectService.isMember(user, category.project.id);
  }
}
