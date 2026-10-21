import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../shared/interfaces/user.interface';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: User,
    done: (err: Error | null, id?: number) => void
  ): void {
    done(null, user.id);
  }

  /** Loads the session's user fresh; a user deleted since sign-in ends the session instead of failing the request. */
  async deserializeUser(
    id: number,
    done: (err: Error | null, payload?: User | null) => void
  ): Promise<void> {
    let user: User | null;
    try {
      user = await this.userService.findUserById(id);
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        done(err as Error);
        return;
      }
      user = null;
    }
    done(null, user);
  }
}
