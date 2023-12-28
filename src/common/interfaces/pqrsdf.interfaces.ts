import { DateTime } from "luxon";
import { IDependence } from "./dependence.interfaces";
import { IFile } from "./file.interfaces";
import { IFactor } from "./mastersTables.interface";
import { IMotive } from "./motive.interfaces";
import { IPerson } from "./person.interfaces";
import { IProgram } from "./program.interfaces";
import { IRequestSubjectType } from "./requestSubjectType.interfaces";
import { IRequestType } from "./requestType.interfaces";
import { IResponseMedium } from "./responseMedium.interfaces";
import { IResponseType } from "./responseType.interfaces";
import { IUser } from "./user.interfaces";
import { IWorkEntity } from "./workEntity.interfaces";

export interface IPqrsdf {
  id?: number;
  requestTypeId: number;
  personId?: number;
  responseMediumId: number;
  programId?: number;
  responsibleId?: number;
  requestSubjectId: number;
  fileId?: number;
  motiveId?: number;
  reopenRequestId?: number;
  statusId?: number;
  filingNumber?: number;
  exitFilingNumber?: number;
  idCanalesAttencion?: number;
  clasification: string;
  dependency: string;
  description: string;
  requestType?: IRequestType;
  motive?: IMotive;
  reopenRequest?: IReopenRequest;
  person?: IPerson;
  answer?: string;
  program?: IProgram;
  answerDate?: DateTime;
  extensionDate?: DateTime;
  responsible?: IWorkEntity;
  responseMedium?: IResponseMedium;
  requestSubject?: IRequestSubjectType;
  status?: IPqrsdfStatus;
  response?: IPqrsdfResponse;
  file?: IFile;
  supportFiles?: IFile[];
  closedAt?: DateTime;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface IPqrsdfStatus {
  lep_codigo?: number;
  lep_estado?: string;
  lep_activo?: boolean;
  lep_orden?: number;
}

export interface IclpClasificacionPrograma {
  clp_codigo: number;
  clp_descripcion: string;
  clp_programa: number;
  clp_activo: number;
  clp_orden: number;
}

export interface IdepDependencia {
  dep_codigo: 1;
  dep_descripcion: string;
  dep_activo: 1;
  dep_orden: 1;
}

export interface FormPqrsdf {
  tipoDeSolicitud: TipoDeSolicitud;
  tipo: Pais;
  tipoEntidad: TypeEntidad;
  medioRespuesta: MedioRespuesta;
  programaSolicitud: ProgramaSolicitud;
  asuntoSolicitud: AsuntoSolicitud;
  noDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  noContacto1: string;
  noContacto2: string;
  correoElectronico: string;
  direccion: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Municipio;
  fechaNacimento: Date;
  politicaTratamiento: boolean;
  Descripcion: string;
  RazonSocial: string;
  archivo: Archivo;
}

interface Archivo {}

interface AsuntoSolicitud {
  ASO_CODIGO: number;
  ASO_ASUNTO: string;
}

interface Departamento {
  LGE_CODIGO: number;
  LGE_AGRUPADOR: string;
  LGE_ELEMENTO_CODIGO: string;
  LGE_ELEMENTO_DESCRIPCION: string;
  LGE_CAMPOS_ADICIONALES: DepartamentoLGECAMPOSADICIONALES;
}

interface DepartamentoLGECAMPOSADICIONALES {
  regionId: string;
  countryId: string;
}

interface MedioRespuesta {
  MRE_CODIGO: number;
  MRE_DESCRIPCION: string;
}

interface Municipio {
  LGE_CODIGO: number;
  LGE_AGRUPADOR: string;
  LGE_ELEMENTO_CODIGO: string;
  LGE_ELEMENTO_DESCRIPCION: string;
  LGE_CAMPOS_ADICIONALES: MunicipioLGECAMPOSADICIONALES;
}

interface MunicipioLGECAMPOSADICIONALES {
  departmentId: string;
}

interface Pais {
  LGE_CODIGO: number;
  LGE_ELEMENTO_DESCRIPCION: string;
}

interface ProgramaSolicitud {
  PRG_CODIGO: number;
  PRG_DESCRIPCION: string;
  CLP_CODIGO: number;
  CLP_DESCRIPCION: string;
  DEP_CODIGO: number;
  DEP_DESCRIPCION: string;
}

interface TipoDeSolicitud {
  TSO_CODIGO: number;
  TSO_DESCRIPTION: string;
}

interface TypeEntidad {
  TEJ_CODIGO: number;
  TEJ_NOMBRE: string;
}

export interface IrequestPqrsdf {
  userId?: number;
  typeReques?: number;
}

export interface IpqrsdfByRequest {
  PQR_CODIGO?: number;
  PQR_NRO_RADICADO?: number;
  PQR_FECHA_CREACION?: string;
  PER_NUMERO_DOCUMENTO?: string;
  PER_PRIMER_NOMBRE?: string;
  PER_SEGUNDO_NOMBRE?: string;
  PER_PRIMER_APELLIDO?: string;
  PER_SEGUNDO_APELLIDO?: string;
  ASO_ASUNTO?: string;
  LEP_ESTADO?: string;
  OBS_TIPO_DIAS?: string;
  OBS_TERMINO_DIAS?: number;
  PRG_DESCRIPCION?: string;
  SBR_ESTADO?: string;
}

export interface IReopenRequest {
  justification?: Justification[];
}

export interface Justification {
  srb_justificacion?: string;
  sbr_estado?: boolean;
  pqrsdfId?: number;
  radicado?: number;
}

export interface IPqrsdfResponse {
  id?: number;
  filingNumber?: number;
  isPetitioner?: boolean;
  pqrsdfId?: number;
  responseTypeId?: number;
  workEntityTypeId?: number;
  workEntityId?: number;
  factorId?: number;
  fileId?: number;
  file?: IFile;
  factor?: IFactor;
  responseType?: IResponseType;
  pqrsdf?: IPqrsdf;
  assignedUserId?: number;
  assignedUser?: IUser;
  assignedDependenceId?: number;
  respondingUserId: number;
  respondingUser?: IUser;
  respondingDependenceId?: number;
  observation?: string;
  assignedDependence?: IDependence;
  respondingDependence?: IDependence;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface IResponseFilters {
  responseType?: IResponseType;
  pqrsdfId?: number;
  perPage?: number;
  page?: number;
}
