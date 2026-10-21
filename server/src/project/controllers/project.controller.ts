import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Project } from '../../shared/interfaces/project.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { AuthenticatedGuard } from '../../auth/guards/auth.guard';
import { AuthUser } from '../../user/decorators/user.decorator';
import { User } from '../../shared/interfaces/user.interface';
import { GetProjectDto } from '../dto/get-project.dto';
import { ProjectMemberGuard } from '../guards/project-member.guard';

@UseGuards(AuthenticatedGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('all')
  async getGroupProjects(
    @AuthUser() user: User,
    @Body() getProjectDto: GetProjectDto
  ): Promise<Project[]> {
    return await this.projectService.getAllProjectsByGroupId(
      user,
      getProjectDto.groupId
    );
  }

  @Get(':id')
  @UseGuards(ProjectMemberGuard)
  async getProjectById(@Param('id') id: number): Promise<Project> {
    return await this.projectService.getProjectById(id);
  }

  @Get(':id/board')
  @UseGuards(ProjectMemberGuard)
  async getBoard(@Param('id') id: number): Promise<Category[]> {
    return await this.projectService.getBoard(id);
  }

  @Post()
  async createProject(
    @AuthUser() user: User,
    @Body() createProjectDto: CreateProjectDto
  ): Promise<Project> {
    return await this.projectService.createProject(user, createProjectDto);
  }

  @Put(':id')
  @UseGuards(ProjectMemberGuard)
  async updateProject(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    return await this.projectService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(ProjectMemberGuard)
  async deleteProject(@Param('id') id: number): Promise<Project> {
    return await this.projectService.deleteProject(id);
  }
}
