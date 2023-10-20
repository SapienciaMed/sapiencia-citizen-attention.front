export interface IRequestSignIn {
  numberDocument: string;
  password: string;
}

export interface IResponseSignIn {
  authorization: IAuthorization;
  token: string;
}

export interface IAuthorization {
  user: IAuthUser;
  allowedActions: Array<string>;
  allowedApplications: Array<{
    aplicationId: number;
    dateValidity: Date;
  }>;
  encryptedAccess: string;
}

export interface IAuthUser {
  id?: number;
  names: string;
  lastNames: string;
  typeDocument: string;
  numberDocument: string;
  password?: string;
  userModify: string;
  dateModify?: Date;
  userCreate: string;
  dateCreate?: Date;
}



