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
import Consumption from "./consumption.entity";

@Entity()
export default class Index {
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

  constructor(value: number, date: Date, company: Company) {
    this.value = value;
    this.date = date;
    this.company = company;
  }

  static calculateAverageDailyConsumption(
    index1: Index,
    index2: Index
  ): Consumption[] {    
    if(index1.company.id !== index2.company.id)
      throw new Error('These indexes are not belong to same company.');

    const startDate = new Date(index1.date < index2.date ? index1.date : index2.date);
    const endDate = new Date(index1.date < index2.date ? index2.date : index1.date);
    const days = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return [];
    }

    const valueChange = index2.value - index1.value;
    const averageDailyChange = Math.round(valueChange / days);

    const result: Consumption[] = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(
        startDate.getTime() + i * (1000 * 60 * 60 * 24)
      );
      result.push(new Consumption(averageDailyChange, currentDate, index1.company));
    }

    return result;
  }
}
