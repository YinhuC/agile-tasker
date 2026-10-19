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
  generateMockTasks,
} from '../../shared/mock/task.mock';
import { generateMockUser } from '../../shared/mock/user.mock';
import { CreateTaskDto } from '../dto/create-task.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { generateMockCategory } from '../../shared/mock/category.mock';
import { Category } from '../../shared/interfaces/category.interface';
import { generateMockProject } from '../../shared/mock/project.mock';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TaskService', () => {
  const TASK_REPOSITROY_TOKEN = getRepositoryToken(TaskEntity);

  let service: TaskService;
  let categoryService: CategoryService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TASK_REPOSITROY_TOKEN,
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
    taskRepository = module.get<Repository<Task>>(TASK_REPOSITROY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasksByCategoryId', () => {
    it('should return an array of tasks', async () => {
      const user = generateMockUser(1);
      const categoryId = 1;
      const tasks: Task[] = generateMockTasks(3);

      jest.spyOn(categoryService, 'isMember').mockResolvedValue(true);
      jest.spyOn(taskRepository, 'find').mockResolvedValue(tasks);

      const result = await service.getAllTasksByCategoryId(user, categoryId);

      expect(result).toBe(tasks);
      expect(categoryService.isMember).toHaveBeenCalledWith(user, categoryId);
      expect(taskRepository.find).toHaveBeenCalledWith({
        where: { category: { id: categoryId } },
        relations: { category: true },
      });
    });

    it('should throw a ForbiddenException if user is not a member', async () => {
      const user = generateMockUser(1);
      const categoryId = 1;

      jest.spyOn(categoryService, 'isMember').mockResolvedValue(false);

      await expect(
        service.getAllTasksByCategoryId(user, categoryId)
      ).rejects.toThrow('You have no access to projects from this group');

      expect(categoryService.isMember).toHaveBeenCalledWith(user, categoryId);
    });
  });

  describe('getTaskById', () => {
    it('should return a task', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId);

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);

      const result = await service.getTaskById(taskId);

      expect(result).toBe(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: { category: true },
      });
    });

    it('should throw a NotFoundException if task is not found', async () => {
      const taskId = 1;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getTaskById(taskId)).rejects.toThrow(
        `Task with ID ${taskId} not found`
      );

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: { category: true },
      });
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const user = generateMockUser(1);
      const projectId = 1;
      const createTaskDto: CreateTaskDto = generateMockTaskDto(1);
      const { categoryId, ...categoryData } = createTaskDto;
      const existingTasks: Task[] = generateMockTasks(
        3,
        generateMockCategory(categoryId)
      );
      const nextIndex = existingTasks.length + 1;

      const category: Category = generateMockCategory(
        categoryId,
        generateMockProject(projectId)
      );
      const task: Task = generateMockTask(1);

      jest.spyOn(categoryService, 'isMember').mockResolvedValue(true);
      jest
        .spyOn(service, 'getAllTasksByCategoryId')
        .mockResolvedValue(existingTasks);
      jest
        .spyOn(categoryService, 'getCategoryById')
        .mockResolvedValue(category);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.createTask(user, createTaskDto);

      expect(result).toBe(task);
      expect(categoryService.isMember).toHaveBeenCalledWith(
        user,
        createTaskDto.categoryId
      );
      expect(service.getAllTasksByCategoryId).toHaveBeenCalledWith(
        user,
        createTaskDto.categoryId
      );
      expect(categoryService.getCategoryById).toHaveBeenCalledWith(
        createTaskDto.categoryId
      );
      expect(taskRepository.create).toHaveBeenCalledWith({
        ...categoryData,
        category,
        index: nextIndex,
      });
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should throw ForbiddenException if the user is not a member of the category', async () => {
      const user = generateMockUser(1);
      const categoryId = 1;
      const createTaskDto: CreateTaskDto = generateMockTaskDto(categoryId);

      jest.spyOn(categoryService, 'isMember').mockResolvedValue(false);

      await expect(
        service.createTask(user, createTaskDto)
      ).rejects.toThrow(ForbiddenException);

      expect(categoryService.isMember).toHaveBeenCalledWith(
        user,
        createTaskDto.categoryId
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task within the same category', async () => {
      const user = generateMockUser(1);
      const taskId = 1;
      const categoryId = 1;
      const updateTaskDto: UpdateTaskDto = { index: 1, categoryId };
      const category: Category = generateMockCategory(categoryId);
      const task: Task = generateMockTask(taskId, category);
      const tasks: Task[] = generateMockTasks(3, category);
      const updatedTask: Task = { ...task, ...updateTaskDto };

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest.spyOn(service, 'getAllTasksByCategoryId').mockResolvedValue(tasks);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(updatedTask);

      const result = await service.updateTask(user, taskId, updateTaskDto);

      expect(result).toBe(updatedTask);
      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
      expect(service.getAllTasksByCategoryId).toHaveBeenCalledWith(
        user,
        task.category.id
      );
      expect(taskRepository.save).toHaveBeenCalledWith(tasks);
    });

    it('should throw BadRequestException if the index is bigger than the current length of tasks', async () => {
      const user = generateMockUser(1);
      const taskId = 1;
      const categoryId = 1;
      const updateTaskDto: UpdateTaskDto = { index: 3, categoryId };
      const category: Category = generateMockCategory(categoryId);
      const task: Task = generateMockTask(taskId, category);
      const tasks: Task[] = generateMockTasks(3, category);

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest.spyOn(service, 'getAllTasksByCategoryId').mockResolvedValue(tasks);

      await expect(
        service.updateTask(user, taskId, updateTaskDto)
      ).rejects.toThrow(BadRequestException);

      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
      expect(service.getAllTasksByCategoryId).toHaveBeenCalledWith(
        user,
        task.category.id
      );
    });

    it('should throw ForbiddenException if the user is not a member of the category', async () => {
      const user = generateMockUser(1);
      const taskId = 1;
      const categoryId = 2;
      const category: Category = generateMockCategory(categoryId);
      const updateTaskDto: UpdateTaskDto = { index: 1, categoryId };
      const task: Task = generateMockTask(taskId, category);

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest.spyOn(categoryService, 'isMember').mockResolvedValue(false);

      await expect(
        service.updateTask(user, taskId, updateTaskDto)
      ).rejects.toThrow(ForbiddenException);

      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
      expect(categoryService.isMember).toHaveBeenCalledWith(
        user,
        updateTaskDto.categoryId
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const user = generateMockUser(1);
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest.spyOn(service, 'getAllTasksByCategoryId').mockResolvedValue([]);
      jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: undefined });

      await service.deleteTask(user, taskId);

      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
      expect(service.getAllTasksByCategoryId).toHaveBeenCalledWith(
        user,
        task.category.id
      );
      expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw ForbiddenException if the user is not a member of the category', async () => {
      const user = generateMockUser(1);
      const taskId = 1;
      const task: Task = generateMockTask(taskId, generateMockCategory(1));

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest.spyOn(categoryService, 'isMember').mockResolvedValue(false);

      await expect(service.deleteTask(user, taskId)).rejects.toThrow(
        ForbiddenException
      );

      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
      expect(categoryService.isMember).toHaveBeenCalledWith(
        user,
        task.category.id
      );
    });
  });
});
