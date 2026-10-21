import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Task } from '../../shared/interfaces/task.interface';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthUser } from '../../user/decorators/user.decorator';
import { User } from '../../shared/interfaces/user.interface';
import { AuthenticatedGuard } from '../../auth/guards/auth.guard';
import { TaskMemberGuard } from '../guards/task-member.guard';

@UseGuards(AuthenticatedGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  @UseGuards(TaskMemberGuard)
  async getTaskById(@Param('id') id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  async createTask(
    @AuthUser() user: User,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Task> {
    return await this.taskService.createTask(user, createTaskDto);
  }

  @Put(':id')
  @UseGuards(TaskMemberGuard)
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return await this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(TaskMemberGuard)
  async deleteTask(@Param('id') id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }
}
