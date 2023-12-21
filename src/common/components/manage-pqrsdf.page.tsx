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

  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [pqrsdfResponses, setPqrsdfResponses] = useState<IPagingData<IPqrsdfResponse>>({
    array: [],
    meta: {
      total: 0,
    },
  });
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<number>(0);

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

  const onPageChange = (event: PaginatorPageChangeEvent): void => {
    setPerPage(event.rows);
    setFirst(event.first);
    setPage(event.page + 1);
  };

  const columns = () => {
    return [
      {
        name: "Fecha",
        key: "createdAt",
        body: (rowData: IPqrsdfResponse) => {
          return toLocaleDate(rowData.createdAt).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
        showForm: false,
      },
      {
        name: "Dependencia que responde",
        key: "respondingDependence",
        field: "respondingDependence.dep_descripcion",
        showForm: false,
      },
      {
        name: "Usuario que responde",
        key: "respondingUser",
        body: (rowData: IPqrsdfResponse) => {
          return rowData?.respondingUser?.names + " " + rowData?.respondingUser?.lastNames;
        },
        showForm: false,
      },
      {
        name: "Dependencia asignada",
        key: "assignedDependence",
        field: "assignedDependence.dep_descripcion",
        showForm: false,
      },
      {
        name: "Usuario asignado",
        key: "assignedUser",
        body: (rowData: IPqrsdfResponse) => {
          return rowData?.assignedUser?.names + " " + rowData?.assignedUser?.lastNames;
        },
        showForm: false,
      },
      {
        name: "Tipo de respuesta",
        key: "responseType",
        field: "responseType.description",
        showForm: false,
      },
      {
        name: "Repuesta",
        key: "observation",
        field: "observation",
        showForm: false,
      },
      {
        name: "Factor",
        key: "factor",
        field: "factor.name",
        showForm: false,
      },
      {
        name: "Estado",
        key: "status",
        field: "pqrsdf.status.lep_estado",
        showForm: false,
      },
      {
        name: "Días en bandeja",
        key: "days",
        body: (rowData: IPqrsdfResponse) => {
          const currentDate = new Date();
          let lastResponses = pqrsdfResponses.array.filter((response) => {
            return response.pqrsdfId == rowData.pqrsdfId && response.id < rowData.pqrsdfId;
          });
          let responseDate = lastResponses.length
            ? toLocaleDate(lastResponses[lastResponses.length - 1].createdAt)
            : toLocaleDate(rowData.createdAt);
          let differenceTime = currentDate.getTime() - responseDate.getTime();

          //calculate days difference by dividing total seconds in a day
          let days = Math.round(differenceTime / (1000 * 3600 * 24));
          return days;
        },
        showForm: false,
      },
      {
        name: "Acción",
        key: "name",
        body: (rowData: IPqrsdfResponse) => {
          return (
            <span className="flex">
              <Tooltip className="" target=".tooltip-see-attached-dt" />
              <a
                href={"editar/" + rowData?.id}
                className="hover:text-primary inline-flex sm:mr-auto sm:ml-auto ml:auto items-center justify-center tooltip-see-attached-dt "
                data-pr-tooltip="Ver adjunto"
                data-pr-position="right"
              >
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.293 10.7776L11.619 1.43897C12.009 1.08626 12.642 1.08626 13.032 1.43897L14.708 2.9547C15.098 3.30741 15.098 3.87988 14.708 4.23259L4.381 13.5703C4.194 13.7403 3.94 13.8353 3.675 13.8353H1V11.4161C1 11.1764 1.105 10.9467 1.293 10.7776Z"
                    stroke="#0CA529"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.75 3.12744L12.84 5.92197"
                    stroke="#0CA529"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </span>
          );
        },
        showForm: false,
      },
    ];
  };

  const getResponses = async () => {
    try {
      let payload: IPagination = {
        perPage: perPage,
        page: page,
      };
      const response = await pqrsdfService.getPqrsdfResponnses(payload);

      if (response.operation.code === EResponseCodes.OK) {
        setPqrsdfResponses(response.data);
      } else {
        setPqrsdfResponses({
          array: [],
          meta: {
            total: 0,
            per_page: perPage,
          },
        });
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Lo sentimos</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                {response.operation.message}
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          footer: (options) => acceptButton(options),
        });
      }
    } catch (error) {
      console.error("Error al obtener las respuestas de pqrsdf:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptButton = (options) => {
    return (
      <div className="flex items-center justify-center gap-2 pb-2">
        <Button
          label="Aceptar"
          rounded
          className="!px-4 !py-2 !text-base !mr-0"
          disabled={loading}
          loading={loading}
          onClick={(e) => {
            options.accept();
          }}
        />
      </div>
    );
  };

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

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
