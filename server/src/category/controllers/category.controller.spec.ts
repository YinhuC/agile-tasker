import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from '../services/category.service';
import { ProjectService } from '../../project/services/project.service';
import { GroupService } from '../../group/services/group.service';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Project as ProjectEntity } from '../../shared/entities/project.entity';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { Category } from '../../shared/interfaces/category.interface';
import { generateMockUser } from '../../shared/mock/user.mock';
import {
  generateMockCategory,
  generateMockCategoryDto,
} from '../../shared/mock/category.mock';
import { generateMockProject } from '../../shared/mock/project.mock';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

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
          provide: getRepositoryToken(CategoryEntity),
          useValue: {},
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
      controllers: [CategoryController],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategoryById', () => {
    it('should return a category', async () => {
      const categoryId = 1;
      const category: Category = generateMockCategory(categoryId);

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);

      const result = await controller.getCategoryById(categoryId);

      expect(result).toBe(category);
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const user = generateMockUser(1);
      const projectId = 1;
      const createCategoryDto: CreateCategoryDto =
        generateMockCategoryDto(projectId);
      const category: Category = generateMockCategory(
        1,
        generateMockProject(projectId)
      );

      jest.spyOn(service, 'createCategory').mockResolvedValue(category);

      const result = await controller.createCategory(user, createCategoryDto);

      expect(result).toBe(category);
      expect(service.createCategory).toHaveBeenCalledWith(
        user,
        createCategoryDto
      );
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      jest.spyOn(service, 'updateCategory').mockResolvedValue(category);

      const result = await controller.updateCategory(
        categoryId,
        updateCategoryDto
      );

      expect(result).toBe(category);
      expect(service.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryId = 1;
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      jest.spyOn(service, 'deleteCategory').mockResolvedValue(category);

      const result = await controller.deleteCategory(categoryId);

      expect(result).toBe(category);
      expect(service.deleteCategory).toHaveBeenCalledWith(categoryId);
    });
  });
});
