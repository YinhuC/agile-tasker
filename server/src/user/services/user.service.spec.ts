import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { User } from '../../shared/interfaces/user.interface';
import { generateMockUser } from '../../shared/mock/user.mock';
import { NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';

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
    });

    it('should not copy an id or groups from the request onto the new user', async () => {
      const userData = {
        email: 'sam@example.com',
        firstname: 'Sam',
        lastname: 'Lee',
        password: 'Password1',
        id: 99,
        groups: [{ id: 7 }],
      } as Partial<User>;
      jest.spyOn(userRepository, 'create').mockReturnValue({} as UserEntity);
      jest.spyOn(userRepository, 'save').mockResolvedValue({} as UserEntity);

      await service.create(userData);

      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'sam@example.com',
        firstname: 'Sam',
        lastname: 'Lee',
        password: expect.stringMatching(/^\$2b\$/),
      });
    });
  });
});
