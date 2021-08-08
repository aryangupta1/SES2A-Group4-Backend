import { EPreferredRole, ESkills } from "../dataTypes/types";

export interface studentDto {
  id: Number;
  preferredRole: EPreferredRole[];
  skills: ESkills[];
  currentGroupStatus: boolean;

}
