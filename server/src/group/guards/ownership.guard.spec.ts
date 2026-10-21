import { ExecutionContext } from '@nestjs/common';
import { OwnershipGuard } from './ownership.guard';
import { GroupService } from '../services/group.service';

describe('OwnershipGuard', () => {
  it('should answer a non-member with not found', async () => {
    const groupService = {
      isMember: jest.fn().mockResolvedValue(false),
      isOwner: jest.fn(),
    } as unknown as GroupService;
    const guard = new OwnershipGuard(groupService);
    const user = { id: 1 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user, params: { id: '7' } }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Group not found');
    expect(groupService.isMember).toHaveBeenCalledTimes(1);
    expect(groupService.isMember).toHaveBeenCalledWith(user, 7);
    expect(groupService.isOwner).not.toHaveBeenCalled();
  });

  it('should refuse a member who is not the owner', async () => {
    const groupService = {
      isMember: jest.fn().mockResolvedValue(true),
      isOwner: jest.fn().mockResolvedValue(false),
    } as unknown as GroupService;
    const guard = new OwnershipGuard(groupService);
    const user = { id: 1 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user, params: { id: '7' } }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(groupService.isOwner).toHaveBeenCalledTimes(1);
    expect(groupService.isOwner).toHaveBeenCalledWith(user, 7);
  });

  it('should let the owner through', async () => {
    const groupService = {
      isMember: jest.fn().mockResolvedValue(true),
      isOwner: jest.fn().mockResolvedValue(true),
    } as unknown as GroupService;
    const guard = new OwnershipGuard(groupService);
    const user = { id: 1 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user, params: { id: '7' } }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(groupService.isOwner).toHaveBeenCalledWith(user, 7);
  });
});
