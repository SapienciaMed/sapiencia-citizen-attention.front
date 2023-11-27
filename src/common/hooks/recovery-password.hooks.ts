import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthService from "./auth-service.hook";
import { EResponseCodes } from "../constants/api.enum";

export function useRecoveryPassword() {
  // STATE
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { validateTokenRecovery } = useAuthService();

  const tokenChangePassword = searchParams.get("token");
  const user = searchParams.get("user");

  const validateTokenRedirect = async () => {
    try {
      const { operation } = await validateTokenRecovery({
        token: tokenChangePassword,
        user: user
      });
      if (operation.code === EResponseCodes.FAIL) {
        setShowModal(!showModal);
      }
    } catch (error) {
      navigate("../ingreso");
    }
  };

  useEffect(() => {
    if (!tokenChangePassword) {
      navigate("../ingreso");
    } else {
      validateTokenRedirect();
    }
  }, [searchParams]);

  return {
    token: tokenChangePassword,
    showModal,
    user:user,
  };
}
