import { ExecutionContext } from '@nestjs/common';
import { GroupMemberGuard } from './group-member.guard';
import { GroupService } from '../services/group.service';

describe('GroupMemberGuard', () => {
  it('should answer a non-member with not found', async () => {
    const groupService = {
      isMember: jest.fn().mockResolvedValue(false),
    } as unknown as GroupService;
    const guard = new GroupMemberGuard(groupService);
    const user = { id: 1 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user, params: { id: '7' } }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Group not found');
    expect(groupService.isMember).toHaveBeenCalledTimes(1);
    expect(groupService.isMember).toHaveBeenCalledWith(user, 7);
  });
});
