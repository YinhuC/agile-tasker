import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../shared/interfaces/user.interface';
import { GroupService } from '../services/group.service';

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(private groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<{ id: string }> = context.switchToHttp().getRequest();
    const user: Partial<User> = request.user;
    const isMember = await this.groupService.isMember(
      user,
      parseInt(request.params.id)
    );
    if (!isMember) {
      throw new ForbiddenException('You have no access to this project');
    }
    return isMember;
  }
}
