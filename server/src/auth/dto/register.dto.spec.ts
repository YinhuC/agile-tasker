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

  it.each([
    ['a passphrase with spaces and symbols', 'correct horse battery!'],
    ['exactly 8 characters', 'abcdefgh'],
    ['exactly 64 characters', 'a'.repeat(64)],
  ])('should accept %s', async (_label, password) => {
    const dto = plainToInstance(RegisterDto, {
      email: 'sam@example.com',
      firstname: 'Sam',
      lastname: 'Lee',
      password,
    });

    const errors = await validate(dto);

    expect(errors).toEqual([]);
  });

  it.each([
    ['7 characters', 'abcdefg'],
    ['65 characters', 'a'.repeat(65)],
  ])('should reject a password of %s', async (_label, password) => {
    const dto = plainToInstance(RegisterDto, {
      email: 'sam@example.com',
      firstname: 'Sam',
      lastname: 'Lee',
      password,
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      { matches: 'Password must be 8 to 64 characters long.' },
    ]);
  });
});
