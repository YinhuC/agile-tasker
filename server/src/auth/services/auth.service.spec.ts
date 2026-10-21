import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../../shared/interfaces/user.interface';
import {
  generateMockUser,
  generateMockUserDto,
} from '../../shared/mock/user.mock';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
      })),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = generateMockUserDto();
      const createdUser: User = {
        ...registerDto,
        id: 1,
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);
      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        registerDto.email
      );
      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ ...createdUser, password: undefined });
    });

    it('should throw BadRequestException if user with email already exists', async () => {
      const registerDto: RegisterDto = generateMockUserDto();
      const existingUser: User = {
        ...registerDto,
        id: 1,
      };

      jest
        .spyOn(userService, 'findUserByEmail')
        .mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException
      );
      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        registerDto.email
      );
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: User = generateMockUser(1, email, password);

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'comparePassword').mockResolvedValue(true);

      const result = await service.login(email, password);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(userService.comparePassword).toHaveBeenCalledWith(user, password);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user with email does not exist', async () => {
      const email = 'test@example.com';
      const password = 'password';

      jest
        .spyOn(userService, 'findUserByEmail')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password')
      );
      expect(userService.findUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: User = generateMockUser(1, email, password);

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'comparePassword').mockResolvedValue(false);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password')
      );
      expect(userService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(userService.comparePassword).toHaveBeenCalledWith(user, password);
    });
  });
});
