import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Project as ProjectEntity } from '../../shared/entities/project.entity';
import { Category as CategoryEntity } from '../../shared/entities/category.entity';
import { Project } from '../../shared/interfaces/project.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { GroupService } from '../../group/services/group.service';
import { User } from '../../shared/interfaces/user.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly groupService: GroupService
  ) {}

  async getAllProjectsByGroupId(
    user: User,
    groupId: number
  ): Promise<Project[]> {
    const isMember = await this.groupService.isMember(user, groupId);
    if (!isMember) {
      throw new ForbiddenException(
        'You have no access to projects from this group'
      );
    }
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.group', 'group')
      .where('group.id = :groupId', { groupId })
      .getMany();
  }

  async getProjectById(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: {
        group: true,
      },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return project;
  }

  /** The project's lists in board order, each with its cards in order, in one query. */
  async getBoard(projectId: number): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.tasks', 'task')
      .where('category.projectId = :projectId', { projectId })
      .orderBy('category.index', 'ASC')
      .addOrderBy('task.index', 'ASC')
      .getMany();
  }

  async createProject(
    user: User,
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const { groupId, ...projectDto } = createProjectDto;

    const isMember = await this.groupService.isMember(user, groupId);
    if (!isMember) {
      throw new ForbiddenException(
        'You have rights to create a project for this group'
      );
    }

    const group = await this.groupService.getGroupById(groupId);
    const project = {
      ...projectDto,
      group,
    };
    const newProject = this.projectRepository.create(project);
    return await this.projectRepository.save(newProject);
  }

  async updateProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    const project = await this.getProjectById(projectId);
    const updatedProject = { ...project, ...updateProjectDto };
    return await this.projectRepository.save(updatedProject);
  }

  async deleteProject(projectId: number): Promise<Project> {
    const project = await this.getProjectById(projectId);
    const result = await this.projectRepository.delete(projectId);
    if (!result || result.affected === 0) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return project;
  }

  async isMember(user: Partial<User>, projectId: number): Promise<boolean> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.group', 'group')
      .innerJoin('group.users', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .where('project.id = :projectId', { projectId })
      .getExists();
  }
}
