import { IRole } from "./role.interface";
import { ITransferBox } from "./transfer-box.interface";

export interface IRequestSignIn {
  identification: string;
  password: string;
}

export interface IResponseSignIn {
  authorization: IAuthorization;
  token: string;
}

export interface IRequestRefreshToken {
  refreshToken: string;
}

export interface IResponseRefreshToken {
  identification: string;
  accessToken: string;
}

export interface IDecodedToken {
  id: number;
}

export interface IAuthorization {
  user: IUser;
  allowedActions: Array<string>;
  allowedApplications: Array<{
    aplicationId: number;
    dateValidity: Date;
  }>;
  encryptedAccess: string;
}

export interface IUser {
  id?: number;
  names: string;
  lastNames: string;
  typeDocument: string;
  numberDocument: string;
  email: string;
  userModify: string;
  dateModify?: Date;
  userCreate: string;
  dateCreate?: Date;
  gender: string;
  numberContact1?: string;
  numberContact2?: string;
  deparmentCode: string;
  townCode?: string;
  neighborhood: string;
  address: string;
  profiles?: IProfile[];
  disabled?: boolean;
  password?: string | null;
}

export interface IProfile {
  id?: number;
  userId: number;
  aplicationId: number;
  dateValidity: Date;
  roles: IRole[];
  transferRoles: {
    available: ITransferBox[];
    selected: ITransferBox[];
  }; 
}

export interface IProfileForm {
  userId: number;
  aplicationId: number;
  dateValidity: Date;
  transferRoles: {
    available: ITransferBox[];
    selected: ITransferBox[];
  };
}

export interface IRequestRecoveryPassword {
  identification: string;
  email: string;
}

export interface IDecodedToken {
  id: number;
}


