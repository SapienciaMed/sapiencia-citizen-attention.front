import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";


function PortalAuthRoutes() {
  const PortalAuthPage = lazy(() => import("./pages/portal-login.page"));

  return (
    <Routes>
      <Route
        path={"/ingreso"}
        element={
          <PortalAuthPage />
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
