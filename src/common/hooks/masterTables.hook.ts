import { EResponseCodes } from "../constants/api.enum";
import { ItypeDocument } from "../interfaces/mastersTables.interface";
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
    }

    return{
        getDocuemntType
    }    
    
}