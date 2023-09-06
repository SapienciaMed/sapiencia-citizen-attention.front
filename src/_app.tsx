import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./common/contexts/app.context";
import "./styles/_app.scss";
import "primereact/resources/primereact.min.css";
import ModalMessageComponent from "./common/components/modal-message.component";
import ApplicationProvider from "./application-provider";
import useAppCominicator from "./common/hooks/app-communicator.hook";

function App() {
 //const HomePage = lazy(() => import("./common/components/home.page"));
  const Register_pqrsdf = lazy(() => import("./common/components/register_pqrsdf.page"))
  const { publish } = useAppCominicator();

  // Effect que cominica la aplicacion actual
  useEffect(() => {
    localStorage.setItem("currentAplication", process.env.aplicationId);
    setTimeout(
      () => publish("currentAplication", process.env.aplicationId),
      500
    );
  }, []);

  return (
    <AppContextProvider>
      <ModalMessageComponent />
      <ApplicationProvider>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              {/*<Route path={"/atencion-ciudadana/"} element={<HomePage />} />;*/}
              <Route path={"/atencion-ciudadana/"} element={<Register_pqrsdf />}/>
              {/* <Route path={"/direccion-estrategica/razon-social/*"} element={<BussinesRoutes />} />
            <Route path={"/direccion-estrategica/contratos/*"} element={<ContractRoutes />} /> */}
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default React.memo(App);
