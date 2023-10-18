import { EResponseCodes } from "../constants/api.enum";
import { IChannelAttetion, IChannelAttetionDetail, ItypeDocument } from "../interfaces/mastersTables.interface";
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

    return{
        getDocuemntType,
        getChannelAtencion,
        getChannelAtencionid
    }    
    
}