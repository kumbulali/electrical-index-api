import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import Company from "./company.entity";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  hashPassword(password: string) {
    (this.salt = bcrypt.genSaltSync()),
      (this.password = bcrypt.hashSync(password, this.salt));
  }

  checkPassword(password: string) {
    const passwordMatches = bcrypt.compareSync(password, this.password);
    return passwordMatches;
  }
}
