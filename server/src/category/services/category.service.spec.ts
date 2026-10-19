import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { ProjectService } from '../../project/services/project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupService } from '../../group/services/group.service';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Project as ProjectEntity } from '../../shared/entities/project.entity';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Category } from '../../shared/interfaces/category.interface';
import { User } from '../../shared/interfaces/user.interface';
import { generateMockUser } from '../../shared/mock/user.mock';
import {
  generateMockCategories,
  generateMockCategory,
  generateMockCategoryDto,
} from '../../shared/mock/category.mock';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { generateMockProject } from '../../shared/mock/project.mock';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Project } from '../../shared/interfaces/project.interface';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoryService', () => {
  const CATEGORY_REPOSITROY_TOKEN = getRepositoryToken(CategoryEntity);

  let service: CategoryService;
  let projectService: ProjectService;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(ProjectEntity),
          useValue: {},
        },
        CategoryService,
        {
          provide: CATEGORY_REPOSITROY_TOKEN,
          useClass: jest.fn(() => ({
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
          })),
        },
        GroupService,
        {
          provide: getRepositoryToken(GroupEntity),
          useValue: {},
        },
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    projectService = module.get<ProjectService>(ProjectService);
    categoryRepository = module.get<Repository<Category>>(
      CATEGORY_REPOSITROY_TOKEN
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategoriesByProjectId', () => {
    it('should return the categories of a project', async () => {
      const user: User = generateMockUser(1);
      const projectId = 1;
      const categories: Category[] = generateMockCategories(3);

      jest.spyOn(projectService, 'isMember').mockResolvedValue(true);
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(categories);

      const result = await service.getAllCategoriesByProjectId(user, projectId);

      expect(result).toBe(categories);
      expect(projectService.isMember).toHaveBeenCalledWith(user, projectId);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        relations: { project: true },
      });
    });

    it('should throw a ForbiddenException if the user is not a member of the project', async () => {
      const user: User = generateMockUser(1);
      const projectId = 1;

      jest.spyOn(projectService, 'isMember').mockResolvedValue(false);

      await expect(
        service.getAllCategoriesByProjectId(user, projectId)
      ).rejects.toThrow(ForbiddenException);

      expect(projectService.isMember).toHaveBeenCalledWith(user, projectId);
      expect(categoryRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by its ID', async () => {
      const categoryId = 1;
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);

      const result = await service.getCategoryById(categoryId);

      expect(result).toBe(category);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
        relations: { project: true },
      });
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const categoryId = 1;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getCategoryById(categoryId)).rejects.toThrow(
        NotFoundException
      );

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
        relations: { project: true },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const user: User = generateMockUser(1);
      const createCategoryDto: CreateCategoryDto = generateMockCategoryDto(1);
      const { projectId, ...projectData } = createCategoryDto;
      const category: Category = generateMockCategory(
        1,
        generateMockProject(projectId)
      );

      jest.spyOn(projectService, 'isMember').mockResolvedValue(true);
      jest.spyOn(service, 'getAllCategoriesByProjectId').mockResolvedValue([]);
      jest
        .spyOn(projectService, 'getProjectById')
        .mockResolvedValue(category.project);
      jest.spyOn(categoryRepository, 'create').mockReturnValue(category);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(category);

      const result = await service.createCategory(user, createCategoryDto);

      expect(result).toBe(category);
      expect(projectService.isMember).toHaveBeenCalledWith(user, projectId);
      expect(service.getAllCategoriesByProjectId).toHaveBeenCalledWith(
        user,
        projectId
      );
      expect(projectService.getProjectById).toHaveBeenCalledWith(projectId);
      expect(categoryRepository.create).toHaveBeenCalledWith({
        ...projectData,
        project: category.project,
        index: 0,
      });
      expect(categoryRepository.save).toHaveBeenCalledWith(category);
    });

    it('should throw a ForbiddenException if the user is not a member of the project', async () => {
      const user: User = generateMockUser(1);
      const projectId = 1;
      const createCategoryDto: CreateCategoryDto = generateMockCategoryDto(1);

      jest.spyOn(projectService, 'isMember').mockResolvedValue(false);

      await expect(
        service.createCategory(user, createCategoryDto)
      ).rejects.toThrow(ForbiddenException);

      expect(projectService.isMember).toHaveBeenCalledWith(user, projectId);
      expect(categoryRepository.create).not.toHaveBeenCalled();
      expect(categoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const user: User = generateMockUser(1);
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const category: Category = {
        ...generateMockCategory(categoryId, generateMockProject(1)),
        ...updateCategoryDto,
      };
      const categories = [category];

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);
      jest
        .spyOn(service, 'getAllCategoriesByProjectId')
        .mockResolvedValue(categories);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(category);

      const result = await service.updateCategory(
        user,
        categoryId,
        updateCategoryDto
      );

      expect(result).toBe(category);
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(service.getAllCategoriesByProjectId).toHaveBeenCalledWith(
        user,
        category.project.id
      );
      expect(categoryRepository.save).toHaveBeenCalledWith(category);
    });

    it('should throw a BadRequestException if the updated index is bigger than the current length of categories', async () => {
      const user: User = generateMockUser(1);
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { index: 2 };
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      const categories = [category];

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);
      jest
        .spyOn(service, 'getAllCategoriesByProjectId')
        .mockResolvedValue(categories);

      await expect(
        service.updateCategory(user, categoryId, updateCategoryDto)
      ).rejects.toThrow(BadRequestException);

      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(service.getAllCategoriesByProjectId).toHaveBeenCalledWith(
        user,
        category.project.id
      );
      expect(categoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const user: User = generateMockUser(1);
      const categoryId = 1;
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      const categories = [category];

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);
      jest
        .spyOn(service, 'getAllCategoriesByProjectId')
        .mockResolvedValue(categories);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(category);
      jest
        .spyOn(categoryRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: undefined });

      const result = await service.deleteCategory(user, categoryId);

      expect(result).toBe(category);
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(service.getAllCategoriesByProjectId).toHaveBeenCalledWith(
        user,
        category.project.id
      );
      expect(categoryRepository.save).toHaveBeenCalledWith(categories);
      expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const user: User = generateMockUser(1);
      const categoryId = 1;

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(undefined);

      await expect(
        service.deleteCategory(user, categoryId)
      ).rejects.toThrow(NotFoundException);

      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(categoryRepository.save).not.toHaveBeenCalled();
      expect(categoryRepository.delete).not.toHaveBeenCalled();
    });
  });
});
