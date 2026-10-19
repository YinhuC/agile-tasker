import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Group } from '../../shared/interfaces/group.interface';
import { CreateGroupDTO } from '../dto/create-group.dto';
import { User } from '../../shared/interfaces/user.interface';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { UserService } from '../../user/services/user.service';
import { GroupResponse } from '../utils/group.types';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly userService: UserService
  ) {}

  async getAllGroups(user: User): Promise<Group[]> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('group.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async getGroupById(groupId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return group;
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

  private async getGroupWithUsers(id: number): Promise<Group> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'users')
      .where('group.id = :id', { id })
      .getOne();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async createGroup(
    user: User,
    createGroupDto: CreateGroupDTO
  ): Promise<GroupResponse> {
    const { name, emails } = createGroupDto;
    const notFoundUsers: string[] = [];
    const users = await this.getUsersFromEmails(emails, notFoundUsers);
    const group = {
      name,
      owner: user,
      users: [...users, user],
    };
    const newGroup = this.groupRepository.create(group);
    const response = await this.groupRepository.save(newGroup);
    return { ...response, notFoundUsers };
  }

  async updateGroup(
    id: number,
    updateGroupDto: UpdateGroupDto
  ): Promise<GroupResponse> {
    const { name, emails } = updateGroupDto;
    const notFoundUsers: string[] = [];
    const group = await this.getGroupWithUsers(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const users = await this.getUsersFromEmails(emails, notFoundUsers);

    Object.assign(group, {
      name: name ? name : group.name,
      users: group.users && [...group.users, ...users],
    });

    const response = await this.groupRepository.save(group);
    return { ...response, notFoundUsers };
  }

  async deleteGroup(id: number): Promise<Group> {
    const group = await this.getGroupById(id);
    const result = await this.groupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async isOwner(user: Partial<User>, groupId: number): Promise<boolean> {
    const group = await this.getGroupWithOwner(groupId);
    if (!group.owner) return false;
    return group.owner.id === user.id;
  }

  async isMember(user: Partial<User>, groupId: number): Promise<boolean> {
    const groups = await this.userService.getUserGroups(user.id);
    if (!groups) return false;
    return groups.some((group) => group.id == groupId);
  }

  private async getUsersFromEmails(
    emails: string[],
    notFoundUsers: string[]
  ): Promise<User[]> {
    if (!emails) return [];
    const users = await Promise.all(
      emails.map(async (email) => {
        let user = null;
        try {
          user = await this.userService.findUserByEmail(email);
        } catch (error) {
          console.error(`User not found for email: ${email}`);
          notFoundUsers.push(email);
        }
        return user;
      })
    );
    const filteredUsers: User[] = users.filter((user) => user !== null);

    return filteredUsers;
  }
}
