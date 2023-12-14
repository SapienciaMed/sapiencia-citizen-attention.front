import { EResponseCodes } from "../../../common/constants/api.enum";
import { IAuthorization, IResponseSignIn } from "../../../common/interfaces/auth.interfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { IUser, IDecodedToken } from "../../../common/interfaces/auth.interfaces";

export function useAuthService() {
  const baseURL: string = process.env.urlApiAuth;
  const authUrl: string = "/api/v1/auth";
  const baseCitizenAttetionURL: string = process.env.urlApiCitizenAttention;
  const externalAuthUrl: string = "/api/v1/auth";

  const { get, post, put } = useCrudService(baseURL);
  const { post: postExternal } = useCrudService(baseCitizenAttetionURL);

  async function signIn(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/signin";
      return await post(`${authUrl}${endpoint}`, data);
    } catch (error) {
      return new ApiResponse({} as IResponseSignIn, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function benefactorSignIn(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/signin";
      return await post(`${baseCitizenAttetionURL}${externalAuthUrl}${endpoint}`, data);
    } catch (error) {
      return new ApiResponse({} as IResponseSignIn, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function getAuthorization(token: string): Promise<ApiResponse<IAuthorization>> {
    try {
      const endpoint: string = `/authorization/get-by-token/${token}`;
      return await get(`${authUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IAuthorization, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function BenefactorgetAuthorization(token: string): Promise<ApiResponse<IAuthorization>> {
    try {
      const endpoint: string = `/benefactor-authorization/get-by-token/${token}`;
      return await get(`${baseCitizenAttetionURL}${externalAuthUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse({} as IAuthorization, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function recoveryPassword(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/recovery-password";
      return await post(`${baseCitizenAttetionURL}${externalAuthUrl}${endpoint}`, data);
    } catch (error) {
      return new ApiResponse({} as IResponseSignIn, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function externalSignIn(data: Object): Promise<ApiResponse<IResponseSignIn>> {
    try {
      const endpoint: string = "/signin";
      return await postExternal(`${externalAuthUrl}${endpoint}`, data);
    } catch (error) {
      return new ApiResponse({} as IResponseSignIn, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function changeUserPassword(data: Object): Promise<ApiResponse<IUser>> {
    try {
      const endpoint: string = "/change-password";

      return await put(`${baseCitizenAttetionURL}${authUrl}${endpoint}`, data);
    } catch (error) {
      return new ApiResponse({} as IUser, EResponseCodes.FAIL, "Error no controlado");
    }
  }

  async function validateTokenRecovery(data: Object): Promise<ApiResponse<IDecodedToken>> {
    const endpoint: string = "/validate-token-recovery";
    return await post(`${baseCitizenAttetionURL}${authUrl}${endpoint}`, data);
  }

  async function changePasswordToken(data: Object): Promise<ApiResponse<IDecodedToken>> {
    const endpoint: string = "/change-password-recovery";
    return await post(`${baseCitizenAttetionURL}${authUrl}${endpoint}`, data);
  }

  return {
    signIn,
    benefactorSignIn,
    externalSignIn,
    getAuthorization,
    BenefactorgetAuthorization,
    recoveryPassword,
    changeUserPassword,
    validateTokenRecovery,
    changePasswordToken,
  };
}

export default useAuthService;
