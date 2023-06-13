import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../group.entity';
import { CreateGroupDTO } from '../dto/create-group.dto';
import { User } from 'src/user/user.entity';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userService: UserService
  ) {}

  async getAllGroups(user: User): Promise<Group[]> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('group.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async getGroupById(user: User, groupId: number): Promise<Group> {
    const isMember = this.isMember(user, groupId);
    if (!isMember) {
      throw new ForbiddenException('You have no access to this group');
    }
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async createGroup(
    user: User,
    createGroupDto: CreateGroupDTO
  ): Promise<Group> {
    const group = {
      ...createGroupDto,
      owner: user,
      users: [user],
    };
    const newGroup = this.groupRepository.create(group);
    return await this.groupRepository.save(newGroup);
  }

  async updateGroup(
    user: User,
    id: number,
    updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    const group = await this.getGroupById(user, id);
    Object.assign(group, updateGroupDto);
    return this.groupRepository.save(group);
  }

  async deleteGroup(user: User, id: number): Promise<void> {
    const group = await this.getGroupById(user, id);
    await this.groupRepository.remove(group);
  }

  private async getGroupWithOwner(id: number): Promise<Group> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'users')
      .where('group.id = :id', { id })
      .getOne();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async isOwner(user: Partial<User>, groupId: number): Promise<boolean> {
    const group = await this.getGroupWithOwner(groupId);
    return group.owner.id === user.id;
  }

  async isMember(user: Partial<User>, groupId: number): Promise<boolean> {
    const groups = await this.userService.getUserGroups(user.id);
    if (!groups) return false;
    return groups.some((group) => group.id == groupId);
  }
}