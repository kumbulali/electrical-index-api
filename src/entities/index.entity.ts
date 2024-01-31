import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Company } from './company.entity';
import { Consumption } from './consumption.entity';

@Entity()
export class Index {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column()
  date: Date;

  @ManyToOne(() => Company, company => company.indexes)
  company: Company;

  @OneToMany(() => Consumption, consumption => consumption.index)
  consumption: Consumption;

  @CreateDateColumn()
  cratedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}