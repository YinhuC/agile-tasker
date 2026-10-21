import { Project } from './project.entity';
import { Task } from './task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
@Index(['project', 'index'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];
}
