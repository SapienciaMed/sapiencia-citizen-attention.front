import { DateTime } from "luxon";
import { IPerson } from "./person.interfaces";
import { IResponseMedium } from "./responseMedium.interfaces";
import { IRequestSubject } from "./requestSubject.interfaces";
import { IFile } from "./file.interfaces";
import { IRequestType } from "./requestType.interfaces";
import { IWorkEntity } from "./workEntity.interfaces";

export interface IPqrsdf {
  id?: number;
  requestTypeId: number;
  personId?: number;
  responseMediumId: number;
  requestSubjectId: number;
  responsibleId?: number;
  fileId?: number;
  filingNumber?: number;
  clasification: string;
  dependency: string;
  description: string;
  requestType?: IRequestType;
  person?: IPerson;
  answer?: string;
  answerDate?: DateTime;
  responsible?: IWorkEntity;
  responseMedium?: IResponseMedium;
  requestSubject?: IRequestSubject;
  file?: IFile;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}



export interface FormPqrsdf {
  tipoDeSolicitud:     TipoDeSolicitud;
  tipo:                Pais;
  tipoEntidad:         TypeEntidad;
  medioRespuesta:      MedioRespuesta;
  programaSolicitud:   ProgramaSolicitud;
  asuntoSolicitud:     AsuntoSolicitud;
  noDocumento:         string;
  primerNombre:        string;
  segundoNombre:       string;
  primerApellido:      string;
  segundoApellido:     string;
  noContacto1:         string;
  noContacto2:         string;
  correoElectronico:   string;
  direccion:           string;
  pais:                Pais;
  departamento:        Departamento;
  municipio:           Municipio;
  fechaNacimento:      Date;
  politicaTratamiento: boolean;
  Descripcion:         string;
  RazonSocial:         string;
  archivo:             Archivo;
}

interface Archivo {
}

interface AsuntoSolicitud {
  ASO_CODIGO: number;
  ASO_ASUNTO: string;
}

interface Departamento {
  LGE_CODIGO:               number;
  LGE_AGRUPADOR:            string;
  LGE_ELEMENTO_CODIGO:      string;
  LGE_ELEMENTO_DESCRIPCION: string;
  LGE_CAMPOS_ADICIONALES:   DepartamentoLGECAMPOSADICIONALES;
}

interface DepartamentoLGECAMPOSADICIONALES {
  regionId:  string;
  countryId: string;
}

interface MedioRespuesta {
  MRE_CODIGO:      number;
  MRE_DESCRIPCION: string;
}

interface Municipio {
  LGE_CODIGO:               number;
  LGE_AGRUPADOR:            string;
  LGE_ELEMENTO_CODIGO:      string;
  LGE_ELEMENTO_DESCRIPCION: string;
  LGE_CAMPOS_ADICIONALES:   MunicipioLGECAMPOSADICIONALES;
}

interface MunicipioLGECAMPOSADICIONALES {
  departmentId: string;
}

interface Pais {
  LGE_CODIGO:               number;
  LGE_ELEMENTO_DESCRIPCION: string;
}

interface ProgramaSolicitud {
  PRG_CODIGO:      number;
  PRG_DESCRIPCION: string;
  CLP_CODIGO:      number;
  CLP_DESCRIPCION: string;
  DEP_CODIGO:      number;
  DEP_DESCRIPCION: string;
}

interface TipoDeSolicitud {
  TSO_CODIGO:      number;
  TSO_DESCRIPTION: string;
}

interface TypeEntidad {
  TEJ_CODIGO: number;
  TEJ_NOMBRE: string;
}
