import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  Index,
  JoinColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import { Consumption } from "./consumption.entity";
import { Company } from "./company.entity";
import { Session } from "./session.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("email_index")
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToOne((type) => Company)
  company: Company;

  @OneToMany(() => Consumption, (consumption) => consumption.user)
  consumptions: Consumption[];

  @CreateDateColumn()
  cratedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  hashPassword(password: string) {
    (this.salt = bcrypt.genSaltSync()),
      (this.password = bcrypt.hashSync(password, this.salt));
  }

  checkPassword(password: string){
    const passwordMatches = bcrypt.compareSync(password, this.password);
    return passwordMatches;
  }
}
