import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SessionSerializer } from './session.serializer';
import { UserService } from '../../user/services/user.service';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { generateMockUser } from '../../shared/mock/user.mock';

describe('SessionSerializer', () => {
  let serializer: SessionSerializer;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionSerializer,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    serializer = module.get<SessionSerializer>(SessionSerializer);
    userService = module.get<UserService>(UserService);
  });

  describe('serializeUser', () => {
    it('should store only the user id in the session', () => {
      const user = generateMockUser(4);
      const done = jest.fn();

      serializer.serializeUser(user, done);

      expect(done.mock.calls).toEqual([[null, 4]]);
    });
  });

  describe('deserializeUser', () => {
    it('should load the user fresh from the database', async () => {
      const user = generateMockUser(4);
      const done = jest.fn();
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);

      await serializer.deserializeUser(4, done);

      expect(userService.findUserById).toHaveBeenCalledWith(4);
      expect(done.mock.calls).toEqual([[null, user]]);
    });

    it('should end the session instead of failing when the user no longer exists', async () => {
      const done = jest.fn();
      jest
        .spyOn(userService, 'findUserById')
        .mockRejectedValue(new NotFoundException('User not found'));

      await serializer.deserializeUser(4, done);

      expect(done.mock.calls).toEqual([[null, null]]);
    });

    it('should pass any other error on to passport', async () => {
      const error = new Error('Connection terminated');
      const done = jest.fn();
      jest.spyOn(userService, 'findUserById').mockRejectedValue(error);

      await serializer.deserializeUser(4, done);

      expect(done.mock.calls).toEqual([[error]]);
    });
  });
});
