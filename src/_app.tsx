import { addLocale, locale } from "primereact/api";
import "primereact/resources/primereact.min.css";
import React, { Suspense, lazy, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ApplicationProvider from "./application-provider";
import ModalMessageComponent from "./common/components/modal-message.component";
import { AppContextProvider } from "./common/contexts/app.context";
import useAppCominicator from "./common/hooks/app-communicator.hook";
import primereact_es from "./common/langs/primereact_es.json";
import "./styles/_app.scss";
import "./styles/output/utilities.scss";
import WorkEntitiesPage from "./common/components/work-entities.page";
import CreateWorkEntitiesPage from "./common/components/create-work-entities.page";
import PrivateRoute from "./common/components/Guard/auth-private-guard";
import PortalAuthRoutes from "./features/portal-auth/portal-auth.routes";


function App() {
  //const HomePage = lazy(() => import("./common/components/home.page"));
  addLocale("es", primereact_es.es);
  locale("es");
  const Register_pqrsdf = lazy(() => import("./common/components/register_pqrsdf.page"));
  const HomePage = lazy(() => import("./common/components/home.page"));
  const CalendarPage = lazy(() => import("./common/components/calendar.page"));
  const QueryPqrsdfPage = lazy(() => import("./common/components/query-pqrsdf.page"));
  const EditWorkEntitiesPage = lazy(() => import("./common/components/edit-work-entities.page"));
  const AttentionTocitizens = lazy(() => import("./common/components/attentionTocitizens.page"));
  const { publish } = useAppCominicator();

  // Effect que cominica la aplicacion actual
  useEffect(() => {
    localStorage.setItem("currentAplication", process.env.aplicationId);
    setTimeout(() => publish("currentAplication", process.env.aplicationId), 500);
  }, []);

  return (
    <AppContextProvider>
      <ModalMessageComponent />
      <ApplicationProvider>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path={"/portal/*"} element={<PortalAuthRoutes />} />
              {/*<Route path={"/atencion-ciudadana/"} element={<HomePage />} />;*/}
              <Route path={"/atencion-ciudadana/"} element={<Register_pqrsdf />} />
              <Route path={"/atencion-ciudadana/calendario"} element={<CalendarPage />} />;
              <Route path={"/atencion-ciudadana/register-pqrsdf"} element={<Register_pqrsdf />} />
              <Route
                path={"/atencion-ciudadana/entidades-trabajo/"}
                element={<PrivateRoute element={<WorkEntitiesPage />} allowedAction={"ENTIDADES_TRABAJO_CONSULTAR"} />}
              />
              <Route
                path={"/atencion-ciudadana/entidades-trabajo/crear"}
                element={
                  <PrivateRoute element={<CreateWorkEntitiesPage />} allowedAction={"ENTIDADES_TRABAJO_CREAR"} />
                }
              />
              <Route
                path={"/atencion-ciudadana/entidades-trabajo/editar/:id"}
                element={<PrivateRoute element={<EditWorkEntitiesPage />} allowedAction={"ENTIDADES_TRABAJO_EDITAR"} />}
              />
              <Route 
                path={"/atencion-ciudadana/atencion-ciudadania-radicar-pqrsdf"} 
                element={<PrivateRoute element={<AttentionTocitizens />} allowedAction={"RADICAR_PQRSDF"}  />} 
              />
              <Route 
                path={"/atencion-ciudadana/atencion-ciudadania-radicar-pqrsdf/radicar/:identification"} 
                element={<PrivateRoute element={<Register_pqrsdf isPerson={true} isPersonInternl={true} />} allowedAction={"RADICAR_PQRSDF"}  />} 
                //element={<Register_pqrsdf isPerson={true} isPersonInternl={true} />} 
              />
              <Route 
                path={"/atencion-ciudadana/atencion-ciudadania-radicar-pqrsdf/radicar"}
                //element={<Register_pqrsdf isPerson={false} isPersonInternl={true} />} 
              />
              <Route 
                path={"/atencion-ciudadana/presentar-pqrsdf/:identification"} 
                element={<Register_pqrsdf isPerson={true} />} 
              />
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path={"/atencion-ciudadana/consultar-pqrsdf"} element={<QueryPqrsdfPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AppContextProvider>
  );
}
export default React.memo(App);
