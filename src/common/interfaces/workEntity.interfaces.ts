import { DateTime } from "luxon";
import { IWorkEntityType } from "./workEntityType.interface";
import { IUser } from "./user.interfaces";

export interface IWorkEntity {
  id?: number;
  userId: number;
  workEntityTypeId: number;
  order: number;
  name: string;
  user?: IUser;
  workEntityType?: IWorkEntityType;
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
