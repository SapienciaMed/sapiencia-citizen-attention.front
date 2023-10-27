import { DateTime } from "luxon";
import { IProgram } from "./program.interfaces";
export interface IRequestSubjectType {
  id?: number;
  name?: string;
  requestObjectId?: number;
  isActive?: boolean;
  requestObject?: IRequestObject;
  programs?: IProgram[];
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface IRequestSubjectTypeFilters {
  name?: string;
  requestObjectId?: number;
  programs?: number[];
  page?: number;
  perPage?: number;
}

export interface IRequestObject {
  obs_codigo?: number;
  obs_description?: string;
  obs_termino_dias?: number;
  obs_tipo_dias?: string;
  obs_activo?: boolean;
  obs_orden?: number;
}

export interface IProgramClasification {
  clp_codigo?: number;
  clp_descripcion?: string;
  clp_programa?: number;
  clp_activo?: boolean;
  clp_orden?: number;
}
