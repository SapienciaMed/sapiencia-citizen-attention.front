import { EResponseCodes } from "../constants/api.enum";
import { IPerson, IPersonFilters } from "../interfaces/person.interfaces";
import { IPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { ApiResponse, IPagingData } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function usePqrsdfService() {
  const baseURL: string = process.env.urlApiCitizenAttention;
  const listUrl: string = "/api/v1/pqrsdf";
  const { get, post, upload } = useCrudService(baseURL);

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

  async function getPersonByDocument(identification: number): Promise<ApiResponse<IPerson | null>> {
    try {
      const endpoint: string = `/get-person-by-document/${identification}`;
      return await get(`${listUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IPerson, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getPeopleByFilters(filters: IPersonFilters): Promise<ApiResponse<IPagingData<IPerson | null>>> {
    try {
      const endpoint: string = `/get-people-by-filters`;
      return await post(`${listUrl}${endpoint}`,  filters );
    } catch (error) {
      return new ApiResponse({} as IPagingData<IPerson | null>, EResponseCodes.FAIL, "Error no controlado");
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
  
  async function upLoadFile(file) {
    const formData = new FormData();
    formData.append('files', file);
    try {
      const endpoint: string = `/upload`;
      return await upload(`${listUrl}${endpoint}`,  formData );
    } catch (error) {
      return new ApiResponse({} as IPagingData<IPerson | null>, EResponseCodes.FAIL, "Error no controlado");
    }
  }


  return {
    getPqrsdfs,
    createPqrsdf,
    getPqrsdfById,
    getPeopleByFilters,
    getPersonByDocument,
    getPqrsdfByIdentificationAndFilingNumber,
    upLoadFile
  };
}
