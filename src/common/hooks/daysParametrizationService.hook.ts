import { EResponseCodes } from "../constants/api.enum";
import { IDayType } from "../interfaces/dayType.interfaces";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function useDaysParametrizationService() {
    const baseURL: string = process.env.urlApiCitizenAttention;
    const listUrl: string = "/api/v1/day-parametrization";
    const { get, post } = useCrudService(baseURL);

    async function getDaysParametrizations(): Promise<ApiResponse<IDaysParametrization[] | []>> {
        try {
            const endpoint: string = `/get-all/`;
            return await get(`${listUrl}${endpoint}`);
        } catch (error) {
            return new ApiResponse({} as IDaysParametrization[], EResponseCodes.FAIL, "Error no controlado");
        }
    }

    async function getDayTypes(): Promise<ApiResponse<IDayType[] | []>> {
        try {
            const endpoint: string = `/get-day-types/`;
            return await get(`${listUrl}${endpoint}`);
        } catch (error) {
            return new ApiResponse({} as IDayType[], EResponseCodes.FAIL, "Error no controlado");
        }
    }

    async function getDaysParametrizationById(id: number): Promise<ApiResponse<IDaysParametrization>> {
        try {
            const endpoint: string = `/get-by-id/${id}`;
            return await get(`${listUrl}${endpoint}`);
        } catch (error) {
            return new ApiResponse({} as IDaysParametrization, EResponseCodes.FAIL, "Error no controlado");
        }
    }

    async function createDaysParametrization(year: number): Promise<ApiResponse<IDaysParametrization>> {
        try {
            const endpoint: string = `/create/`;
            return await post(`${listUrl}${endpoint}`, { year });
        } catch (error) {
            return new ApiResponse({} as IDaysParametrization, EResponseCodes.FAIL, "Error no controlado");
        }
    }

    return {
        getDayTypes,
        getDaysParametrizations,
        createDaysParametrization,
        getDaysParametrizationById,
    };
}
