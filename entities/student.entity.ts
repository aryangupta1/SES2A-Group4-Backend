import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { SharedCollection } from "./sharedCollection.entity";

@Entity({ name: "student" })
export class Student extends SharedCollection {
  @PrimaryGeneratedColumn("uuid")
  studentid: string;

  @Column("text", { nullable: true })
  email?: string;

  @Column("text", { nullable: true })
  password?: string;

  @Column("text", { nullable: true })
  firstName: string;

  @Column("text", { nullable: true })
  lastName: string;

  @Column("text", { nullable: true })
  groupId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
