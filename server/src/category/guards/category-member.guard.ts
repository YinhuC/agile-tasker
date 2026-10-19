import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../shared/interfaces/user.interface';
import { CategoryService } from '../services/category.service';

@Injectable()
export class CategoryMemberGuard implements CanActivate {
  constructor(private categoryService: CategoryService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<{ id: string }> = context.switchToHttp().getRequest();
    const user: Partial<User> = request.user;
    const isMember = await this.categoryService.isMember(
      user,
      parseInt(request.params.id)
    );
    if (!isMember) {
      throw new ForbiddenException('You have no access to this category');
    }
    return isMember;
  }
}
