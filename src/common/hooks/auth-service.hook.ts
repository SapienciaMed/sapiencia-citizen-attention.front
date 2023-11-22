import { EResponseCodes } from "../constants/api.enum";
import { IAuthorization,   IResponseSignIn,
} from "../interfaces/auth.interfaces";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function useAuthService() {
  const baseURL: string = process.env.urlApiAuth;
  const authUrl: string = "/api/v1/auth";
  const baseCitizenAttetionURL: string = process.env.urlApiCitizenAttention;
  const externalAuthUrl: string = "/api/v1/auth";

  const { get, post } = useCrudService( baseURL);
  const { post: postExternal } = useCrudService(baseCitizenAttetionURL);

  async function signIn(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/signin";
      return await post(`${authUrl}${endpoint}`, data);

    } catch (error) {
      return new ApiResponse(
        {} as IResponseSignIn,
        EResponseCodes.FAIL,
        "Error no controlado"
      );
    }
  }

  async function benefactorSignIn(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/signin";
      return await post(`${authUrl}${endpoint}`, data);

    } catch (error) {
      return new ApiResponse(
        {} as IResponseSignIn,
        EResponseCodes.FAIL,
        "Error no controlado"
      );
    }
  }

  async function getAuthorization(
    token: string
  ): Promise<ApiResponse<IAuthorization>> {
    try {
      const endpoint: string = `/authorization/get-by-token/${token}`;
      return await get(`${authUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse(
        {} as IAuthorization,
        EResponseCodes.FAIL,
        "Error no controlado"
      );
    }
  }

  async function recoveryPassword(
    data: Object
  ): Promise<ApiResponse<IResponseSignIn>> {
    const endpoint: string = "/recoverypassword";
    return await post(`${authUrl}${endpoint}`, data);
  }

  async function externalSignIn(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/signin";
      return await postExternal(`${externalAuthUrl}${endpoint}`, data);
    } catch (error) {
      return new ApiResponse(
        {} as IResponseSignIn,
        EResponseCodes.FAIL,
        "Error no controlado"
      );
    }
  }

  return {
    signIn,
    benefactorSignIn,
    externalSignIn,
    getAuthorization,
    recoveryPassword
  };
}

export default useAuthService;
