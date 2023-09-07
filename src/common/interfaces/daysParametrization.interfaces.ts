import { DateTime } from "luxon";
import { IDaysParametrizationDetail } from "./daysParametrizationDetail.interfaces";

export interface IDaysParametrization {
  id?: number;
  year: number;
  daysParametrizationDetails?: IDaysParametrizationDetail[] | [];
  createdAt?: DateTime;
  updatedAt?: DateTime;
}
