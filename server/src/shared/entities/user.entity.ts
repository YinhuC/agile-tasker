import { Exclude } from 'class-transformer';
import { Group } from './group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ name: 'auth_method', nullable: true })
  @Exclude()
  authMethod: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Group, (groups) => groups.users)
  @JoinTable()
  groups: Group[];

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
}
