import React from "react";
import logoAlcaldiaMedellin from "../../../public/images/logo-alcaldia-black.png";
import logoSapiencia from "../../../public/images/logo-sapiencia.png";

import  FormSignIn  from "../components/form-sign.component";
import VersionSapiencia from "./version-sapiencia.component";


const PortalLoginContainerComponent = (): React.JSX.Element => {
  return <>
   <main className="container-grid_login">
      <article className="login-visualization">
        <section className="login-container-aurora">
          <img
            className="img-mobil"
            src={require("../../../public/images/icons-application/aurora-white-logo.svg")}
            alt="aurora"
          />
          <span className="text-login huge">
            Bienvenid@ a{" "}
            <img
            src={require("../../../public/images/icons-application/aurora-white-logo.svg")}
            alt="aurora"
            />{" "}
          </span>
          <span className="text-login extra-large">
            Sistema de información Sapiencia
          </span>
        </section>
      </article>

      <article className="login-signIn">
        <section className="container-logos_signIn">
          <img src={logoAlcaldiaMedellin} alt="Alcaldia de medellin" />
          <img src={logoSapiencia} alt="Sapiencia" />
          <hr />
        </section>

        <section className="container-form_signIn">
          <div className="content-form_signIn">
            <FormSignIn />
            <VersionSapiencia version={"1.0.0"} />
          </div>
        </section>
      </article>
    </main>
  </>;
};

export default React.memo(PortalLoginContainerComponent);
