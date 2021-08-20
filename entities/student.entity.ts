import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { EPreferredRole, ESkills } from "../dataTypes/types";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "student" })
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("text", { nullable: true })
  firstName?: string;

  @Column("text", { nullable: true })
  lastName?: string;

  @Column("enum", { array: true, nullable: true, enum: EPreferredRole })
  preferredRole?: EPreferredRole;

  @Column("enum", { array: true, nullable: true, enum: ESkills })
  skills?: ESkills;

  @Column("text", { default: 0 })
  groupId: string;

  // @Column({ name: "created_at" })
  // createdAt?: Date;
}
