import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Index } from './index.entity';

@Entity()
export class Consumption {

  @PrimaryGeneratedColumn()
  id: number;  

  @Column()
  value: number;

  @Column()
  date: Date;

  @ManyToOne(() => Index, index => index.consumption)
  index: Index;

  @ManyToOne(() => User, user => user.consumptions) 
  user: User;

  @CreateDateColumn()
  cratedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}