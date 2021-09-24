import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
  Unique,
} from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Student } from "./student.entity";
import uuid from "uuid";
import { Group } from "./group.entity";
import { SharedCollection } from "./sharedCollection.entity";
import { admin } from "./admin.entity";

@Entity({ name: "assignment" })
@Unique(["assignmentName"])
export class Assignment extends SharedCollection {
  @Column({ nullable: false })
  numberOfGroups: Number;

  @Column({ nullable: false })
  maxSizeOfGroup: Number;

  @Column("text", { nullable: true, default:[] })
  assignmentName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => admin, (admin) => admin.assignments)
  admin: admin;

  @OneToMany(() => Group, (group) => group) groups: Group[];

  @ManyToMany(() => Student, (student) => student.assignments, { cascade: true })
  @JoinTable()
  students: Student[];
}
