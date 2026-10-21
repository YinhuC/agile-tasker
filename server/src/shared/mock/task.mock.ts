import { faker } from '@faker-js/faker';
import { Task } from '../interfaces/task.interface';
import { CreateTaskDto } from '../../task/dto/create-task.dto';
import { Category } from '../interfaces/category.interface';

export const generateMockTask = (i: number, category?: Category): Task => ({
  id: i,
  index: i,
  name: faker.lorem.words({ min: 2, max: 5 }),
  description: faker.lorem.lines(2),
  category,
});

export const generateMockTaskDto = (categoryId: number): CreateTaskDto => ({
  name: faker.lorem.words({ min: 2, max: 5 }),
  description: faker.lorem.lines(2),
  categoryId,
});
