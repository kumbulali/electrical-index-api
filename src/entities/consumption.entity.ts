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

  @Column({ type: "date" })
  date: Date;

  @ManyToOne(() => Company, (company) => company.indexes)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(value: number, date: Date, company: Company) {
    this.value = value;
    this.date = date;
    this.company = company;
  }
}
