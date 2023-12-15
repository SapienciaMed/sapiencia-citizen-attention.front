import moment from "moment-timezone";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook";
import { useDaysParametrizationService } from "../hooks/daysParametrizationService.hook";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import { IPqrsdf, IrequestPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { TableManagePqrsdfComponent } from "./genericComponent/tableManagePqrsdf.component";

import useBreadCrumb from "../../common/hooks/bread-crumb.hook";
import "../../styles/managePgrsdf-style.scss";

interface Detail {
  detailDate?: string;
  dayTypeId?: number;
}

const ManagePqrsdf = () => {
  const pqrsdfService = usePqrsdfService();
  const daysServices = useDaysParametrizationService();

  const [statusRequest, setStatusRequest] = useState<boolean>(true);
  const [pqrs, setPqrs] = useState<object[]>([]);  
  const [title, getTitle] = useState<String>("Gestionar PQRDSF");
  const [showManage, setshowManage] = useState<boolean>(false);
  const [titleButton, setTitleButton] = useState<string>("Solicitudes en trámite");

  useBreadCrumb({
    isPrimaryPage: true,
    name: "Gestionar PQRDSF",
    url: "/atencion-ciudadana/gestionar-pqrsdf",
  });

  let weekends = [];
  const countDays = (initialDate: moment.MomentInput, holidays: string[]) => {
    const diasFestivos = holidays;
    const Dateformt = moment(initialDate).format("YYYY-MM-DD");
    const fechaInicial = moment(Dateformt);
    const fechaActual = moment();
    let diasTranscurridos = 0;

    while (fechaInicial.isBefore(fechaActual)) {
      // Verifica si el día de la semana no es sábado (6) ni domingo (0)
      if (
        fechaInicial.day() !== 6 &&
        fechaInicial.day() !== 0 &&
        !diasFestivos.some((festivo) => moment(festivo).isSame(fechaInicial, "day"))
      ) {
        diasTranscurridos++;
      }

      fechaInicial.add(1, "days");
    }

    weekends = compareDatesInRange(holidays, initialDate);

    weekends.forEach((dates) => {
      const Dateformt = moment(dates).format("YYYY-MM-DD");
      let days = moment(Dateformt);

      if (days.day() == 6 || days.day() == 0) {
        diasTranscurridos++;
      }
    });

    return diasTranscurridos - 1;
  };

  function compareDatesInRange(datesArray, startDate) {
    // Convierte las fechas en objetos Moment
    const momentStartDate = moment(startDate);
    const momentEndDate = moment();

    // Filtra las fechas en el rango especificado
    const datesInRange = datesArray.filter((date) => {
      const momentDate = moment(date);
      return momentDate.isBetween(momentStartDate, momentEndDate, null, "[]");
    });

    return datesInRange;
  }

  function countDaysCalendar(fechaInicial: moment.MomentInput) {
    const fechaInicialMoment = moment(fechaInicial, "YYYY-MM-DD");

    const fechaActualMoment = moment();

    const diasTranscurridos = fechaActualMoment.diff(fechaInicialMoment, "days");

    return diasTranscurridos;
  }

  const daysParametrization = async () => {
    const { data } = await daysServices.getDaysParametrizations();

    const workingDays = [];

    const daysParametrization = await data.map((values: IDaysParametrization) => {
      return {
        daysParametrization: values["daysParametrizationDetails"],
      };
    });

    daysParametrization.forEach((values) => {
      values.daysParametrization.forEach((value: Detail) => {
        if (value) {
          workingDays.push(value.detailDate);
        }
      });
    });

    return workingDays;
  };

  const getPqrsdf = async (param: IrequestPqrsdf) => {
    const workingDays = await daysParametrization();

    const resp = await pqrsdfService.getPqrsdfByRequest(param);
    const { data } = resp;

    const pqrsdfData = data.map((pqr: IPqrsdf) => {
      return {
        radicado: pqr?.filingNumber,
        identification: pqr?.person?.identification,
        names: `${pqr?.person?.firstName} ${pqr?.person?.secondName} ${pqr?.person?.firstSurname} ${pqr?.person?.secondSurname}`,
        program: pqr?.program?.prg_descripcion ?? "",
        asunto: pqr?.requestSubject?.aso_asunto ?? "",
        fechaRadicado: moment(pqr?.createdAt).format("DD-MM-YYYY"),
        estado: pqr?.status?.lep_estado,
        fechaProrroga: pqr?.extensionDate ?? "",
        dias:
          pqr?.requestSubject?.requestObject?.obs_tipo_dias === "Calendario"
            ? countDaysCalendar(pqr?.createdAt)
            : countDays(pqr?.createdAt, workingDays),
        pqrsdfId: pqr?.id,
        sbrEstado: pqr?.reopenRequest?.justification ?? "",
      };
    });

    setPqrs(pqrsdfData);
  };

  async function focusBtn(id: string) {
    const btn1 = document.getElementById("btn-1");
    const btn2 = document.getElementById("btn-2");
    switch (id) {
      case "btn-1":
        await getPqrsdf({ typeReques: 2 });
        btn1.style.color = "#533893";
        btn1.style.borderBottom = "solid 2px #533893";
        btn2.style.color = "#6C757D";
        btn2.style.borderBottom = "0";
        setStatusRequest(true);
        break;

      case "btn-2":
        await getPqrsdf({ typeReques: 3 });
        btn2.style.color = "#533893";
        btn2.style.borderBottom = "solid 2px #533893";
        btn1.style.color = "#6C757D";
        btn1.style.borderBottom = "0";
        setStatusRequest(false);
        break;
      default:
        await getPqrsdf({ typeReques: 2 });
        btn1.style.color = "#533893";
        btn1.style.borderBottom = "solid 2px #533893";
        btn2.style.color = "#6C757D";
        btn2.style.borderBottom = "0";
        break;
    }
  }

  useEffect(() => {
    focusBtn("btn-1");
  }, []);
  
  return (
    <>
      <div className="container-div">
        <Card title={<p className="text-3xl block pb-5">{title}</p>} className="card-container card-top">
          {showManage ? (
            <></>
          ) : (
            <div className="flex flex-row justify-between mt-10 card-mobil">
              <Card className="zise-card box1 shadow-none">
                <div className="box-mobil">
                  <div className="flex justify-end">
                    <div className="punto1 mb-4"></div>
                  </div>
                  <div>
                    <p className="text-xl mb-4 box-text">Solicitudes pendientes</p>
                    <p className="text-sm">por respuesta del área de permanencia</p>
                  </div>
                </div>
              </Card>
              <Card className="zise-card box2 shadow-none">
                <div className="box-mobil">
                  <div className="flex justify-end">
                    <div className="punto2 mb-4"></div>
                  </div>
                  <div>
                    <p className="text-xl mb-4 box-text">Solicitudes con respuesta</p>
                    <p className="text-sm">por parte del área de permanencia</p>
                  </div>
                </div>
              </Card>
              <Card className="zise-card box3 shadow-none">
                <div className="box-mobil">
                  <div className="flex justify-end">
                    <div className="punto3 mb-4"></div>
                  </div>
                  <div>
                    <p className="text-xl">Solicitudes con prórroga</p>
                  </div>
                </div>
              </Card>
              <Card className="zise-card box4 shadow-none">
                <div className="box-mobil">
                  <div className="flex justify-end">
                    <div className="punto4 mb-4"></div>
                  </div>
                  <div>
                    <p className="text-xl">Solicitudes cerradas con petición de reapertura</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <div className="div-end mt-10 mb-10">
            <button className="btn-t btn-1" id="btn-1" onClick={async () => await focusBtn("btn-1")}>
              {titleButton}
            </button>
            <button className="btn-t btn-2" id="btn-2" onClick={async () => await focusBtn("btn-2")}>
              Solicitudes cerradas
            </button>
          </div>
          <Card className="card-container mt-10 card-bottom">
            <TableManagePqrsdfComponent
              statusReq={statusRequest}
              dataPqrsdf={pqrs}
              getPqrsdfClose={() => getPqrsdf({ typeReques: 3 })}
            />
          </Card>
        </Card>
      </div>
    </>
  );
};

export default ManagePqrsdf;
