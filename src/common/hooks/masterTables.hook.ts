import { EResponseCodes } from "../constants/api.enum";
import {  Countrys, Departament, 
          IChannelAttetion, IChannelAttetionDetail, 
          IMunicipality, ItypeDocument, 
          ItypeRFequest, IlegalEntityType, 
          IMResponseMedium, IProgram, ISubjectRequest } from "../interfaces/mastersTables.interface";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";


export function mastersTablesServices() {
    const baseURL: string = process.env.urlApiCitizenAttention;
    const listUrl: string = "/api/v1/utility";
    const { get } = useCrudService(baseURL);

    async function getDocuemntType(): Promise<ApiResponse<ItypeDocument[]>> {
        try {
          const endpoint: string = `/document-types`;
          return await get(`${listUrl}${endpoint}`);
        } catch (error) {
          return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
        }
    };

    async function getChannelAtencion(): Promise<ApiResponse<IChannelAttetion[]>> {
      try {
        const endpoint: string = `/channel-attention`;
        return await get(`${listUrl}${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getChannelAtencionid(id:number): Promise<ApiResponse<IChannelAttetionDetail[]>> {
      try {
        const endpoint: string = `/channel-attention-details/${id}`;
        return await get(`${listUrl}${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getTypeRequest(): Promise<ApiResponse<ItypeRFequest[]>> {
      try {
        const endpoint: string = `/request-types`;
        return await get(`${listUrl}${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getTypeLegalentity(): Promise<ApiResponse<IlegalEntityType[]>> {
      try {
        const endpoint: string = `/get-type-legal-entity`;
        return await get(`${listUrl}${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };
    
    async function getCountrys(): Promise<ApiResponse<Countrys[]>> {
      try {
        const endpoint: string = `/get-paises`;
        return await get(`${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getDepartament(): Promise<ApiResponse<Departament[]>> {
      try {
        const endpoint: string = `/get-departamentos`;
        return await get(`${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getMunicipality(): Promise<ApiResponse<IMunicipality[]>> {
      try {
        const endpoint: string = `/get-municipios/5`;
        return await get(`${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getResponseMediun(): Promise<ApiResponse<IMResponseMedium[]>> {
      try {
        const endpoint: string = `/get-response-medium`;
        return await get(`${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getProgram(): Promise<ApiResponse<IProgram[]>> {
      try {
        const endpoint: string = `/get-Programs`;
        return await get(`${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    async function getSbjectRequest(): Promise<ApiResponse<ISubjectRequest[]>> {
      try {
        const endpoint: string = `/get-solicitudes`;
        return await get(`${endpoint}`);
      } catch (error) {
        return new ApiResponse([], EResponseCodes.FAIL, "Error no controlado");
      }
    };

    return{
        getDocuemntType,
        getChannelAtencion,
        getChannelAtencionid,
        getTypeRequest,
        getTypeLegalentity,
        getCountrys,
        getDepartament,
        getMunicipality,
        getResponseMediun,
        getProgram,
        getSbjectRequest
    }    
    
}