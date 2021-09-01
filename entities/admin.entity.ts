import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated } from "typeorm";

@Entity({ name: "admin" })
export class admin {
  @PrimaryGeneratedColumn("uuid")
  adminId: string;

  @Column("text", { nullable: true })
  email: string;

  @Column("text", { nullable: true })
  password: string;

  @Column("text", { nullable: true })
  firstName: string;

  @Column("text", { nullable: true })
  lastName: string;

  @Column("text", { array: true, nullable: true })
  assignmentNames: string[]; // Can create multiple assignments

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
