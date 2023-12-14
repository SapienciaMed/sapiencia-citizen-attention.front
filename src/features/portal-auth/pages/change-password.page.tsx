import React, { useContext } from "react";
import { useAuthService } from "../hooks/auth-service.hook";
import ChangePasswordComponent from "../components/change-password.component";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../common/contexts/app.context";

function ChangePasswordRecoveryPage(): React.JSX.Element {
  // Servicios
  const navigate = useNavigate();
  const { setMessage } = useContext(AppContext);
  const { changeUserPassword } = useAuthService();

  // Metodo ...
  const callbackChangePassword = async (data: object) => {
    const { data: dataResponse, operation } = await changeUserPassword({
      ...data,
    });

    if (operation.code === EResponseCodes.OK) {
      const identification = sessionStorage.getItem("identification");
      navigate(`../portal/${identification}`);
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

  return <ChangePasswordComponent action={callbackChangePassword} />;
}

export default React.memo(ChangePasswordRecoveryPage);
