import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RecoveryPassword from "../../common/components/authPage/recovery-password.page"


function PortalAuthRoutes() {
  const PortalAuthPage = lazy(() => import("./pages/portal-login.page"));
  const Login = lazy(() => import("../../common/components/authPage/login.page"))

  return (
    <Routes>
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
    </Routes>
  );
}

export default React.memo(PortalAuthRoutes);
