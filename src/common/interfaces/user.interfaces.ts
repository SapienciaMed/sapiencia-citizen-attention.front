import { DateTime } from "luxon";
import { IProfile } from "./profile.interfaces";

export interface IUser {
  id?: number;
  names?: string;
  lastNames?: string;
  gender?: string;
  typeDocument?: string;
  numberDocument?: string;
  email?: string;
  userModify?: string;
  dateModify?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
  disabled?: boolean;
  numberContact1?: string;
  numberContact2?: string;
  deparmentCode?: string;
  townCode?: string;
  neighborhood?: string;
  address?: string;
  firstAdmission?: boolean;
  profiles?: IProfile[];
  charge?: number;
  dependency?: number;
}



export interface IUserFilters {
  numberDocument?: number;
  email?: string;
  names?: string;
  lastNames?: string;
  page: number;
  perPage: number;
}
