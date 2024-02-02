import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import Company from "./company.entity";

@Entity()
export default class Consumption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column({ type: "date", unique: true })
  date: Date;

  @ManyToOne(() => Company, (company) => company.indexes)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
