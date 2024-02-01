import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  sessionId: string;

  @Column({
    unique: true,
    nullable: false,
  })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
