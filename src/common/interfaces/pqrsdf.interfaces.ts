import { DateTime } from "luxon";
import { IPerson } from "./person.interfaces";
import { IResponseMedium } from "./responseMedium.interfaces";
import { IRequestSubject } from "./requestSubject.interfaces";
import { IFile } from "./file.interfaces";
import { IRequestType } from "./requestType.interfaces";

export interface IPqrsdf {
  id: number;
  requestTypeId: number;
  personId: number;
  responseMediumId: number;
  requestSubjectId: number;
  fileId: number;
  filingNumber: number;
  clasification: string;
  dependency: string;
  description: string;
  requestType?: IRequestType;
  person?: IPerson;
  responseMedium?: IResponseMedium;
  requestSubject?: IRequestSubject;
  file?: IFile;
  createdAt: DateTime;
  updatedAt: DateTime;
}
