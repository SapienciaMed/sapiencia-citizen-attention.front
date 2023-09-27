import { EResponseCodes } from "../constants/api.enum";
import { IWorkEntity, IWorkEntityFilters } from "../interfaces/workEntity.interfaces";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function useWorkEntityService() {
  const baseURL: string = process.env.urlApiCitizenAttention;
  const listUrl: string = "/api/v1/work-entity";
  const { get, post } = useCrudService(baseURL);

  async function getWorkEntityById(id: number): Promise<ApiResponse<IWorkEntity>> {
    try {
      const endpoint: string = `/get-by-id/${id}`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IWorkEntity, EResponseCodes.FAIL, "Error no controlado");
    }
  }
  
  async function getUserByDocument(identification: number): Promise<ApiResponse<IWorkEntity>> {
    try {
      const endpoint: string = `/get-user-by-document/${identification}`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IWorkEntity, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getWorkEntityByFilters(filters: IWorkEntityFilters): Promise<ApiResponse<IWorkEntity>> {
    try {
      const endpoint: string = `/get-by-filters`;
      return await post(`${listUrl}${endpoint}`, filters);
    } catch (error) {
      return new ApiResponse({} as IWorkEntity, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function createWorkEntity(workEntity: IWorkEntity): Promise<ApiResponse<IWorkEntity>> {
    try {
      const endpoint: string = `/create/`;
      return await post(`${listUrl}${endpoint}`, { workEntity });
    } catch (error) {
      return new ApiResponse({} as IWorkEntity, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  return {
    createWorkEntity,
    getUserByDocument,
    getWorkEntityById,
    getWorkEntityByFilters,
  };
}
