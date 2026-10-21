import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from '../services/project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupService } from '../../group/services/group.service';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Project as ProjectEntity } from '../../shared/entities/project.entity';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { generateMockCategory } from '../../shared/mock/category.mock';
import { User } from '../../shared/interfaces/user.interface';
import { GetProjectDto } from '../dto/get-project.dto';
import { Project } from '../../shared/interfaces/project.interface';
import { generateMockUser } from '../../shared/mock/user.mock';
import {
  generateMockProject,
  generateMockProjectDto,
  generateMockProjects,
} from '../../shared/mock/project.mock';
import { generateMockGroup } from '../../shared/mock/group.mock';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

describe('ProjectController', () => {
  let controller: ProjectController;
  let projectService: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(ProjectEntity),
          useValue: {},
        },
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
      controllers: [ProjectController],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGroupProjects', () => {
    it('should return the projects of a group', async () => {
      const user: User = generateMockUser(1);
      const getProjectDto: GetProjectDto = { groupId: 1 };
      const projects: Project[] = generateMockProjects(3, generateMockGroup(1));

      jest
        .spyOn(projectService, 'getAllProjectsByGroupId')
        .mockResolvedValue(projects);

      const result = await controller.getGroupProjects(user, getProjectDto);

      expect(result).toBe(projects);
      expect(projectService.getAllProjectsByGroupId).toHaveBeenCalledWith(
        user,
        getProjectDto.groupId
      );
    });
  });

  describe('getProjectById', () => {
    it('should return a project by its ID', async () => {
      const projectId = 1;
      const project: Project = generateMockProject(1);

      jest.spyOn(projectService, 'getProjectById').mockResolvedValue(project);

      const result = await controller.getProjectById(projectId);

      expect(result).toBe(project);
      expect(projectService.getProjectById).toHaveBeenCalledWith(projectId);
    });
  });

  describe('getBoard', () => {
    it('should return the board of a project', async () => {
      const projectId = 1;
      const board = [{ ...generateMockCategory(1), tasks: [] }];

      jest.spyOn(projectService, 'getBoard').mockResolvedValue(board);

      const result = await controller.getBoard(projectId);

      expect(result).toBe(board);
      expect(projectService.getBoard).toHaveBeenCalledWith(projectId);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const user: User = generateMockUser(1);
      const groupId = 1;
      const createProjectDto: CreateProjectDto =
        generateMockProjectDto(groupId);
      const project: Project = generateMockProject(
        1,
        generateMockGroup(groupId)
      );

      jest.spyOn(projectService, 'createProject').mockResolvedValue(project);

      const result = await controller.createProject(user, createProjectDto);

      expect(result).toBe(project);
      expect(projectService.createProject).toHaveBeenCalledWith(
        user,
        createProjectDto
      );
    });
  });

  describe('updateProject', () => {
    it('should update a project by its ID', async () => {
      const projectId = 1;
      const groupId = 1;
      const updateProjectDto: UpdateProjectDto = { name: 'Updated Project' };
      const project: Project = generateMockProject(
        1,
        generateMockGroup(groupId)
      );

      jest.spyOn(projectService, 'updateProject').mockResolvedValue(project);

      const result = await controller.updateProject(
        projectId,
        updateProjectDto
      );

      expect(result).toBe(project);
      expect(projectService.updateProject).toHaveBeenCalledWith(
        projectId,
        updateProjectDto
      );
    });
  });

  describe('deleteProject', () => {
    it('should delete a project by its ID', async () => {
      const projectId = 1;
      const groupId = 1;
      const project: Project = generateMockProject(
        1,
        generateMockGroup(groupId)
      );

      jest.spyOn(projectService, 'deleteProject').mockResolvedValue(project);

      const result = await controller.deleteProject(projectId);

      expect(result).toBe(project);
      expect(projectService.deleteProject).toHaveBeenCalledWith(projectId);
    });
  });
});
