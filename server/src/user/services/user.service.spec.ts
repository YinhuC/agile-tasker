import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { User } from '../../shared/interfaces/user.interface';
import {
  generateMockUser,
  generateMockUsers,
} from '../../shared/mock/user.mock';
import { NotFoundException } from '@nestjs/common';
import { generateMockGroups } from '../../shared/mock/group.mock';
import { UpdateUserDto } from '../dto/update-user';

describe('UserService', () => {
  const USER_REPOSITROY_TOKEN = getRepositoryToken(UserEntity);

  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITROY_TOKEN,
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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITROY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = generateMockUsers(8);
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAllUsers();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return the user with the specified ID', async () => {
      const userId = 1;
      const user: User = generateMockUser(userId);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findUserById(userId);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findUserById(userId)).rejects.toThrow(
        NotFoundException
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('getUserGroups', () => {
    it('should return the groups of the user with the specified ID', async () => {
      const userId = 1;
      const user: User = generateMockUser(userId);
      user.groups = generateMockGroups(2);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.getUserGroups(userId);

      expect(result).toEqual(user.groups);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: { groups: true },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getUserGroups(userId)).rejects.toThrow(
        NotFoundException
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: { groups: true },
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should return the user with the specified email', async () => {
      const email = 'test@example.com';
      const user: User = generateMockUser(1);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findUserByEmail(email);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findUserByEmail(email)).rejects.toThrow(
        NotFoundException
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData: User = generateMockUser(1);
      const createdUser: User = userData;

      jest.spyOn(userRepository, 'create').mockReturnValue(createdUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);

      const result = await service.create(userData);

      expect(result).toEqual(createdUser);
      // expect(userRepository.create).toHaveBeenCalledWith(createdUser);
      // expect(userRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update the user with the specified ID', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { firstname: 'John' };
      const user: User = generateMockUser(userId);
      const updatedUser: User = { ...user, ...updateUserDto };
      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(service.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { firstname: 'John' };
      jest.spyOn(service, 'findUserById').mockResolvedValue(undefined);

      await expect(
        service.updateUser(userId, updateUserDto)
      ).rejects.toThrow(NotFoundException);
      expect(service.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
