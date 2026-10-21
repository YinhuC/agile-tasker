import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateTaskDto } from './update-task.dto';

describe('UpdateTaskDto', () => {
  it('should accept an integer category id and index', async () => {
    const dto = plainToInstance(UpdateTaskDto, { categoryId: 3, index: 0 });

    const errors = await validate(dto);

    expect(errors).toEqual([]);
  });

  it('should reject a negative index', async () => {
    const dto = plainToInstance(UpdateTaskDto, { categoryId: 3, index: -1 });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      { min: 'index must not be less than 0' },
    ]);
  });

  it('should reject a category id sent as a string', async () => {
    const dto = plainToInstance(UpdateTaskDto, { categoryId: '3' });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      {
        isInt: 'categoryId must be an integer number',
        min: 'categoryId must not be less than 1',
        max: 'categoryId must not be greater than 2147483647',
      },
    ]);
  });

  it('should reject a category id past the integer column range', async () => {
    const dto = plainToInstance(UpdateTaskDto, { categoryId: 2147483648 });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      { max: 'categoryId must not be greater than 2147483647' },
    ]);
  });

  it('should reject a fractional index', async () => {
    const dto = plainToInstance(UpdateTaskDto, { categoryId: 3, index: 1.5 });

    const errors = await validate(dto);

    expect(errors.map((error) => error.constraints)).toEqual([
      { isInt: 'index must be an integer number' },
    ]);
  });
});
