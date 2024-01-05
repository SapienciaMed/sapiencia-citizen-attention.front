import { Button } from "primereact/button";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import React, { useEffect, useState } from "react";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook";
import { IPqrsdf, IPqrsdfResponse, IResponseFilters } from "../interfaces/pqrsdf.interfaces";
import { IPagingData } from "../utils/api-response";
import { splitUrl, toLocaleDate } from "../utils/helpers";
import { EResponseCodes } from "../constants/api.enum";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { classNames } from "primereact/utils";
import { Column } from "primereact/column";
import { pdfShowFile } from "../utils/file-functions";
import { showIcon } from "./icons/show";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import moment from "moment";
import { useDaysParametrizationService } from "../hooks/daysParametrizationService.hook";

interface Detail {
  detailDate?: string;
  dayTypeId?: number;
}

interface IProps {
  pqrsdfId: number;
  pqrsdf: IPqrsdf;
}

function PqrsdfResponsesTable({ pqrsdfId, pqrsdf }: IProps): React.JSX.Element {
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
  const [workingDays, setWorkingDays] = useState([]);
  const pqrsdfService = usePqrsdfService();
  const daysServices = useDaysParametrizationService();
  const onPageChange = (event: PaginatorPageChangeEvent): void => {
    setPerPage(event.rows);
    setFirst(event.first);
    setPage(event.page + 1);
  };

  useEffect(() => {
    getResponses();
    daysParametrization();
  }, []);

  useEffect(() => {
    getResponses();
  }, [perPage, page]);

  function countDaysCalendar(fechaInicial: moment.MomentInput) {
    const fechaInicialMoment = moment(fechaInicial, "YYYY-MM-DD");

    const fechaActualMoment = moment();

    const diasTranscurridos = fechaActualMoment.diff(fechaInicialMoment, "days");

    return diasTranscurridos;
  }

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

  const countDays = (initialDate: moment.MomentInput, holidays: string[]) => {
    let weekends = [];
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

  const daysParametrization = async () => {
    const { data } = await daysServices.getDaysParametrizations();

    const workingDays = [];

    const daysParametrization = data.map((values: IDaysParametrization) => {
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

    setWorkingDays(workingDays);
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
          return rowData?.respondingUser
            ? rowData?.respondingUser?.names + " " + rowData?.respondingUser?.lastNames
            : "";
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
          return rowData?.assignedUser ? rowData?.assignedUser?.names + " " + rowData?.assignedUser?.lastNames : "";
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
        body: (rowData: IPqrsdfResponse) => {
          return rowData?.factor?.name ?? "N/A";
        },
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
            ? lastResponses[lastResponses.length - 1].createdAt
            : rowData.createdAt;

          return pqrsdf?.requestSubject?.requestObject?.obs_tipo_dias === "Calendario"
            ? countDaysCalendar(responseDate)
            : countDays(responseDate, workingDays);
        },
        showForm: false,
      },
      {
        name: "Acción",
        key: "name",
        body: (rowData: IPqrsdfResponse) => {
          return (
            rowData?.fileId && (
              <span className="flex">
                <Tooltip className="" target=".tooltip-see-attached-dt" />
                <span
                  onClick={() => pdfShowFile(rowData?.file?.filePath, splitUrl(rowData?.file?.name).fileName)}
                  className="hover:text-primary inline-flex sm:mr-auto sm:ml-auto ml:auto items-center justify-center tooltip-see-attached-dt cursor-pointer "
                  data-pr-tooltip="Ver adjunto"
                  data-pr-position="right"
                >
                  {showIcon}
                </span>
              </span>
            )
          );
        },
        showForm: false,
      },
    ];
  };

  const getResponses = async () => {
    try {
      let payload: IResponseFilters = {
        perPage: perPage,
        page: page,
        pqrsdfId: pqrsdfId,
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

  const paginatorTemplate = (prev = "Anterior", next = "Siguiente") => {
    return {
      layout: "PrevPageLink PageLinks NextPageLink",
      PrevPageLink: (options) => {
        return (
          <Button
            type="button"
            className={classNames(options.className, "!rounded-lg")}
            onClick={options.onClick}
            loading={loading}
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
            loading={loading}
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
          <Button disabled={loading} loading={loading} className={options.className} onClick={options.onClick}>
            {options.page + 1}
          </Button>
        );
      },
    };
  };

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );
  return (
    <div className="relative pb-16 md:pb-28 z-0">
      <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-between flex-wrap sm:flex-nowrap space-y-7 sm:space-y-0 items-center">
            <span className="text-xl md:text-2xl">Respuestas</span>
            <div className="flex text-sm flex-wrap sm:flex-nowrap items-center sm:justify-end gap-x-5 w-full">
              <div className="flex items-center min-w-[150px] order-2 sm:order-1 mt-4 sm:mt-0 w-full sm:w-auto">
                Total de resultados <span className="ml-auto sm:ml-2 text-primary">{pqrsdfResponses.meta.total}</span>
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
          <div className="p-card-content !pb-0 !pt-0 md:!pt-10 citizen-attention-paginator relative">
            <div className="overflow-hidden mx-auto max-w-[calc(100vw-10.1rem)] md:max-w-[calc(100vw-16.1rem)] lg:max-w-[calc(100vw-33.7rem)] block borderless reverse-striped">
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
  );
}

export default PqrsdfResponsesTable;
