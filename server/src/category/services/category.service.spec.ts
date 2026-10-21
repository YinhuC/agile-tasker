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
import { Repository } from 'typeorm';
import { Category } from '../../shared/interfaces/category.interface';
import { generateMockUser } from '../../shared/mock/user.mock';
import {
  generateMockCategory,
  generateMockCategoryDto,
} from '../../shared/mock/category.mock';
import { generateMockProject } from '../../shared/mock/project.mock';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  generateMockEntityManager,
  generateMockQueryBuilder,
} from '../../shared/mock/query-builder.mock';

describe('CategoryService', () => {
  const CATEGORY_REPOSITROY_TOKEN = getRepositoryToken(CategoryEntity);

  let service: CategoryService;
  let projectService: ProjectService;
  let categoryRepository: Repository<CategoryEntity>;

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
            update: jest.fn(),
            createQueryBuilder: jest.fn(),
            manager: {
              transaction: jest.fn(),
              createQueryBuilder: jest.fn(),
            },
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
    categoryRepository = module.get<Repository<CategoryEntity>>(
      CATEGORY_REPOSITROY_TOKEN
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategoryById', () => {
    it('should return a category with its project', async () => {
      const categoryId = 1;
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      const query = generateMockQueryBuilder({ getOne: category });
      jest
        .spyOn(categoryRepository.manager, 'createQueryBuilder')
        .mockReturnValue(query as any);

      const result = await service.getCategoryById(categoryId);

      expect(result).toBe(category);
      expect(
        categoryRepository.manager.createQueryBuilder
      ).toHaveBeenCalledWith(CategoryEntity, 'category');
      expect(query.leftJoinAndSelect).toHaveBeenCalledWith(
        'category.project',
        'project'
      );
      expect(query.where).toHaveBeenCalledWith('category.id = :categoryId', {
        categoryId,
      });
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const categoryId = 1;
      const query = generateMockQueryBuilder({ getOne: null });
      jest
        .spyOn(categoryRepository.manager, 'createQueryBuilder')
        .mockReturnValue(query as any);

      await expect(service.getCategoryById(categoryId)).rejects.toThrow(
        `Category with ID ${categoryId} not found`
      );
    });
  });

  describe('createCategory', () => {
    it('should create a category at the end of its board', async () => {
      const user = generateMockUser(1);
      const createCategoryDto: CreateCategoryDto = generateMockCategoryDto(5);
      const { projectId, ...categoryData } = createCategoryDto;
      const lock = generateMockQueryBuilder();
      const count = generateMockQueryBuilder({ getCount: 3 });
      const manager = generateMockEntityManager([lock, count]);
      jest.spyOn(projectService, 'isMember').mockResolvedValue(true);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.createCategory(user, createCategoryDto);

      const expectedCategory = {
        ...categoryData,
        project: { id: projectId },
        index: 3,
      };
      expect(result).toEqual(expectedCategory);
      expect(projectService.isMember).toHaveBeenCalledWith(user, projectId);
      expect(lock.where).toHaveBeenCalledWith('project.id = :projectId', {
        projectId,
      });
      expect(lock.setLock).toHaveBeenCalledWith('pessimistic_write');
      expect(count.where).toHaveBeenCalledWith(
        'category.projectId = :projectId',
        { projectId }
      );
      expect(manager.create).toHaveBeenCalledWith(
        CategoryEntity,
        expectedCategory
      );
      expect(manager.save).toHaveBeenCalledWith(expectedCategory);
    });

    it('should not copy an id from the request onto the new category', async () => {
      const user = generateMockUser(1);
      const createCategoryDto = {
        name: 'Doing',
        projectId: 5,
        id: 99,
      } as CreateCategoryDto;
      const lock = generateMockQueryBuilder();
      const count = generateMockQueryBuilder({ getCount: 3 });
      const manager = generateMockEntityManager([lock, count]);
      jest.spyOn(projectService, 'isMember').mockResolvedValue(true);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await service.createCategory(user, createCategoryDto);

      expect(manager.create).toHaveBeenCalledWith(CategoryEntity, {
        name: 'Doing',
        project: { id: 5 },
        index: 3,
      });
    });

    it('should throw a ForbiddenException if the user is not a member of the project', async () => {
      const user = generateMockUser(1);
      const createCategoryDto: CreateCategoryDto = generateMockCategoryDto(1);
      jest.spyOn(projectService, 'isMember').mockResolvedValue(false);

      await expect(
        service.createCategory(user, createCategoryDto)
      ).rejects.toThrow(
        'You have rights to create a category for this project'
      );

      expect(categoryRepository.manager.transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should rename a category without touching the order', async () => {
      const categoryId = 1;
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);

      const result = await service.updateCategory(categoryId, {
        name: 'New name',
      });

      expect(result).toEqual({ ...category, name: 'New name' });
      expect(categoryRepository.update).toHaveBeenCalledWith(categoryId, {
        name: 'New name',
      });
      expect(categoryRepository.manager.transaction).not.toHaveBeenCalled();
    });

    it('should shift the lists between the old and new index left when moving a list right', async () => {
      const categoryId = 1;
      const category: Category = {
        ...generateMockCategory(categoryId, generateMockProject(4)),
        index: 0,
      };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: category });
      const count = generateMockQueryBuilder({ getCount: 3 });
      const shift = generateMockQueryBuilder();
      const manager = generateMockEntityManager([lock, read, count, shift]);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.updateCategory(categoryId, { index: 2 });

      expect(result).toEqual({ ...category, index: 2 });
      expect(lock.where).toHaveBeenCalledWith('category.id = :categoryId', {
        categoryId,
      });
      expect(shift.set.mock.calls[0][0].index()).toBe('"index" + -1');
      expect(shift.where).toHaveBeenCalledWith('"projectId" = :projectId', {
        projectId: 4,
      });
      expect(shift.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 1 }],
        ['"index" <= :to', { to: 2 }],
      ]);
      expect(manager.update).toHaveBeenCalledWith(CategoryEntity, categoryId, {
        index: 2,
      });
    });

    it('should shift the lists between the new and old index right when moving a list left', async () => {
      const categoryId = 1;
      const category: Category = {
        ...generateMockCategory(categoryId, generateMockProject(4)),
        index: 2,
      };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: category });
      const count = generateMockQueryBuilder({ getCount: 3 });
      const shift = generateMockQueryBuilder();
      const manager = generateMockEntityManager([lock, read, count, shift]);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await service.updateCategory(categoryId, { index: 0 });

      expect(shift.set.mock.calls[0][0].index()).toBe('"index" + 1');
      expect(shift.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 0 }],
        ['"index" <= :to', { to: 1 }],
      ]);
    });

    it('should throw a BadRequestException if the updated index is past the end of the board', async () => {
      const categoryId = 1;
      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(1)
      );
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: category });
      const count = generateMockQueryBuilder({ getCount: 3 });
      const manager = generateMockEntityManager([lock, read, count]);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await expect(
        service.updateCategory(categoryId, { index: 3 })
      ).rejects.toThrow(
        'Index cannot be bigger than the current length of categories'
      );

      expect(manager.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category and close the gap it leaves', async () => {
      const categoryId = 1;
      const category: Category = {
        ...generateMockCategory(categoryId, generateMockProject(4)),
        index: 1,
      };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: category });
      const shift = generateMockQueryBuilder();
      const manager = generateMockEntityManager([lock, read, shift]);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.deleteCategory(categoryId);

      expect(result).toBe(category);
      expect(manager.delete).toHaveBeenCalledWith(CategoryEntity, categoryId);
      expect(shift.set.mock.calls[0][0].index()).toBe('"index" + -1');
      expect(shift.where).toHaveBeenCalledWith('"projectId" = :projectId', {
        projectId: 4,
      });
      expect(shift.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 2 }],
      ]);
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const categoryId = 1;
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: null });
      const manager = generateMockEntityManager([lock, read]);
      (categoryRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await expect(service.deleteCategory(categoryId)).rejects.toThrow(
        `Category with ID ${categoryId} not found`
      );

      expect(manager.delete).not.toHaveBeenCalled();
    });
  });

  describe('isMember', () => {
    it('should check the whole chain from list to the user in one query', async () => {
      const user = generateMockUser(7);
      const query = generateMockQueryBuilder({ getExists: true });
      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockReturnValue(query as any);

      const result = await service.isMember(user, 3);

      expect(result).toBe(true);
      expect(query.innerJoin.mock.calls).toEqual([
        ['category.project', 'project'],
        ['project.group', 'group'],
        ['group.users', 'user', 'user.id = :userId', { userId: 7 }],
      ]);
      expect(query.where).toHaveBeenCalledWith('category.id = :categoryId', {
        categoryId: 3,
      });
    });

    it('should return false when the user is not in the workspace', async () => {
      const user = generateMockUser(7);
      const query = generateMockQueryBuilder({ getExists: false });
      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockReturnValue(query as any);

      const result = await service.isMember(user, 3);

      expect(result).toBe(false);
    });
  });
});
