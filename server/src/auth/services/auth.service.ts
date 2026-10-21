import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { User } from '../../shared/interfaces/user.interface';
import { RegisterDto } from '../dto/register.dto';

const INVALID_LOGIN_MESSAGE = 'Invalid email or password';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email } = registerDto;
    let existingUser: User;
    try {
      existingUser = await this.userService.findUserByEmail(email);
    } catch (err) {}
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const user = await this.userService.create(registerDto);
    delete user.password;
    return user;
  }

  /** Fails with the same message for an unknown email and a wrong password. */
  async login(email: string, password: string): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findUserByEmail(email);
    } catch (err) {
      throw new UnauthorizedException(INVALID_LOGIN_MESSAGE);
    }

    if (!(await this.userService.comparePassword(user, password))) {
      throw new UnauthorizedException(INVALID_LOGIN_MESSAGE);
    }

    return user;
  }
}
