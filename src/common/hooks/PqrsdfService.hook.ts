import { EResponseCodes } from "../constants/api.enum";
import { IPerson, IPersonFilters } from "../interfaces/person.interfaces";
import { IPqrsdf, IpqrsdfByReques, IrequestPqrsdf, IrequestReopen } from "../interfaces/pqrsdf.interfaces";
import { ApiResponse, IPagingData } from "../utils/api-response";
import useCrudService from "./crud-service.hook";
import formDataService from "./form-data.hook";

export function usePqrsdfService() {
  const baseURL: string = process.env.urlApiCitizenAttention;
  const listUrl: string = "/api/v1/pqrsdf";
  const { get, post, upload } = useCrudService(baseURL);
  const service = formDataService(baseURL);

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

  async function createPqrsdf(pqrsdf: IPqrsdf, file:string | Blob): Promise<ApiResponse<IPqrsdf>> {
    const formData = new FormData();
    formData.append('files', file)
    formData.append('pqrsdf', JSON.stringify(pqrsdf))
    try {
      const endpoint: string = `/create/`;
      return await service.post(`${listUrl}${endpoint}`, formData );
    } catch (error) {
      return new ApiResponse({} as IPqrsdf, EResponseCodes.FAIL, "Error no controlado");
    }
  }
  
  async function upLoadFile(file: string | Blob) {
    const formData = new FormData();
    formData.append('files', file);
    try {
      const endpoint: string = `/upload`;
      return await service.post(`${listUrl}${endpoint}`,  formData );
    } catch (error) {
      return new ApiResponse({} as IPagingData<IPerson | null>, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getPqrsdfByRequest(filters: IrequestPqrsdf): Promise<ApiResponse<IpqrsdfByReques[] | null>> {
      
    try {
      const endpoint: string = `/get-request-by-filters`;
      return await post(`${listUrl}${endpoint}`,  filters );
    } catch (error) {
      return new ApiResponse({} as IpqrsdfByReques[] , EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function createRequestReopen(justification:IrequestReopen): Promise<ApiResponse<IrequestReopen>> {
    try {
      const endpoint: string = `/create-request-reopen`;
      return await post(`${listUrl}${endpoint}`,  justification );
    } catch (error) {
      return new ApiResponse({} as IrequestReopen, EResponseCodes.FAIL, "Error no controlado");
    }
  }


  return {
    getPqrsdfs,
    createPqrsdf,
    getPqrsdfById,
    getPeopleByFilters,
    getPersonByDocument,
    getPqrsdfByIdentificationAndFilingNumber,
    upLoadFile,
    getPqrsdfByRequest,
    createRequestReopen
  };
}
