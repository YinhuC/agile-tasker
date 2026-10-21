import { faker } from '@faker-js/faker';
import { Category } from '../interfaces/category.interface';
import { Project } from '../interfaces/project.interface';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';

export const generateMockCategory = (
  i: number,
  project?: Project
): Category => ({
  id: i,
  index: i,
  name: faker.lorem.words({ min: 2, max: 5 }),
  project,
});

export const generateMockCategoryDto = (
  projectId: number
): CreateCategoryDto => ({
  name: faker.lorem.words({ min: 2, max: 5 }),
  projectId,
});
