import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import Index from './index.entity'
import User from './user.entity';
import Consumption from './consumption.entity';

@Entity()
export default class Company {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Index, index => index.company)
  indexes: Index[];

  @OneToMany(() => Consumption, consumption => consumption.company)
  consumptions: Consumption[];

  @OneToMany(() => User, user => user.company)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}