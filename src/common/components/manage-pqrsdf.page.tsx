import moment from "moment-timezone";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook";
import { useDaysParametrizationService } from "../hooks/daysParametrizationService.hook";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import { IPqrsdf, IPqrsdfResponse, IrequestPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { TableManagePqrsdfComponent } from "./genericComponent/tableManagePqrsdf.component";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import useBreadCrumb from "../../common/hooks/bread-crumb.hook";
import "../../styles/managePgrsdf-style.scss";
import { EResponseCodes } from "../constants/api.enum";
import { IPagination, IPagingData } from "../utils/api-response";
import { toLocaleDate } from "../utils/helpers";

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
        names: pqr?.person?.businessName
          ? pqr?.person?.businessName
          : `${pqr?.person?.firstName ?? ""} ${pqr?.person?.secondName ?? ""} ${pqr?.person?.firstSurname ?? ""} ${
              pqr?.person?.secondSurname ?? ""
            }`,
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

  const paginatorTemplate = (prev = "Anterior", next = "Siguiente") => {
    return {
      layout: "PrevPageLink PageLinks NextPageLink",
      PrevPageLink: (options) => {
        return (
          <Button
            type="button"
            className={classNames(options.className, "!rounded-lg")}
            onClick={options.onClick}
            disabled={options.disabled || loading}
          >
            <span className="p-3 text-black">{prev}</span>
          </Button>
        );
      },
      NextPageLink: (options) => {
        return (
          <Button
            className={classNames(options.className, "!rounded-lg")}
            onClick={options.onClick}
            disabled={options.disabled || loading}
          >
            <span className="p-3 text-black">{next}</span>
          </Button>
        );
      },
      PageLinks: (options) => {
        if (
          (options.view.startPage === options.page && options.view.startPage !== 0) ||
          (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
        ) {
          const className = classNames(options.className, { "p-disabled": true });

          return (
            <span className={className} style={{ userSelect: "none" }}>
              ...
            </span>
          );
        }

        return (
          <Button disabled={loading} className={options.className} onClick={options.onClick}>
            {options.page + 1}
          </Button>
        );
      },
    };
  };

  async function focusBtn(id: string) {
    const btn1 = document.getElementById("btn-1");
    const btn2 = document.getElementById("btn-2");
    const btn3 = document.getElementById("btn-3");
    switch (id) {
      case "btn-2":
        await getPqrsdf({ typeReques: 3 });
        btn2.style.color = "#533893";
        btn2.style.borderBottom = "solid 2px #533893";
        btn1.style.color = "#6C757D";
        btn1.style.borderBottom = "0";
        btn3.style.color = "#6C757D";
        btn3.style.borderBottom = "0";
        setStatusRequest(false);
        setShowTable(false);
        break;
      case "btn-3":
        await getResponses();
        btn3.style.color = "#533893";
        btn3.style.borderBottom = "solid 2px #533893";
        btn1.style.color = "#6C757D";
        btn1.style.borderBottom = "0";
        btn2.style.color = "#6C757D";
        btn2.style.borderBottom = "0";
        setStatusRequest(false);
        setShowTable(true);
        break;
      default:
        await getPqrsdf({ typeReques: 2 });
        btn1.style.color = "#533893";
        btn1.style.borderBottom = "solid 2px #533893";
        btn2.style.color = "#6C757D";
        btn2.style.borderBottom = "0";
        btn3.style.color = "#6C757D";
        btn3.style.borderBottom = "0";
        setShowTable(false);
        break;
    }
  }

  useEffect(() => {
    focusBtn("btn-1");
  }, []);

  return (
    <>
      <ConfirmDialog id="messages"></ConfirmDialog>
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
            <button className="btn-t btn-3" id="btn-3" onClick={async () => await focusBtn("btn-3")}>
              Respuestas a la solicitud
            </button>
          </div>
          {!showTable && (
            <Card className="card-container mt-10 card-bottom">
              <TableManagePqrsdfComponent
                statusReq={statusRequest}
                dataPqrsdf={pqrs}
                getPqrsdfClose={() => getPqrsdf({ typeReques: 3 })}
              />
            </Card>
          )}
          {showTable && (
            <div className="relative mt-10 z-0">
              <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
                <div className="p-card-body !py-6 !px-6 md:!px-11">
                  <div className="p-card-title flex justify-between flex-wrap sm:flex-nowrap space-y-7 sm:space-y-0 items-center">
                    <span className="text-xl sm:text-2xl">Respuestas</span>
                    <div className="flex text-sm flex-wrap sm:flex-nowrap items-center sm:justify-end gap-x-5 w-full">
                      <div className="flex items-center min-w-[150px] order-2 sm:order-1 mt-4 sm:mt-0 w-full sm:w-auto">
                        Total de resultados{" "}
                        <span className="ml-auto sm:ml-2 text-primary">{pqrsdfResponses.meta.total}</span>
                      </div>
                      <div className="flex items-center min-w-[210px] order-1 sm:order-2 w-full sm:w-auto">
                        Registro por página
                        <div className="ml-auto sm:ml-6">
                          <Dropdown
                            id="per_page"
                            value={pqrsdfResponses.meta?.per_page ?? 3}
                            className={"w-12 !font-sans select-xs"}
                            panelClassName="select-xs"
                            optionLabel="value"
                            options={[
                              { value: 1 },
                              { value: 3 },
                              { value: 5 },
                              { value: 10 },
                              { value: 15 },
                              { value: 20 },
                              { value: 30 },
                            ]}
                            optionValue="value"
                            onChange={(e) => {
                              setPerPage(e.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-card-content !pb-0 !pt-0 md:!pt-10 citizen-attention-paginator">
                    <div className="overflow-hidden mx-auto max-w-[calc(100vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] block borderless reverse-striped">
                      <DataTable
                        value={pqrsdfResponses?.array ?? []}
                        loading={loading}
                        showGridlines={false}
                        stripedRows={true}
                        emptyMessage={<span className="!font-sans">No se encontraron resultados</span>}
                        tableStyle={{ minWidth: "22.625rem", marginBottom: "6.063rem" }}
                      >
                        {columns().map((column) => {
                          return (
                            <Column
                              bodyClassName="text-base !font-sans !text-center min-w-[207px] w-[207px]"
                              headerClassName="text-base font-medium !text-black !text-center min-w-[207px] w-[207px] justify-center"
                              key={column.key}
                              header={column.name}
                              field={column?.field}
                              body={column?.body}
                            ></Column>
                          );
                        })}
                      </DataTable>
                    </div>
                    <Paginator
                      first={first}
                      rows={perPage}
                      pageLinkSize={7}
                      onPageChange={onPageChange}
                      template={paginatorTemplate()}
                      totalRecords={pqrsdfResponses?.meta?.total ?? 0}
                      className="mt-11"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default ManagePqrsdf;
