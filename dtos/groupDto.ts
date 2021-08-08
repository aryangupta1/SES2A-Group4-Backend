import { EPreferredRole, ESkills } from "../dataTypes/types";

export interface groupDto { 
  groupId: Number,
  maxSize: Number,  
  requiredRoles: EPreferredRole[],
  requirdSkills: ESkills[],
 }
