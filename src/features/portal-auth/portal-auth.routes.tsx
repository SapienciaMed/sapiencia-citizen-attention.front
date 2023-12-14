import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RecoveryPassword from "./pages/recovery-password.page";
import BenefactorPrivateRoute from "../../common/components/Guard/benefactor-auth-guard";

function PortalAuthRoutes() {
  const PortalHomePage = lazy(() => import("./pages/portal-home.page"));
  const PortalLoginPage = lazy(() => import("./pages/porta-login.page"));
  const ChangePasswordPage = lazy(() => import("./pages/change-password.page"));
  const ChangePasswordRecoveryPage = lazy(() => import("./pages/change-password-token.page"));
  const RegisterPqrsdfPage = lazy(() => import("../../common/components/register_pqrsdf.page"));

  return (
    <Routes>
      <Route path={"/layout"} element={<PortalHomePage />} />
      <Route path={"/ingreso"} element={<PortalLoginPage />} />
      <Route path={"/recuperar-clave"} element={<RecoveryPassword />} />
      <Route path={"/recuperacion-clave"} element={<ChangePasswordRecoveryPage />} />
      <Route path={"/cambiar-clave"} element={<BenefactorPrivateRoute element={<ChangePasswordPage />} />} />

      <Route
        path={"/:identification"}
        element={<BenefactorPrivateRoute element={<RegisterPqrsdfPage isPerson={true} />} />}
      />
    </Routes>
  );
}

export default React.memo(PortalAuthRoutes);
