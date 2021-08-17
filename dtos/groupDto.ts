import { EPreferredRole, ESkills } from "../dataTypes/types";

export interface groupDto { 
  groupId: String,
  maxSize: Number,  
  requiredRoles: EPreferredRole[],
  requirdSkills: ESkills[],
 }
