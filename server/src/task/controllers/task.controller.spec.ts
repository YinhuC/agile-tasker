import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';
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
import { User } from '../../shared/interfaces/user.interface';
import { generateMockUser } from '../../shared/mock/user.mock';
import { generateMockTask } from '../../shared/mock/task.mock';
import { Task } from '../../shared/interfaces/task.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {},
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
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId);

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);

      const result = await controller.getTaskById(taskId);

      expect(result).toEqual(task);
      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const user: User = generateMockUser(1);
      const createTaskDto: CreateTaskDto = { name: 'Task 1', categoryId: 1 };
      const task: Task = generateMockTask(1);

      jest.spyOn(service, 'createTask').mockResolvedValue(task);

      const result = await controller.createTask(user, createTaskDto);

      expect(result).toEqual(task);
      expect(service.createTask).toHaveBeenCalledWith(user, createTaskDto);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const categoryId = 1;
      const updateTaskDto: UpdateTaskDto = {
        name: 'Updated Task',
        categoryId,
      };
      const updatedTask: Task = {
        ...generateMockTask(1),
        name: updateTaskDto.name,
      };

      jest.spyOn(service, 'updateTask').mockResolvedValue(updatedTask);

      const result = await controller.updateTask(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(service.updateTask).toHaveBeenCalledWith(taskId, updateTaskDto);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = 1;
      const task: Task = generateMockTask(taskId);

      jest.spyOn(service, 'deleteTask').mockResolvedValue(task);

      const result = await controller.deleteTask(taskId);

      expect(result).toEqual(task);
      expect(service.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });
});
