import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
