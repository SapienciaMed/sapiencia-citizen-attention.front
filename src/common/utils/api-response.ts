import { EResponseCodes } from "../constants/api.enum";

interface IOperation {
  code: EResponseCodes;
  message?: string;
}

interface IDataPaging {
  total: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
  first_page?: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string;
  previous_page_url?: string;
}

export interface IPagingData<T> {
  array: T[];
  meta: IDataPaging;
}

export class ApiResponse<T> {
  data: T;
  operation: IOperation;

  constructor(data: T, code: EResponseCodes, message?: string) {
    this.data = data;
    this.operation = { code, message };
  }
}
