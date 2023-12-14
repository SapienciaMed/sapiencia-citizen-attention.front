import React, { useContext, useEffect } from "react";
import { useRecoveryPassword } from "../../../common/hooks/recovery-password.hooks";
import ChangePasswordRecoveryComponent from "../components/change-password-recovery.component";
import useAuthService from "../hooks/auth-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../common/contexts/app.context";

function ChangePasswordRecoveryPage(): React.JSX.Element {
  // Servicios
  const { setMessage } = useContext(AppContext);
  const navigate = useNavigate();
  const { token: tokenRecovery, user: user, showModal } = useRecoveryPassword();
  const { changePasswordToken } = useAuthService();

  useEffect(() => {
    if (showModal)
      setMessage({
        title: "¡Error en el token!",
        description: "El token es invalido, vuelva a intentarlo generando nuevamente un correo",
        show: true,
        OkTitle: "Aceptar",
        onClose: () => {
          setMessage({});
          navigate("../ingreso");
        },
        onOk: () => {
          setMessage({});
          navigate("../ingreso");
        },
      });
  }, [showModal]);

  // callback invoke function api
  const callbackChangePassword = async (data: object) => {
    const { data: dataResponse, operation } = await changePasswordToken({
      ...data,
      tokenRecovery,
      user,
    });

    if (operation.code === EResponseCodes.OK) {
      navigate("../ingreso");
    } else {
      setMessage({
        title: "¡Ocurrio un error!",
        description: "El token es invalido o ha ocurrido un error inesperado, intenta nuevamente",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
        },
        background: true,
      });
    }
  };

  return showModal ? <></> : <ChangePasswordRecoveryComponent action={callbackChangePassword} />;
}

export default React.memo(ChangePasswordRecoveryPage);
