import { EResponseCodes } from "../constants/api.enum";
import { IProgram } from "../interfaces/program.interfaces";
import { IUser } from "../interfaces/user.interfaces";
import { IWorkEntity, IWorkEntityFilters } from "../interfaces/workEntity.interfaces";
import { IWorkEntityType } from "../interfaces/workEntityType.interface";
import { ApiResponse, IPagingData } from "../utils/api-response";
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

  async function getWorkEntityByFilters(filters: IWorkEntityFilters): Promise<ApiResponse<IPagingData<IWorkEntity | null>>> {
    try {
      const endpoint: string = `/get-by-filters`;
      return await post(`${listUrl}${endpoint}`, filters);
    } catch (error) {
      return new ApiResponse({} as IPagingData<IWorkEntity | null>, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getUserByFilters(filters: IWorkEntityFilters): Promise<ApiResponse<IUser | null>> {
    try {
      const endpoint: string = `/get-user-by-filters`;
      return await post(`${listUrl}${endpoint}`, filters);
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getWorkEntityTypes(): Promise<ApiResponse<IWorkEntityType[]>> {
    try {
      const endpoint: string = `/get-types`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IWorkEntityType[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getProgramsAffairs(): Promise<ApiResponse<IProgram[]>> {
    try {
      const endpoint: string = `/get-programs`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IProgram[], EResponseCodes.FAIL, "Error no controlado");
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

  async function updateWorkEntity(workEntity: IWorkEntity): Promise<ApiResponse<IWorkEntity>> {
    try {
      const endpoint: string = `/update/`;
      return await post(`${listUrl}${endpoint}`, { workEntity });
    } catch (error) {
      return new ApiResponse({} as IWorkEntity, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  return {
    createWorkEntity,
    getUserByFilters,
    getUserByDocument,
    getWorkEntityById,
    getWorkEntityTypes,
    getProgramsAffairs,
    getWorkEntityByFilters,
    updateWorkEntity
  };
}
