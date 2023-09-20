import { EResponseCodes } from "../constants/api.enum";
import { IPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function usePqrsdfService() {
  const baseURL: string = process.env.urlApiCitizenAttention;
  const listUrl: string = "/api/v1/pqrsdf";
  const { get, post } = useCrudService(baseURL);

  async function getPqrsdfs(): Promise<ApiResponse<IPqrsdf[] | []>> {
    try {
      const endpoint: string = `/get-all/`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IPqrsdf[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getPqrsdfById(id: number): Promise<ApiResponse<IPqrsdf>> {
    try {
      const endpoint: string = `/get-by-id/${id}`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IPqrsdf, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getPqrsdfByIdentificationAndFilingNumber(
    identification: number,
    filingNumber: number
  ): Promise<ApiResponse<IPqrsdf>> {
    try {
      const endpoint: string = `/get-by-filters`;
      return await get(`${listUrl}${endpoint}`, {
        identification,
        filingNumber,
      });
    } catch (error) {
      return new ApiResponse({} as IPqrsdf, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function createPqrsdf(pqrsdf: IPqrsdf): Promise<ApiResponse<IPqrsdf>> {
    try {
      const endpoint: string = `/create/`;
      return await post(`${listUrl}${endpoint}`, { pqrsdf });
    } catch (error) {
      return new ApiResponse({} as IPqrsdf, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  return {
    getPqrsdfs,
    createPqrsdf,
    getPqrsdfById,
    getPqrsdfByIdentificationAndFilingNumber
  };
}
