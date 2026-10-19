import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../shared/interfaces/user.interface';
import { ProjectService } from '../services/project.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<{ id: string }> = context.switchToHttp().getRequest();
    const user: Partial<User> = request.user;
    const isMember = await this.projectService.isMember(
      user,
      parseInt(request.params.id)
    );
    if (!isMember) {
      throw new ForbiddenException('You have no access to this project');
    }
    return isMember;
  }
}
