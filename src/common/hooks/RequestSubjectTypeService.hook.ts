import { EResponseCodes } from "../constants/api.enum";
import { IProgram } from "../interfaces/program.interfaces";
import {
  IRequestObject,
  IRequestSubjectType,
  IRequestSubjectTypeFilters,
} from "../interfaces/requestSubjectType.interfaces";
import { ApiResponse, IPagingData } from "../utils/api-response";
import { useWorkEntityService } from "./WorkEntityService.hook";
import useCrudService from "./crud-service.hook";

export function useRequestSubjectTypeService() {
  const baseURL: string = process.env.urlApiCitizenAttention;
  const listUrl: string = "/api/v1/request-subject-type";
  const { get, post } = useCrudService(baseURL);
  const workEntityService = useWorkEntityService();

  async function getRequestSubjectTypeById(id: number): Promise<ApiResponse<IRequestSubjectType>> {
    try {
      const endpoint: string = `/get-by-id/${id}`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IRequestSubjectType, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getRequestSubjectTypeByFilters(
    filters: IRequestSubjectTypeFilters
  ): Promise<ApiResponse<IPagingData<IRequestSubjectType | null>>> {
    try {
      const endpoint: string = `/get-by-filters`;
      return await post(`${listUrl}${endpoint}`, filters);
    } catch (error) {
      return new ApiResponse({} as IPagingData<IRequestSubjectType | null>, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getRequestObjects(): Promise<ApiResponse<IRequestObject[]>> {
    try {
      const endpoint: string = `/get-request-objects`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IRequestObject[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getPrograms(): Promise<ApiResponse<IProgram[]>> {
    return await workEntityService.getProgramsAffairs();
  }

  async function createRequestSubjectType(
    requestSubjectType: IRequestSubjectType
  ): Promise<ApiResponse<IRequestSubjectType>> {
    try {
      const endpoint: string = `/create/`;
      return await post(`${listUrl}${endpoint}`, { requestSubjectType });
    } catch (error) {
      return new ApiResponse({} as IRequestSubjectType, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function updateRequestSubjectType(
    requestSubjectType: IRequestSubjectType
  ): Promise<ApiResponse<IRequestSubjectType>> {
    try {
      const endpoint: string = `/update/`;
      return await post(`${listUrl}${endpoint}`, { requestSubjectType });
    } catch (error) {
      return new ApiResponse({} as IRequestSubjectType, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  return {
    getRequestSubjectTypeById,
    getRequestObjects,
    getPrograms,
    getRequestSubjectTypeByFilters,
    createRequestSubjectType,
    updateRequestSubjectType,
  };
}
