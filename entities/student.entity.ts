import { group } from "console";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated, ManyToMany, JoinTable } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Assignment } from "./assignment.entity";
import { Group } from "./group.entity";
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

  @ManyToMany(() => Assignment, (assignment) => assignment.students)
  @JoinTable()
  assignments: Assignment[];

  @ManyToMany(() => Group, (group) => group.students)
  @JoinTable()
  groups: Group[];
}
