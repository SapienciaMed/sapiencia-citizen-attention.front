import React, { useContext } from "react";
import { useAuthService } from "../../hooks/auth-service.hook";
import ChangePasswordComponent from "./change-password.component";
import { EResponseCodes } from "../../constants/api.enum";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";

function ChangePasswordRecovery(): React.JSX.Element {
  const navigate = useNavigate();
  const { setMessage } = useContext(AppContext);

  const { changeUserPassword } = useAuthService();

  const callbackChangePassword = async (data: object) => {
    const { data: dataResponse, operation } = await changeUserPassword({
      ...data,
    });    

    if (operation.code === EResponseCodes.OK) {
      navigate("../portal");
    } else {
      setMessage({
        title: "¡Ocurrio un error!",
        description:
          "El token es invalido o ha ocurrido un error inesperado, intenta nuevamente",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
        },
        background: true,
      });
    }
  };

  return <ChangePasswordComponent action={callbackChangePassword} />;
}

export default React.memo(ChangePasswordRecovery);
