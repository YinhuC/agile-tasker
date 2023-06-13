import { Project } from 'src/project/project.entity';
import { Task } from 'src/task/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.categories)
  @JoinColumn()
  project: Project;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];
}