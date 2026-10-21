import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../../shared/entities/user.entity';
import { User } from '../../shared/interfaces/user.interface';
import bcrypt from 'bcrypt';
import { hashPassword } from '../../shared/utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const { email, firstname, lastname, password } = data;
    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userWithPassword = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!userWithPassword) {
      throw new NotFoundException('User not found');
    }
    return await bcrypt.compare(password, userWithPassword.password);
  }
}
