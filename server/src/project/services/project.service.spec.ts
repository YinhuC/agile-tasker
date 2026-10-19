import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupService } from '../../group/services/group.service';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Project as ProjectEntity } from '../../shared/entities/project.entity';
import { Repository } from 'typeorm';
import { Project } from '../../shared/interfaces/project.interface';
import { User } from '../../shared/interfaces/user.interface';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { generateMockUser } from '../../shared/mock/user.mock';
import { generateMockGroup } from '../../shared/mock/group.mock';
import {
  generateMockProject,
  generateMockProjectDto,
  generateMockProjects,
} from '../../shared/mock/project.mock';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

describe('ProjectService', () => {
  const PROJECT_REPOSITROY_TOKEN = getRepositoryToken(ProjectEntity);

  let service: ProjectService;
  let groupService: GroupService;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PROJECT_REPOSITROY_TOKEN,
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

    service = module.get<ProjectService>(ProjectService);
    groupService = module.get<GroupService>(GroupService);
    projectRepository = module.get<Repository<Project>>(
      PROJECT_REPOSITROY_TOKEN
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProjectsByGroupId', () => {
    it('should return an array of projects if the user is a member of the group', async () => {
      const user: User = generateMockUser(1);
      const groupId = 1;
      const projects: Project[] = generateMockProjects(
        1,
        generateMockGroup(groupId)
      );

      jest.spyOn(groupService, 'isMember').mockResolvedValue(true);
      jest.spyOn(projectRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(projects),
      } as any);

      const result = await service.getAllProjectsByGroupId(user, groupId);

      expect(result).toBe(projects);
      expect(groupService.isMember).toHaveBeenCalledWith(user, groupId);
      expect(projectRepository.createQueryBuilder).toHaveBeenCalledWith(
        'project'
      );
      expect(
        projectRepository.createQueryBuilder().leftJoinAndSelect
      ).toHaveBeenCalledWith('project.group', 'group');
      expect(projectRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'group.id = :groupId',
        { groupId }
      );
      expect(projectRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should throw a ForbiddenException if the user is not a member of the group', async () => {
      const user: User = generateMockUser(1);
      const groupId = 1;

      jest.spyOn(groupService, 'isMember').mockResolvedValue(false);

      await expect(
        service.getAllProjectsByGroupId(user, groupId)
      ).rejects.toThrow(ForbiddenException);

      expect(groupService.isMember).toHaveBeenCalledWith(user, groupId);
    });
  });

  describe('getProjectById', () => {
    it('should return a project by ID if it exists', async () => {
      const projectId = 1;
      const project: Project = generateMockProject(
        projectId,
        generateMockGroup(1)
      );

      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project);

      const result = await service.getProjectById(projectId);

      expect(result).toBe(project);
      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: projectId },
        relations: { group: true },
      });
    });

    it('should throw a NotFoundException if the project does not exist', async () => {
      const projectId = 1;

      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getProjectById(projectId)).rejects.toThrow(
        NotFoundException
      );

      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: projectId },
        relations: { group: true },
      });
    });
  });

  describe('createProject', () => {
    it('should create a new project if the user is a member of the group', async () => {
      const user: User = generateMockUser(1);
      const createProjectDto: CreateProjectDto = generateMockProjectDto(1);
      const { groupId, ...projectData } = createProjectDto;
      const group = generateMockGroup(groupId);
      const project: Project = {
        ...projectData,
        id: 1,
      };

      jest.spyOn(groupService, 'isMember').mockResolvedValue(true);
      jest.spyOn(groupService, 'getGroupById').mockResolvedValue(group);
      jest.spyOn(projectRepository, 'create').mockReturnValue(project);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(project);

      const result = await service.createProject(user, createProjectDto);

      expect(result).toBe(project);
      expect(groupService.isMember).toHaveBeenCalledWith(
        user,
        createProjectDto.groupId
      );
      expect(groupService.getGroupById).toHaveBeenCalledWith(
        createProjectDto.groupId
      );
      expect(projectRepository.create).toHaveBeenCalledWith({
        ...projectData,
        group,
      });
      expect(projectRepository.save).toHaveBeenCalledWith(project);
    });

    it('should throw a ForbiddenException if the user is not a member of the group', async () => {
      const user: User = generateMockUser(1);
      const groupId = 1;
      const createProjectDto: CreateProjectDto =
        generateMockProjectDto(groupId);

      jest.spyOn(groupService, 'isMember').mockResolvedValue(false);

      await expect(
        service.createProject(user, createProjectDto)
      ).rejects.toThrow(ForbiddenException);

      expect(groupService.isMember).toHaveBeenCalledWith(
        user,
        createProjectDto.groupId
      );
    });
  });

  describe('updateProject', () => {
    it('should update a project if it exists', async () => {
      const projectId = 1;
      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated Project',
      };
      const project: Project = generateMockProject(
        projectId,
        generateMockGroup(1)
      );
      const updatedProject: Project = {
        ...project,
        name: updateProjectDto.name,
      };

      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(updatedProject);

      const result = await service.updateProject(projectId, updateProjectDto);

      expect(result).toBe(updatedProject);
      expect(service.getProjectById).toHaveBeenCalledWith(projectId);
      expect(projectRepository.save).toHaveBeenCalledWith(updatedProject);
    });

    it('should throw a NotFoundException if the project does not exist', async () => {
      const projectId = 1;
      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated Project',
      };

      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateProject(projectId, updateProjectDto)
      ).rejects.toThrow(NotFoundException);

      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: projectId },
        relations: ['group'],
      });
      expect(projectRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project if it exists', async () => {
      const projectId = 1;
      const project: Project = generateMockProject(
        projectId,
        generateMockGroup(1)
      );
      const deleteResult = { affected: 1, raw: undefined };

      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest.spyOn(projectRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.deleteProject(projectId);

      expect(result).toBe(project);
      expect(service.getProjectById).toHaveBeenCalledWith(projectId);
      expect(projectRepository.delete).toHaveBeenCalledWith(projectId);
    });

    it('should throw a NotFoundException if the project does not exist', async () => {
      const projectId = 1;

      jest.spyOn(service, 'getProjectById').mockResolvedValue(undefined);

      await expect(service.deleteProject(projectId)).rejects.toThrow(
        NotFoundException
      );

      expect(service.getProjectById).toHaveBeenCalledWith(projectId);
    });
  });

  describe('isMember', () => {
    it('should return true if the user is a member of the project group', async () => {
      const user: User = generateMockUser(1);
      const projectId = 1;
      const project: Project = generateMockProject(
        projectId,
        generateMockGroup(1)
      );

      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest.spyOn(groupService, 'isMember').mockResolvedValue(true);

      const result = await service.isMember(user, projectId);

      expect(result).toBe(true);
      expect(service.getProjectById).toHaveBeenCalledWith(projectId);
      expect(groupService.isMember).toHaveBeenCalledWith(
        user,
        project.group.id
      );
    });

    it('should return false if the user is not a member of the project group', async () => {
      const user: User = generateMockUser(1);
      const projectId = 1;
      const project: Project = generateMockProject(
        projectId,
        generateMockGroup(1)
      );

      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest.spyOn(groupService, 'isMember').mockResolvedValue(false);

      const result = await service.isMember(user, projectId);

      expect(result).toBe(false);
      expect(service.getProjectById).toHaveBeenCalledWith(projectId);
      expect(groupService.isMember).toHaveBeenCalledWith(
        user,
        project.group.id
      );
    });
  });
});
