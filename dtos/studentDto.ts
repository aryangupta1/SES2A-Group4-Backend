import { EPreferredRole, ESkills } from "../dataTypes/types";

export interface studentDto {
  id: String;
  firstName: string;
  lastName: string;
  preferredRole: EPreferredRole[];
  skills: ESkills[];
  currentGroupStatus: boolean;
}
