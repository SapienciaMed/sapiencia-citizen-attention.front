import { DateTime } from "luxon";
import { IWorkEntityType } from "./workEntityType.interface";
import { IUser } from "./user.interfaces";

export interface IWorkEntity {
  id?: number;
  userId: number;
  workEntityTypeId: number;
  status?: boolean;
  order?: number;
  name: string;
  user?: IUser;
  workEntityType?: IWorkEntityType;
  affairsPrograms?: IEntityAffairsProgram[];
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface IEntityAffairsProgram {
  id?: number;
  workEntityId?: number;
  affairProgramId?: number;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface IWorkEntityFilters {
  id?: number;
  workEntityTypeId?: number;
  name?: string;
  identification?: number;
  names?: string;
  lastNames?: string;
  email?: string;
  page?: number;
  perPage?: number;
}
