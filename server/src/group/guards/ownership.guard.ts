import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../shared/interfaces/user.interface';
import { parseRowId } from '../../shared/utils/row-id.utils';
import { GroupService } from '../services/group.service';

/** Lets only the owner through; a group the user is not in is a 404, so its existence stays hidden. */
@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<{ id: string }> = context
      .switchToHttp()
      .getRequest();
    const user: Partial<User> = request.user;
    const groupId: number = parseRowId(request.params.id);
    const isMember = await this.groupService.isMember(user, groupId);
    if (!isMember) {
      throw new NotFoundException('Group not found');
    }
    return await this.groupService.isOwner(user, groupId);
  }
}
