import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RecoveryPassword from "../../common/components/authPage/recovery-password.page"
import BenefactorPrivateRoute from "../../common/components/Guard/benefactor-auth-guard";

function PortalAuthRoutes() {
  const PortalAuthPage = lazy(() => import("./pages/portal-login.page"));
  const Login = lazy(() => import("../../common/components/authPage/login.page"))
  const ChangePassword = lazy(() => import("../../common/components/authPage/change-password.page"))
  const ChangePasswordRecovery = lazy(() => import("../../common/components/authPage/change-password-token.page"));

  const Register_pqrsdf = lazy(() => import("../../common/components/register_pqrsdf.page"));

  return (
    <Routes>
      <Route
        path={""}
        element={
          <BenefactorPrivateRoute element={<Register_pqrsdf isPerson={true} />}/>
          // <PrivateRoute
          //   element={<PortalAuthPage />}
          //   allowedAction={"INDICADOR_ACCION_SEGURIDAD"}
          // />
        }
      />
      <Route
        path={"/ingreso"}
        element={
          <Login />
        }
      />
      <Route
        path={"/recuperar-clave"}
        element={
          <RecoveryPassword />
        }
      />
      <Route
        path={"/recuperacion-clave"}
        element={<ChangePasswordRecovery />}
      />
      <Route
        path={"/cambiar-clave"}
        element={
          <BenefactorPrivateRoute element={<ChangePassword />}/>
        }
      />
    </Routes>
  );
}

export default React.memo(PortalAuthRoutes);
