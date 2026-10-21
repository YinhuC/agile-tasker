import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from '../../category/services/category.service';
import { ProjectService } from '../../project/services/project.service';
import { GroupService } from '../../group/services/group.service';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Task as TaskEntity } from '../../shared/entities/task.entity';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Project as ProjectEntity } from '../../shared/entities/project.entity';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { Repository } from 'typeorm';
import { Task } from '../../shared/interfaces/task.interface';
import {
  generateMockTask,
  generateMockTaskDto,
} from '../../shared/mock/task.mock';
import { generateMockUser } from '../../shared/mock/user.mock';
import { CreateTaskDto } from '../dto/create-task.dto';
import { generateMockCategory } from '../../shared/mock/category.mock';
import { UpdateTaskDto } from '../dto/update-task.dto';
import {
  generateMockEntityManager,
  generateMockQueryBuilder,
} from '../../shared/mock/query-builder.mock';

describe('TaskService', () => {
  const TASK_REPOSITROY_TOKEN = getRepositoryToken(TaskEntity);

  let service: TaskService;
  let categoryService: CategoryService;
  let taskRepository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TASK_REPOSITROY_TOKEN,
          useClass: jest.fn(() => ({
            update: jest.fn(),
            createQueryBuilder: jest.fn(),
            manager: {
              transaction: jest.fn(),
              createQueryBuilder: jest.fn(),
            },
          })),
        },
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {},
        },
        ProjectService,
        {
          provide: getRepositoryToken(ProjectEntity),
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
    }).compile();

    service = module.get<TaskService>(TaskService);
    categoryService = module.get<CategoryService>(CategoryService);
    taskRepository = module.get<Repository<TaskEntity>>(TASK_REPOSITROY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTaskById', () => {
    it('should return a task with its category', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));
      const query = generateMockQueryBuilder({ getOne: task });
      jest
        .spyOn(taskRepository.manager, 'createQueryBuilder')
        .mockReturnValue(query as any);

      const result = await service.getTaskById(taskId);

      expect(result).toBe(task);
      expect(taskRepository.manager.createQueryBuilder).toHaveBeenCalledWith(
        TaskEntity,
        'task'
      );
      expect(query.leftJoinAndSelect).toHaveBeenCalledWith(
        'task.category',
        'category'
      );
      expect(query.where).toHaveBeenCalledWith('task.id = :taskId', {
        taskId,
      });
    });

    it('should throw a NotFoundException if task is not found', async () => {
      const taskId = 1;
      const query = generateMockQueryBuilder({ getOne: null });
      jest
        .spyOn(taskRepository.manager, 'createQueryBuilder')
        .mockReturnValue(query as any);

      await expect(service.getTaskById(taskId)).rejects.toThrow(
        `Task with ID ${taskId} not found`
      );
    });
  });

  describe('createTask', () => {
    it('should create a task at the end of its list', async () => {
      const user = generateMockUser(1);
      const createTaskDto: CreateTaskDto = generateMockTaskDto(4);
      const { categoryId, ...taskData } = createTaskDto;
      const lock = generateMockQueryBuilder();
      const count = generateMockQueryBuilder({ getCount: 3 });
      const manager = generateMockEntityManager([lock, count]);
      jest.spyOn(categoryService, 'isMember').mockResolvedValue(true);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.createTask(user, createTaskDto);

      const expectedTask = {
        ...taskData,
        category: { id: categoryId },
        index: 3,
      };
      expect(result).toEqual(expectedTask);
      expect(categoryService.isMember).toHaveBeenCalledWith(user, categoryId);
      expect(lock.setLock).toHaveBeenCalledWith(
        'pessimistic_write',
        undefined,
        ['project']
      );
      expect(lock.where).toHaveBeenCalledWith('category.id = :categoryId', {
        categoryId,
      });
      expect(count.where).toHaveBeenCalledWith(
        'task.categoryId = :categoryId',
        { categoryId }
      );
      expect(manager.create).toHaveBeenCalledWith(TaskEntity, expectedTask);
      expect(manager.save).toHaveBeenCalledWith(expectedTask);
    });

    it('should not copy an id from the request onto the new task', async () => {
      const user = generateMockUser(1);
      const createTaskDto = {
        name: 'Ship it',
        description: 'Before Friday',
        categoryId: 4,
        id: 99,
      } as CreateTaskDto;
      const lock = generateMockQueryBuilder();
      const count = generateMockQueryBuilder({ getCount: 3 });
      const manager = generateMockEntityManager([lock, count]);
      jest.spyOn(categoryService, 'isMember').mockResolvedValue(true);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await service.createTask(user, createTaskDto);

      expect(manager.create).toHaveBeenCalledWith(TaskEntity, {
        name: 'Ship it',
        description: 'Before Friday',
        category: { id: 4 },
        index: 3,
      });
    });

    it('should throw ForbiddenException if the user is not a member of the category', async () => {
      const user = generateMockUser(1);
      const createTaskDto: CreateTaskDto = generateMockTaskDto(1);
      jest.spyOn(categoryService, 'isMember').mockResolvedValue(false);

      await expect(service.createTask(user, createTaskDto)).rejects.toThrow(
        'You have rights to create a task for this category'
      );

      expect(categoryService.isMember).toHaveBeenCalledWith(
        user,
        createTaskDto.categoryId
      );
      expect(taskRepository.manager.transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should rename a task without touching the order', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));
      const updateTaskDto: UpdateTaskDto = {
        name: 'New name',
        categoryId: 1,
      };
      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);

      const result = await service.updateTask(taskId, updateTaskDto);

      expect(result).toEqual({ ...task, name: 'New name' });
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, {
        name: 'New name',
      });
      expect(taskRepository.manager.transaction).not.toHaveBeenCalled();
    });

    it('should shift the cards between the old and new index up when moving a card down its list', async () => {
      const taskId = 1;
      const category = generateMockCategory(1);
      const task: Task = { ...generateMockTask(taskId, category), index: 0 };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const count = generateMockQueryBuilder({ getCount: 3 });
      const shift = generateMockQueryBuilder();
      const manager = generateMockEntityManager([lock, read, count, shift]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.updateTask(taskId, {
        index: 2,
        categoryId: 1,
      });

      expect(result).toEqual({ ...task, index: 2, category });
      expect(lock.where).toHaveBeenCalledWith('task.id = :taskId', { taskId });
      expect(shift.set.mock.calls[0][0].index()).toBe('"index" + -1');
      expect(shift.where).toHaveBeenCalledWith('"categoryId" = :categoryId', {
        categoryId: 1,
      });
      expect(shift.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 1 }],
        ['"index" <= :to', { to: 2 }],
      ]);
      expect(manager.update).toHaveBeenCalledWith(TaskEntity, taskId, {
        index: 2,
        category: { id: 1 },
      });
    });

    it('should shift the cards between the new and old index down when moving a card up its list', async () => {
      const taskId = 1;
      const category = generateMockCategory(1);
      const task: Task = { ...generateMockTask(taskId, category), index: 2 };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const count = generateMockQueryBuilder({ getCount: 3 });
      const shift = generateMockQueryBuilder();
      const manager = generateMockEntityManager([lock, read, count, shift]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await service.updateTask(taskId, { index: 0, categoryId: 1 });

      expect(shift.set.mock.calls[0][0].index()).toBe('"index" + 1');
      expect(shift.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 0 }],
        ['"index" <= :to', { to: 1 }],
      ]);
      expect(manager.update).toHaveBeenCalledWith(TaskEntity, taskId, {
        index: 0,
        category: { id: 1 },
      });
    });

    it('should throw BadRequestException if the index is past the end of the list', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const count = generateMockQueryBuilder({ getCount: 3 });
      const manager = generateMockEntityManager([lock, read, count]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await expect(
        service.updateTask(taskId, { index: 3, categoryId: 1 })
      ).rejects.toThrow(
        'Index cannot be bigger than the current length of tasks'
      );

      expect(manager.update).not.toHaveBeenCalled();
    });

    it('should close the gap in the old list and open one in the new list when moving a card across lists', async () => {
      const taskId = 1;
      const fromCategory = generateMockCategory(1);
      const toCategory = generateMockCategory(2);
      const task: Task = {
        ...generateMockTask(taskId, fromCategory),
        index: 1,
      };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const target = generateMockQueryBuilder({ getOne: toCategory });
      const count = generateMockQueryBuilder({ getCount: 2 });
      const closeGap = generateMockQueryBuilder();
      const openGap = generateMockQueryBuilder();
      const manager = generateMockEntityManager([
        lock,
        read,
        target,
        count,
        closeGap,
        openGap,
      ]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.updateTask(taskId, {
        index: 0,
        categoryId: 2,
      });

      expect(result).toEqual({ ...task, index: 0, category: toCategory });
      expect(target.andWhere).toHaveBeenCalledWith(
        'source.id = :fromCategoryId',
        { fromCategoryId: 1 }
      );
      expect(closeGap.set.mock.calls[0][0].index()).toBe('"index" + -1');
      expect(closeGap.where).toHaveBeenCalledWith(
        '"categoryId" = :categoryId',
        { categoryId: 1 }
      );
      expect(closeGap.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 2 }],
      ]);
      expect(openGap.set.mock.calls[0][0].index()).toBe('"index" + 1');
      expect(openGap.where).toHaveBeenCalledWith('"categoryId" = :categoryId', {
        categoryId: 2,
      });
      expect(openGap.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 0 }],
      ]);
      expect(manager.update).toHaveBeenCalledWith(TaskEntity, taskId, {
        index: 0,
        category: { id: 2 },
      });
    });

    it('should throw BadRequestException when moving a card to a list on another board', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const target = generateMockQueryBuilder({ getOne: null });
      const manager = generateMockEntityManager([lock, read, target]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await expect(
        service.updateTask(taskId, { index: 0, categoryId: 9 })
      ).rejects.toThrow(
        'Cannot move to different to category in different project'
      );

      expect(manager.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the index is past the end of the new list', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const target = generateMockQueryBuilder({
        getOne: generateMockCategory(2),
      });
      const count = generateMockQueryBuilder({ getCount: 2 });
      const manager = generateMockEntityManager([lock, read, target, count]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await expect(
        service.updateTask(taskId, { index: 3, categoryId: 2 })
      ).rejects.toThrow(
        'Index cannot be bigger than the current length of tasks'
      );

      expect(manager.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and close the gap it leaves', async () => {
      const taskId = 1;
      const task: Task = {
        ...generateMockTask(taskId, generateMockCategory(3)),
        index: 1,
      };
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: task });
      const shift = generateMockQueryBuilder();
      const manager = generateMockEntityManager([lock, read, shift]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      const result = await service.deleteTask(taskId);

      expect(result).toBe(task);
      expect(manager.delete).toHaveBeenCalledWith(TaskEntity, taskId);
      expect(shift.set.mock.calls[0][0].index()).toBe('"index" + -1');
      expect(shift.where).toHaveBeenCalledWith('"categoryId" = :categoryId', {
        categoryId: 3,
      });
      expect(shift.andWhere.mock.calls).toEqual([
        ['"index" >= :from', { from: 2 }],
      ]);
    });

    it('should throw NotFoundException if the task is not found', async () => {
      const taskId = 1;
      const lock = generateMockQueryBuilder();
      const read = generateMockQueryBuilder({ getOne: null });
      const manager = generateMockEntityManager([lock, read]);
      (taskRepository.manager.transaction as jest.Mock).mockImplementation(
        async (run) => await run(manager)
      );

      await expect(service.deleteTask(taskId)).rejects.toThrow(
        `Task with ID ${taskId} not found`
      );

      expect(manager.delete).not.toHaveBeenCalled();
    });
  });

  describe('isMember', () => {
    it('should check the whole chain from task to the user in one query', async () => {
      const user = generateMockUser(7);
      const query = generateMockQueryBuilder({ getExists: true });
      jest
        .spyOn(taskRepository, 'createQueryBuilder')
        .mockReturnValue(query as any);

      const result = await service.isMember(user, 3);

      expect(result).toBe(true);
      expect(query.innerJoin.mock.calls).toEqual([
        ['task.category', 'category'],
        ['category.project', 'project'],
        ['project.group', 'group'],
        ['group.users', 'user', 'user.id = :userId', { userId: 7 }],
      ]);
      expect(query.where).toHaveBeenCalledWith('task.id = :taskId', {
        taskId: 3,
      });
    });

    it('should return false when the user is not in the workspace', async () => {
      const user = generateMockUser(7);
      const query = generateMockQueryBuilder({ getExists: false });
      jest
        .spyOn(taskRepository, 'createQueryBuilder')
        .mockReturnValue(query as any);

      const result = await service.isMember(user, 3);

      expect(result).toBe(false);
    });
  });
});
