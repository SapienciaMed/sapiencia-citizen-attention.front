import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";
import { useApplicationsData } from "../hooks/applications-container.hook";
import { AppContext } from "../../../common/contexts/app.context";

function HomePage(): React.JSX.Element {
  const { portalUser } = useContext(AppContext);
  const navigate = useNavigate();
  const { applications } = useApplicationsData();

  return (
    <div className="full-height">
      <div className="dashboard-margin-ac full-height">
        <section className="welcome-container">
          <span className="text-dasboard huge text-center title">Bienvenido</span>
          <p className="text-dasboard big text-center content">
            Sapiencia es la Agencia de Educación Postsecundaria de la{" "}
            <span className="primary-bold">
              <a target="_blank" href="https://www.medellin.gov.co/">
                Alcaldía de Medellín
              </a>
            </span>
            , encargada de liderar los proyectos y programas de la educación postsecundaria de la ciudad.
          </p>
          <p className="text-dasboard big text-center content">Esta plataforma está diseñada para...</p>
          <a className="external-link" target="_blank" href="https://www.medellin.gov.co/">
            <button type="submit" className="citizen-button-main huge hover-three">
              Saber mas...
            </button>
          </a>
        </section>
      </div>
      <div className="full-height">
        <div className="applications-cards" style={{ marginTop: "5%" }}>
          {applications.map((app: IMenuAccess) => {
            let imagePath: string | undefined;
            try {
              imagePath = require(`../../../public/images/application-image-${app.id}.png`);
            } catch {
              imagePath = require("../../../public/images/application-image-default.png");
            }
            return (
              <div
                className="card-container"
                key={app.id}
                onClick={() => {
                  navigate(app.url.replace("$$identification", portalUser.identification));
                }}
              >
                <div className="card-header">
                  <img src={imagePath} />
                </div>
                <div className="card-footer">
                  <p className="text-dasboard-name-applications big text-center weight-500 application-name">
                    {app.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="footer-portal">
        <span>Alcaldía de Medellín - Distrito de Ciencia, Tecnología y Educación - 2024</span>
      </div>
    </div>
  );
}

export default React.memo(HomePage);
