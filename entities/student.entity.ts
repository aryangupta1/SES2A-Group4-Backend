import { isString } from "node:util";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";
import { groupDto } from "../dtos/groupDto";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "student" })
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column("text", { array: true, nullable: true })
  preferredRole?: EPreferredRole[];

  @Column("text", { array: true, nullable: true })
  skills?: ESkills[];

  @Column("string", { default: 0 })
  groupId: string;

  // @Column({ name: "created_at" })
  // createdAt?: Date;
}
