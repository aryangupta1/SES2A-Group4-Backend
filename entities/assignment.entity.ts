import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Student } from "./student.entity";
import uuid from "uuid";
import { Group } from "./group.entity";
import { SharedCollection } from "./sharedCollection.entity";
import { admin } from "./admin.entity";

@Entity({ name: "assignment" })
export class Assignment extends SharedCollection {
  @Column("text", { nullable: true })
  owner: string; // Must be a admin username

  @Column({ nullable: false })
  numberOfGroups: Number;

  @Column({ nullable: false })
  maxSizeOfGroup: Number;

  @Column("text", { array: true, nullable: true })
  groupsInThisAssignment: string[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => admin, (admin) => admin.assignments)
  admin: admin;

  @OneToMany(() => Group, (group) => group, { cascade: true }) groups: Group[];
}
