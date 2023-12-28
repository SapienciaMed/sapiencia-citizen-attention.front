import { IUser } from "./auth.interfaces";

export interface IFile {
  id?: number;
  name: string;
  filePath?: string;
  visiblePetitioner?: boolean;
  userId?: number;
  user?: IUser;
  isActive: boolean;
}
