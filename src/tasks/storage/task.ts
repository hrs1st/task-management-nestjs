import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../../../dist/auth/user.entity';
import { UserEntity } from '../../auth/storage/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  taskStatus: TaskStatus;

  @ManyToOne(type => UserEntity, user => user.tasks ,{ eager: false})
  user: User;

  @Column()
  userId: number;
}