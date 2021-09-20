import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated, ManyToOne } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Student } from "./student.entity";
import uuid from "uuid";
import { SharedCollection } from "./sharedCollection.entity";
import { Assignment } from "./assignment.entity";

@Entity({ name: "group" })
export class Group extends SharedCollection {
  @Column({ nullable: true })
  groupName: string;

  @Column({ nullable: true })
  maxSizeOfGroup: Number;

  @Column("text", { array: true, nullable: true, default: [] })
  studentIdsInGroup: string[]; // This will store the uuid of students in the group

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @ManyToOne(() => Assignment, (assignment) => assignment.groups) assignment: Assignment;
}
