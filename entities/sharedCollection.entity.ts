import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { Student } from "./student.entity";
import uuid from "uuid";
import { Group } from "./group.entity";

@Entity({ name: "SharedCollection" })
export abstract class SharedCollection {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("text", { nullable: true })
  assignmentName: string;

  @Column("enum", { array: true, nullable: true, enum: EPreferredRole, default: [] })
  rolesRequired: EPreferredRole[];

  @Column("enum", { array: true, nullable: true, enum: ESkills, default: [] })
  skillsRequired: ESkills[];
}
