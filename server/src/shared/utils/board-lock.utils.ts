import { EntityManager } from 'typeorm';
import { Project as ProjectEntity } from '../entities/project.entity';

/** Locks a board's project row for the transaction, so index shifts on one board run one at a time. */
export async function lockBoardOfProject(
  manager: EntityManager,
  projectId: number
): Promise<void> {
  await manager
    .createQueryBuilder(ProjectEntity, 'project')
    .where('project.id = :projectId', { projectId })
    .setLock('pessimistic_write')
    .getOne();
}

export async function lockBoardOfCategory(
  manager: EntityManager,
  categoryId: number
): Promise<void> {
  await manager
    .createQueryBuilder(ProjectEntity, 'project')
    .innerJoin('project.categories', 'category')
    .where('category.id = :categoryId', { categoryId })
    .setLock('pessimistic_write', undefined, ['project'])
    .getOne();
}

export async function lockBoardOfTask(
  manager: EntityManager,
  taskId: number
): Promise<void> {
  await manager
    .createQueryBuilder(ProjectEntity, 'project')
    .innerJoin('project.categories', 'category')
    .innerJoin('category.tasks', 'task')
    .where('task.id = :taskId', { taskId })
    .setLock('pessimistic_write', undefined, ['project'])
    .getOne();
}
