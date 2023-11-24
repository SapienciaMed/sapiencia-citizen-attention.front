import { EResponseCodes } from "../constants/api.enum";
import { IProgram } from "../interfaces/program.interfaces";
import {
  IAttentionRequestType,
  ICitizenAttention,
  ICitizenAttentionFilters,
  ICorregimiento,
  IServiceChannel,
  IValueGroup,
} from "../interfaces/citizenAttention.interfaces";
import { ApiResponse, IPagingData } from "../utils/api-response";
import { useWorkEntityService } from "./WorkEntityService.hook";
import useCrudService from "./crud-service.hook";
import { IDependence } from "../interfaces/dependence.interfaces";
import { IRequestSubjectType } from "../interfaces/requestSubjectType.interfaces";
import { IGenericData } from "../interfaces/genericData.interfaces";

export function useCitizenAttentionService() {
  const baseURL: string = process.env.urlApiCitizenAttention;
  const listUrl: string = "/api/v1/citizen-attention";
  const { get, post } = useCrudService(baseURL);
  const workEntityService = useWorkEntityService();

  async function getCitizenAttentionById(id: number): Promise<ApiResponse<ICitizenAttention>> {
    try {
      const endpoint: string = `/get-by-id/${id}`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as ICitizenAttention, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getCitizenAttentionByFilters(
    filters: ICitizenAttentionFilters
  ): Promise<ApiResponse<IPagingData<ICitizenAttention | null>>> {
    try {
      const endpoint: string = `/get-by-filters`;
      return await post(`${listUrl}${endpoint}`, filters);
    } catch (error) {
      return new ApiResponse({} as IPagingData<ICitizenAttention | null>, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getDocumentType(): Promise<ApiResponse<any>> {
    try {
      const endpoint: string = `/get-document-type`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getAttentionRequestTypes(): Promise<ApiResponse<IAttentionRequestType[]>> {
    try {
      const endpoint: string = `/get-attention-request-types`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IAttentionRequestType[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getStratums(): Promise<ApiResponse<IGenericData[]>> {
    try {
      const endpoint: string = `/get-stratums`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IGenericData[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getCorregimientos(): Promise<ApiResponse<ICorregimiento[]>> {
    try {
      const endpoint: string = `/get-corregimientos`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as ICorregimiento[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getDependencies(): Promise<ApiResponse<IDependence[]>> {
    try {
      const endpoint: string = `/get-dependencies`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IDependence[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getPrograms(): Promise<ApiResponse<IProgram[]>> {
    try {
      const endpoint: string = `/get-programs`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IProgram[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getRequestSubjectTypes(): Promise<ApiResponse<IRequestSubjectType[]>> {
    try {
      const endpoint: string = `/get-request-subject-types`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IRequestSubjectType[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getSeviceChannels(): Promise<ApiResponse<IServiceChannel[]>> {
    try {
      const endpoint: string = `/get-sevice-channels`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IServiceChannel[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getValueGroups(): Promise<ApiResponse<IValueGroup[]>> {
    try {
      const endpoint: string = `/get-value-groups`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse([] as IValueGroup[], EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function createCitizenAttention(citizenAttention: ICitizenAttention): Promise<ApiResponse<ICitizenAttention>> {
    try {
      const endpoint: string = `/create`;
      return await post(`${listUrl}${endpoint}`, { citizenAttention });
    } catch (error) {
      return new ApiResponse({} as ICitizenAttention, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function updateCitizenAttention(citizenAttention: ICitizenAttention): Promise<ApiResponse<ICitizenAttention>> {
    try {
      const endpoint: string = `/update`;
      return await post(`${listUrl}${endpoint}`, { citizenAttention });
    } catch (error) {
      return new ApiResponse({} as ICitizenAttention, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  return {
    getStratums,
    getPrograms,
    getValueGroups,
    getDependencies,
    getDocumentType,
    getCorregimientos,
    getSeviceChannels,
    getRequestSubjectTypes,
    updateCitizenAttention,
    createCitizenAttention,
    getCitizenAttentionById,
    getAttentionRequestTypes,
    getCitizenAttentionByFilters,
  };
}
