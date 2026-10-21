import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should accept an email longer than 20 characters', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'jordan.lee.portfolio@example.com',
      firstname: 'Jordan',
      lastname: 'Lee',
      password: 'Password1',
    });

    const errors = await validate(dto);

    expect(errors).toEqual([]);
  });
});
