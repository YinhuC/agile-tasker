import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../shared/interfaces/user.interface';
import { GroupService } from '../services/group.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<{ id: string }> = context.switchToHttp().getRequest();
    const user: Partial<User> = request.user;
    const groupId: number = parseInt(request.params.id);
    const isOwner: boolean = await this.groupService.isOwner(user, groupId);
    return isOwner;
  }
}
