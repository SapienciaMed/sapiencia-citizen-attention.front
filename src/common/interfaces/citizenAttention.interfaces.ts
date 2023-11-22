import { DateTime } from "luxon";
import { IDependence } from "./dependence.interfaces";
import { IProgram } from "./program.interfaces";
import { IRequestSubjectType } from "./requestSubjectType.interfaces";

export interface ICitizenAttention {
  id?: number;
  documentTypeId: number;
  identification: string;
  businessName?: string;
  firstName?: string;
  secondName?: string;
  firstSurname?: string;
  secondSurname?: string;
  firstContactNumber?: string;
  secondContactNumber?: string;
  email?: string;
  stratumId: number;
  detailServiceChannelId: number;
  attentionRequestTypeId: number;
  dependencyId: number;
  programId: number;
  requestSubjectTypeId?: number;
  corregimientoId?: number;
  userTypeId?: number;
  detailServiceChannel?: IDetailServiceChannel;
  attentionRequestType?: IAttentionRequestType;
  dependency?: IDependence;
  program?: IProgram;
  requestSubjectType?: IRequestSubjectType;
  corregimiento?: ICorregimiento;
  observation?: string;
  userType?: IUserType;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface ICitizenAttentionFilters {
  id?: number;
  documentTypeId?: number;
  identification?: string;
  businessName?: string;
  firstName?: string;
  secondName?: string;
  firstSurname?: string;
  secondSurname?: string;
  firstContactNumber?: string;
  secondContactNumber?: string;
  email?: string;
  stratumId?: number;
  detailServiceChannelId?: number;
  attentionRequestTypeId?: number;
  dependencyId?: number;
  programId?: number;
  requestSubjectTypeId?: number;
  corregimientoId?: number;
  userTypeId?: number;
  observation?: string;
  page?: number;
  perPage?: number;
}

export interface ICorregimiento {
  id?: number;
  name?: string;
  isActive?: boolean;
  order?: number;
}

export interface IAttentionRequestType {
  id?: number;
  description?: string;
  isActive?: boolean;
  order?: number;
}

export interface IValueGroup {
  id?: number;
  name?: string;
  isActive?: boolean;
  order?: number;
  userTypes?: IUserType[];
}

export interface IUserType {
  id?: number;
  name?: string;
  valueGroupId?: number;
  isActive?: boolean;
  order?: number;
  valueGroup?: IValueGroup;
}

export interface IServiceChannel {
  cna_codigo?: number;
  cna_canal?: string;
  cna_activo?: boolean;
  cna_orden?: number;
  details?: IDetailServiceChannel[];
}

export interface IDetailServiceChannel {
  cad_codigo?: number;
  cad_nombre?: string;
  cad_id_canal?: number;
  cad_activo?: boolean;
  cad_orden?: number;
}
