import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RecoveryPassword from "../../common/components/authPage/recovery-password.page"

function PortalAuthRoutes() {
  const PortalAuthPage = lazy(() => import("./pages/portal-login.page"));
  const Login = lazy(() => import("../../common/components/authPage/login.page"))
  const ChangePasswordRecovery = lazy(() => import("../../common/components/authPage/change-password.page"))
  const Register_pqrsdf = lazy(() => import("../../common/components/register_pqrsdf.page"));

  return (
    <Routes>
      <Route
        path={""}
        element={
          <Register_pqrsdf isPerson={true} />
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
          // <PrivateRoute
          //   element={<PortalAuthPage />}
          //   allowedAction={"INDICADOR_ACCION_SEGURIDAD"}
          // />
        }
      />
      <Route
        path={"/recuperar-clave"}
        element={
          <RecoveryPassword />
          // <PrivateRoute
          //   element={<PortalAuthPage />}
          //   allowedAction={"INDICADOR_ACCION_SEGURIDAD"}
          // />
        }
      />
            <Route
        path={"/cambiar-clave"}
        element={
          <ChangePasswordRecovery />
          // <PrivateRoute
          //   element={<PortalAuthPage />}
          //   allowedAction={"INDICADOR_ACCION_SEGURIDAD"}
          // />
        }
      />
    </Routes>
  );
}

export default React.memo(PortalAuthRoutes);
