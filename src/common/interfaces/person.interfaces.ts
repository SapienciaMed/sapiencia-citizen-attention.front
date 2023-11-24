import { DateTime } from "luxon";
import { ILegalEntityType } from "./legalEntityType.interfaces";
import { IGenericData } from "./genericData.interfaces";

export interface IPerson {
  id?: number;
  documentTypeId: number;
  documentType?: IGenericData;
  entityTypeId: number;
  entityType?: ILegalEntityType;
  identification: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  birthdate?: Date;
  firstContactNumber: string;
  secondContactNumber?: string;
  email: string;
  address: string;
  countryId: number;
  departmentId: number;
  municipalityId: number;
  country?: IGenericData;
  department?: IGenericData;
  municipality?: IGenericData;
  isBeneficiary: boolean;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface IPersonFilters {
  documentTypeId?: number;
  identification?: string;
  name?: string;
  surname?: string;
  contactNumber?: string;
  email?: string;
  page?: number;
  perPage?: number;
}
