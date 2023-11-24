import { DateTime } from "luxon";
import { IDayType } from "./dayType.interfaces";

export interface IDaysParametrizationDetail {
  id?: number;
  daysParametrizationId?: number;
  dayTypeId?: number;
  dayType?: IDayType;
  description?: string | null;
  detailDate: any|Date;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}
