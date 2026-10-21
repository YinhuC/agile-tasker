import { ExecutionContext } from '@nestjs/common';
import { GroupMemberGuard } from './group-member.guard';
import { GroupService } from '../services/group.service';

describe('GroupMemberGuard', () => {
  it('should reject a non-member with a group access message', async () => {
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

    await expect(guard.canActivate(context)).rejects.toThrow(
      'You have no access to this group'
    );
    expect(groupService.isMember).toHaveBeenCalledTimes(1);
    expect(groupService.isMember).toHaveBeenCalledWith(user, 7);
  });
});
