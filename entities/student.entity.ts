import { group } from "console";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Generated,
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Assignment } from "./assignment.entity";
import { Group } from "./group.entity";
import { SharedCollection } from "./sharedCollection.entity";

@Entity({ name: "student" })
@Unique(["email"])
export class Student extends SharedCollection {
  @PrimaryGeneratedColumn("uuid")
  studentid: string;

  @Column("text", { nullable: true })
  email: string;

  @Column("text", { nullable: true })
  password: string;

  @Column("text", { nullable: true })
  firstName: string;

  @Column("text", { nullable: true })
  lastName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @ManyToMany(() => Assignment, (assignment) => assignment.students)
  assignments: Assignment[];

  @ManyToMany(() => Group, (group) => group.students)
  groups: Group[];
}
