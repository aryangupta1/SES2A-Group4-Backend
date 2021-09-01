import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Student } from "./student.entity";
import uuid from "uuid";
import { SharedCollection } from "./sharedCollection.entity";

@Entity({ name: "group" })
export class Group extends SharedCollection {
  @PrimaryGeneratedColumn("uuid")
  groupId: string;

  @Column({ nullable: true })
  groupNumber: Number;

  @Column("text", { array: true, nullable: true, default: [] })
  studentIdsInGroup: string[]; // This will store the uuid of students in the group

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
