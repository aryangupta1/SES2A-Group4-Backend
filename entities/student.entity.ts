import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";

@Entity({ name: "student" })
export class Student {
  @PrimaryGeneratedColumn("uuid")
  studentid: string;

  @Column("text", { nullable: true })
  firstName: string;

  @Column("text", { nullable: true })
  lastName: string;

  @Column("enum", { array: true, nullable: true, enum: EPreferredRole, default: [] })
  preferredRole: EPreferredRole[];

  @Column("enum", { array: true, nullable: true, enum: ESkills, default: [] })
  skills: ESkills[];

  @Column("text", { nullable: true })
  group: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
