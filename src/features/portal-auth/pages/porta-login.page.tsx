import React from "react";
import logoAlcaldiaMedellin from "../../../public/images/logo-alcaldia-black.png";
import logoSapiencia from "../../../public/images/logo-sapiencia.png";
import "../../../styles/auth-styles.scss";
import FormSignInComponent from "../components/form-sign.component";
import VersionComponent from "../components/version.component";

function PortalLoginPage(): React.JSX.Element {
  return (
    <main className="container-grid_login">
      <article className="citizen-login-visualization"></article>

      <article className="login-signIn">
        <section className="container-logos_signIn">
          <img src={logoAlcaldiaMedellin} alt="Alcaldia de medellin" />
          <img src={logoSapiencia} alt="Sapiencia" />
          <hr />
        </section>

        <section className="container-form_signIn">
          <div className="content-form_signIn">
            <FormSignInComponent />
            <VersionComponent version={"1.0.0"} />
          </div>
        </section>
      </article>
    </main>
  );
}

export default React.memo(PortalLoginPage);
