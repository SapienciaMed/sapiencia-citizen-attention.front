import React from "react";
import PortalLoginContainer from "../components/portal-login.container";

const PortalLoginPage = () => {
  return (
    <>
      <h1>Portal Ciudadanos</h1>
      <PortalLoginContainer/>
    </>
  );
};

export default React.memo(PortalLoginPage);
