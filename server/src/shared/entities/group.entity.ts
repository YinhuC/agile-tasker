import { Project } from './project.entity';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.groups, {
    onDelete: 'CASCADE',
  })
  users: User[];

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  owner: User;

  @OneToMany(() => Project, (project) => project.group)
  projects: Project[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
}
