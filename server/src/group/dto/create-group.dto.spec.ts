import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateGroupDTO } from './create-group.dto';

describe('CreateGroupDTO', () => {
  it('should accept a list of member emails', async () => {
    const dto = plainToInstance(CreateGroupDTO, {
      name: 'Ops',
      emails: ['sam@example.com', 'alex@example.com'],
    });

    const errors = await validate(dto);

    expect(errors).toEqual([]);
  });

  it('should reject emails sent as a single string', async () => {
    const dto = plainToInstance(CreateGroupDTO, {
      name: 'Ops',
      emails: 'sam@example.com',
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      {
        arrayMaxSize: 'emails must contain no more than 50 elements',
        isArray: 'emails must be an array',
      },
    ]);
  });

  it('should reject an entry that is not an email', async () => {
    const dto = plainToInstance(CreateGroupDTO, {
      name: 'Ops',
      emails: ['sam@example.com', 'not-an-email'],
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      { isEmail: 'each value in emails must be an email' },
    ]);
  });

  it('should reject more than 50 emails', async () => {
    const dto = plainToInstance(CreateGroupDTO, {
      name: 'Ops',
      emails: Array.from({ length: 51 }, (_, i) => `member${i}@example.com`),
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      { arrayMaxSize: 'emails must contain no more than 50 elements' },
    ]);
  });
});
