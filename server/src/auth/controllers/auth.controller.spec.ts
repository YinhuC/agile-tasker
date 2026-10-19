import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthenticatedGuard } from '../guards/auth.guard';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../../shared/interfaces/user.interface';
import {
  generateMockUser,
  generateMockUserDto,
} from '../../shared/mock/user.mock';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: generateMockUser(1),
        },
      ],
      controllers: [AuthController],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AuthenticatedGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = generateMockUserDto();
      const registeredUser: User = { ...registerDto, id: 1 };

      jest.spyOn(authService, 'register').mockResolvedValue(registeredUser);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toBe(registeredUser);
    });
  });

  describe('login', () => {
    it('should authenticate and return the user', async () => {
      const authenticatedUser: User = generateMockUser(1);

      const result = await controller.login(authenticatedUser);

      expect(result).toBe(authenticatedUser);
    });
  });

  describe('user', () => {
    it('should return the authenticated user', async () => {
      const authenticatedUser: User = generateMockUser(1);

      const result = await controller.user(authenticatedUser);

      expect(result).toBe(authenticatedUser);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req: Request = {
        logout: jest.fn((cb) => cb()),
      } as unknown as Request;
      const res: Response = {
        sendStatus: jest.fn((status) => status),
        status: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
      } as unknown as Response;

      controller.logout(req as any, res as any);

      expect(req.logout).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.clearCookie).toHaveBeenCalledWith('SESSION_ID', { path: '/' });
    });

    it('should handle errors during logout', async () => {
      const req = { logout: jest.fn((callback) => callback(new Error())) };
      const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
      };

      controller.logout(req as any, res as any);

      expect(req.logout).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.clearCookie).toHaveBeenCalledWith('SESSION_ID', { path: '/' });
    });
  });
});
