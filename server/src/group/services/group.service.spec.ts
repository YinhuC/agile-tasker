import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Group as GroupEntity } from '../../shared/entities/group.entity';
import { Repository } from 'typeorm';
import { Group } from '../../shared/interfaces/group.interface';
import { User } from '../../shared/interfaces/user.interface';
import {
  generateMockUser,
  generateMockUsers,
} from '../../shared/mock/user.mock';
import {
  generateMockGroup,
  generateMockGroupDto,
  generateMockGroups,
} from '../../shared/mock/group.mock';
import { NotFoundException } from '@nestjs/common';
import { CreateGroupDTO } from '../dto/create-group.dto';
import { GroupResponse } from '../utils/group.types';
import { UpdateGroupDto } from '../dto/update-group.dto';

describe('GroupService', () => {
  const GROUP_REPOSITROY_TOKEN = getRepositoryToken(GroupEntity);

  let service: GroupService;
  let userService: UserService;
  let groupRepository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: GROUP_REPOSITROY_TOKEN,
          useClass: jest.fn(() => ({
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
          })),
        },
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    userService = module.get<UserService>(UserService);
    groupRepository = module.get<Repository<Group>>(GROUP_REPOSITROY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGroups', () => {
    it('should return all groups for a user', async () => {
      const user: User = generateMockUser(1);
      const groups: Group[] = generateMockGroups(3);

      jest.spyOn(groupRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(groups),
      } as any);

      const result = await service.getAllGroups(user);

      expect(groupRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBe(groups);
    });
  });

  describe('getGroupById', () => {
    it('should return a group by ID', async () => {
      const groupId = 1;
      const group = generateMockGroup(groupId);

      jest.spyOn(groupRepository, 'findOne').mockResolvedValue(group);

      const result = await service.getGroupById(groupId);

      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { id: groupId },
      });
      expect(result).toBe(group);
    });

    it('should throw NotFoundException if group is not found', async () => {
      const groupId = 1;

      jest.spyOn(groupRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getGroupById(groupId)).rejects.toThrow(
        NotFoundException
      );
      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { id: groupId },
      });
    });
  });

  describe('createGroup', () => {
    it('should create a new group', async () => {
      const user: User = generateMockUser(1);
      const createGroupDto: CreateGroupDTO = generateMockGroupDto();
      const users: User[] = generateMockUsers(3);
      const newGroup = {} as GroupEntity;
      const response = {} as GroupResponse;

      const getUsersFromEmailsSpy = jest
        .spyOn(service as any, 'getUsersFromEmails')
        .mockResolvedValue(users);
      jest.spyOn(groupRepository, 'create').mockReturnValue(newGroup);
      jest.spyOn(groupRepository, 'save').mockResolvedValue(response);

      const result = await service.createGroup(user, createGroupDto);

      expect(getUsersFromEmailsSpy).toHaveBeenCalledWith(
        createGroupDto.emails,
        expect.any(Array)
      );
      expect(groupRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createGroupDto.name,
          owner: user,
          users: expect.arrayContaining([user, ...users]),
        })
      );
      expect(groupRepository.save).toHaveBeenCalledWith(newGroup);
      expect(result).toEqual(expect.objectContaining(response));
    });
  });

  describe('updateGroup', () => {
    it('should update a group', async () => {
      const groupId = 1;
      const updateGroupDto: UpdateGroupDto = {
        name: 'Test Group',
      };
      const group = {} as GroupEntity;
      const users: User[] = [];
      const response = {} as GroupResponse;

      jest.spyOn(service as any, 'getGroupWithUsers').mockResolvedValue(group);
      const getUsersFromEmailsSpy = jest
        .spyOn(service as any, 'getUsersFromEmails')
        .mockResolvedValue(users);
      jest.spyOn(groupRepository, 'save').mockResolvedValue(response);

      const result = await service.updateGroup(groupId, updateGroupDto);

      expect(service['getGroupWithUsers']).toHaveBeenCalledWith(groupId);
      expect(getUsersFromEmailsSpy).toHaveBeenCalledWith(
        updateGroupDto.emails,
        expect.any(Array)
      );
      expect(groupRepository.save).toHaveBeenCalledWith(group);
      expect(result).toEqual(expect.objectContaining(response));
    });

    it('should throw NotFoundException if group is not found', async () => {
      const groupId = 1;
      const updateGroupDto: UpdateGroupDto = {
        name: 'Test Group',
      };

      jest
        .spyOn(service as any, 'getGroupWithUsers')
        .mockResolvedValue(undefined);

      await expect(
        service.updateGroup(groupId, updateGroupDto)
      ).rejects.toThrow(NotFoundException);
      expect(service['getGroupWithUsers']).toHaveBeenCalledWith(groupId);
    });
  });

  describe('isOwner', () => {
    it('should return true if the user is the owner of the group', async () => {
      const userId = 1;
      const groupId = 1;
      const user: Partial<User> = { id: userId };
      const group: GroupEntity = {
        id: groupId,
        owner: { id: userId },
      } as GroupEntity;

      jest.spyOn(service as any, 'getGroupWithOwner').mockResolvedValue(group);

      const result = await service.isOwner(user, groupId);

      expect(result).toBe(true);
      expect(service['getGroupWithOwner']).toHaveBeenCalledWith(groupId);
    });

    it('should return false if the user is not the owner of the group', async () => {
      const userId = 1;
      const groupId = 1;
      const user: Partial<User> = { id: userId };
      const group: GroupEntity = {
        id: groupId,
        owner: { id: 2 },
      } as GroupEntity;

      jest.spyOn(service as any, 'getGroupWithOwner').mockResolvedValue(group);

      const result = await service.isOwner(user, groupId);

      expect(result).toBe(false);
      expect(service['getGroupWithOwner']).toHaveBeenCalledWith(groupId);
    });

    it('should return false if the group does not have an owner', async () => {
      const userId = 1;
      const groupId = 1;
      const user: Partial<User> = { id: userId };
      const group: GroupEntity = { id: groupId, owner: null } as GroupEntity;

      jest.spyOn(service as any, 'getGroupWithOwner').mockResolvedValue(group);

      const result = await service.isOwner(user, groupId);

      expect(result).toBe(false);
      expect(service['getGroupWithOwner']).toHaveBeenCalledWith(groupId);
    });
  });

  describe('isMember', () => {
    it('should return true if the user is a member of the group', async () => {
      const userId = 1;
      const groupId = 1;
      const user: Partial<User> = { id: userId };
      const groups: GroupEntity[] = [
        { id: groupId, users: [{ id: userId }] } as GroupEntity,
      ];

      jest.spyOn(userService, 'getUserGroups').mockResolvedValue(groups);

      const result = await service.isMember(user, groupId);

      expect(result).toBe(true);
      expect(userService.getUserGroups).toHaveBeenCalledWith(userId);
    });

    it('should return false if the user is not a member of the group', async () => {
      const userId = 1;
      const groupId = 1;
      const user: Partial<User> = { id: userId };
      const groups: GroupEntity[] = [
        { id: 2, users: [{ id: 2 }] } as GroupEntity,
      ];

      jest.spyOn(userService, 'getUserGroups').mockResolvedValue(groups);

      const result = await service.isMember(user, groupId);

      expect(result).toBe(false);
      expect(userService.getUserGroups).toHaveBeenCalledWith(userId);
    });

    it('should return false if the user does not have any groups', async () => {
      const userId = 1;
      const groupId = 1;
      const user: Partial<User> = { id: userId };

      jest.spyOn(userService, 'getUserGroups').mockResolvedValue(null);

      const result = await service.isMember(user, groupId);

      expect(result).toBe(false);
      expect(userService.getUserGroups).toHaveBeenCalledWith(userId);
    });
  });
});
