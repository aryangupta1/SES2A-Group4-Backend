import { type } from "os";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated, OneToMany, JoinColumn } from "typeorm";
import { Assignment } from "./assignment.entity";

@Entity({ name: "admin" })
export class admin {
  @PrimaryGeneratedColumn("uuid")
  adminId: string;

  @Column("text", { nullable: true, unique: true })
  email: string;

  @Column("text", { nullable: true })
  password: string;

  @Column("text", { nullable: true })
  firstName: string;

  @Column("text", { nullable: true })
  lastName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.admin, { cascade: true })
  @JoinColumn()
  assignments: Assignment[];
}
