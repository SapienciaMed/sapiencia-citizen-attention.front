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

function App() {
    //const HomePage = lazy(() => import("./common/components/home.page"));
    addLocale("es", primereact_es.es);
    locale("es");
    const Register_pqrsdf = lazy(() => import("./common/components/register_pqrsdf.page"));
    const HomePage = lazy(() => import("./common/components/home.page"));
    const CalendarPage = lazy(() => import("./common/components/calendar.page"));
    const QueryPqrsdfPage = lazy(() => import("./common/components/query-pqrsdf.page"));
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
                            {/*<Route path={"/atencion-ciudadana/"} element={<HomePage />} />;*/}
                            <Route path={"/atencion-ciudadana/"} element={<Register_pqrsdf />} />
                            <Route path={"/atencion-ciudadana/calendario"} element={<CalendarPage />} />;
                            <Route path={"/atencion-ciudadana/register-pqrsdf"} element={<Register_pqrsdf />}/>                                                        
                            <Route path={"/atencion-ciudadana/consultar-pqrsdf"} element={<QueryPqrsdfPage />}/>                                                        
                        </Routes>
                    </Suspense>
                </Router>
            </ApplicationProvider>
        </AppContextProvider>
    );

  }
export default React.memo(App)
