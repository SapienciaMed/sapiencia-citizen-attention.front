import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Calendar, CalendarChangeEvent, CalendarDateTemplateEvent } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { EResponseCodes } from "../constants/api.enum";
import { useDaysParametrizationService } from "../hooks/daysParametrizationService.hook";
import { IDayType } from "../interfaces/dayType.interfaces";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import { IDaysParametrizationDetail } from "../interfaces/daysParametrizationDetail.interfaces";

function CalendarPage(): React.JSX.Element {
  const toast = useRef(null);
  const parentForm = useRef(null);
  const messages = useRef(null);
  const [selectedYear, setSelectedYear] = useState<IDaysParametrization | undefined>(undefined);
  const [monthList, setMonthList] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });
  const [filters, setFilters] = useState({
    detailDate: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [detailDateFilterValue, setDetailDateFilterValue] = useState("");
  const [dayTypes, setDayTypes] = useState<IDayType[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);
  const [years, setYears] = useState<IDaysParametrization[]>([]);
  const [days, setDays] = useState<IDaysParametrizationDetail[]>([]);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [calendarPage, setCalendarPage] = useState(0);
  const daysParametrizationService = useDaysParametrizationService();
  // const [loading, setLoading] = useState(false);

  const save = async () => {
    try {
      let newYear = { ...selectedYear };
      newYear.daysParametrizationDetails = [...days];
      newYear.daysParametrizationDetails = newYear.daysParametrizationDetails.map((detail) => {
        let d = detail.detailDate;
        let day = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
        let month = d.getMonth() + 1;
        month = month > 9 ? month : "0" + month;
        detail.detailDate = [d.getFullYear(), month, day].join("-") + " 00:00:00";
        delete detail.dayType;
        delete detail.createdAt;
        delete detail.updatedAt;
        return detail;
      });
      const response = await daysParametrizationService.updateDayParametrization(newYear);

      if (response.operation.code === EResponseCodes.OK) {
        setVisibleConfirm(false);
        confirmDialog({
          id: "messages",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Proceso exitoso</div>
              <div className="flex items-center justify-center w-full mt-6 pt-0.5">Calendario modificado con éxito</div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          accept: () => setVisibleConfirm(false),
          footer: (options) => (
            <div className="flex items-center justify-center gap-2 pb-2">
              <Button
                label="Aceptar"
                rounded
                className="!px-4 !py-2 !text-base"
                onClick={(e) => {
                  options.accept();
                }}
              />
            </div>
          ),
        });
        let newYears = [...years];

        newYears = newYears.map((year) => {
          if (year.year == response.data.year) {
            year = response.data;
          }
          return year;
        });
        console.log(newYears);

        setYears(newYears);
        setSelectedYear(response.data);
        // resetForm();
        setInitialData(response.data);
      }
    } catch (error) {
      console.error("Error al modificar el calendario:", error);
    } finally {
      setVisibleConfirm(false);
      // setLoading(false);
    }
  };

  const accept = async () => {
    if (year?.toString()?.length == 4 && year > 2000) {
      if (years.filter((currentYear) => currentYear.year == year).length) {
        setVisibleConfirm(false);
        confirmDialog({
          id: "messages",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Año existente</div>

              <div className="flex items-center justify-center w-full mt-6 pt-0.5">
                El año ya existe en el calendario, por favor verifique
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          accept: () => setVisibleConfirm(true),
          footer: (options) => (
            <div className="flex items-center justify-center gap-2 pb-2">
              <Button
                label="Aceptar"
                rounded
                className="!px-4 !py-2 !text-base"
                onClick={(e) => {
                  options.accept();
                }}
              />
            </div>
          ),
        });
      } else {
        // setLoading(true);
        try {
          const response = await daysParametrizationService.createDaysParametrization(year);

          if (response.operation.code === EResponseCodes.OK) {
            let newYears = [...years, response.data].sort((a, b) => b.year - a.year);

            setYears(newYears);
            setYear(null);
            setVisibleConfirm(false);
            confirmDialog({
              id: "messages",
              message: (
                <div className="flex flex-wrap w-full items-center justify-center">
                  <div className="mx-auto text-primary text-3xl w-full text-center">Año creado exitosamente</div>

                  <div className="flex items-center justify-center w-full mt-6 pt-0.5">
                    El año se ha creado de manera exitosa
                  </div>
                </div>
              ),
              closeIcon: closeIcon,
              acceptLabel: "Aceptar",
              accept: () => setVisibleConfirm(false),
              footer: (options) => (
                <div className="flex items-center justify-center gap-2 pb-2">
                  <Button
                    label="Aceptar"
                    rounded
                    className="!px-4 !py-2 !text-base"
                    onClick={(e) => {
                      options.accept();
                    }}
                  />
                </div>
              ),
            });
          }
        } catch (error) {
          console.error("Error al obtener la lista de años:", error);
        } finally {
          setVisibleConfirm(false);
          // setLoading(false);
        }
      }
    } else {
      setYearError("Debes ingresar un año válido.");
    }
  };

  const onDetailDateFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["detailDate"].value = value;

    setFilters(_filters);
    setDetailDateFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div>
        <span className="p-input-icon-right">
          <Calendar
            showButtonBar
            inputClassName="!text-sm !py-0.5 !font-sans !rounded !w-40"
            value={detailDateFilterValue}
            onChange={onDetailDateFilterChange}
            readOnlyInput
            placeholder="DD / MM / AAA"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.6667 1.3335V4.00016M5.33333 1.3335V4.00016M2 6.00016H14M12.6667 2.66683H3.33333C2.59667 2.66683 2 3.2635 2 4.00016V12.6668C2 13.4035 2.59667 14.0002 3.33333 14.0002H12.6667C13.4033 14.0002 14 13.4035 14 12.6668V4.00016C14 3.2635 13.4033 2.66683 12.6667 2.66683ZM4.67533 8.48616C4.58333 8.48616 4.50867 8.56083 4.50933 8.65283C4.50933 8.74483 4.584 8.8195 4.676 8.8195C4.768 8.8195 4.84267 8.74483 4.84267 8.65283C4.84267 8.56083 4.768 8.48616 4.67533 8.48616ZM8.00867 8.48616C7.91667 8.48616 7.842 8.56083 7.84267 8.65283C7.84267 8.74483 7.91733 8.8195 8.00933 8.8195C8.10133 8.8195 8.176 8.74483 8.176 8.65283C8.176 8.56083 8.10133 8.48616 8.00867 8.48616ZM11.342 8.48616C11.25 8.48616 11.1753 8.56083 11.176 8.65283C11.176 8.74483 11.2507 8.8195 11.3427 8.8195C11.4347 8.8195 11.5093 8.74483 11.5093 8.65283C11.5093 8.56083 11.4347 8.48616 11.342 8.48616ZM4.67533 11.1528C4.58333 11.1528 4.50867 11.2275 4.50933 11.3195C4.50933 11.4115 4.584 11.4862 4.676 11.4862C4.768 11.4862 4.84267 11.4115 4.84267 11.3195C4.84267 11.2275 4.768 11.1528 4.67533 11.1528ZM8.00867 11.1528C7.91667 11.1528 7.842 11.2275 7.84267 11.3195C7.84267 11.4115 7.91733 11.4862 8.00933 11.4862C8.10133 11.4862 8.176 11.4115 8.176 11.3195C8.176 11.2275 8.10133 11.1528 8.00867 11.1528Z"
              stroke="#533893"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  };

  const addDates = (e: CalendarChangeEvent) => {
    const newDates: Date[] = e.value as Date[];

    const weekend = e.originalEvent.currentTarget.children[0];
    setTimeout(() => {
      if (weekend?.classList?.contains("weekend")) {
        if (
          newDates.filter((date) => date.toString() == weekend.attributes.getNamedItem("data-date").value).length > 0
        ) {
          weekend.parentElement.classList.remove("p-highlight");
        } else {
          weekend.parentElement.classList.add("p-highlight");
        }
      }
    }, 10);

    let nextDays = [...days];
    setDates([...newDates]);

    newDates.forEach((date) => {
      if (nextDays.filter((day) => new Date(day.detailDate).toDateString() == date.toDateString()).length == 0) {
        nextDays.push({
          detailDate: date,
          description: "",
          dayTypeId: null,
        });
      }
    });

    nextDays = nextDays.filter((day) => {
      return newDates.filter((date) => new Date(day.detailDate).toDateString() == date.toDateString()).length;
    });

    setDays(nextDays);
  };

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );
  const confirmDialogFooter = () => (
    <div className="flex items-center justify-center gap-2 pb-2">
      <Button
        text
        rounded
        severity="secondary"
        className="!px-4 !py-2 !text-base !text-black"
        label="Cancelar"
        onClick={() => {
          setVisibleConfirm(false);
          setYear(null);
        }}
      />
      <Button label="Agregar" rounded className="!px-4 !py-2 !text-base" onClick={accept} disabled={year < 2000} />
    </div>
  );

  const handleResize = () => {
    if (parentForm.current?.offsetWidth) {
      let style = getComputedStyle(parentForm.current);
      let domReact = parentForm.current.getBoundingClientRect()
      console.log(domReact);
      
      setButtonWidth({
        width: parentForm?.current.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight),
        left: domReact.x-parseInt(style.marginLeft)
      });
    }
  };

  useEffect(() => {
    const fetchYears = async () => {
      // setLoading(true);
      try {
        const response = await daysParametrizationService.getDaysParametrizations();

        if (response.operation.code === EResponseCodes.OK) {
          setYears(response.data);
          const selected = response.data.filter((year) => year.year === new Date().getFullYear())[0];
          setSelectedYear(selected);
          setInitialData(selected);
          // handleSearch()
        }
      } catch (error) {
        console.error("Error al obtener la lista de años:", error);
      } finally {
        // setLoading(false);
      }
    };
    const fetchDayTypes = async () => {
      // setLoading(true);
      try {
        const response = await daysParametrizationService.getDayTypes();

        if (response.operation.code === EResponseCodes.OK) {
          setDayTypes(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista de tipos de días:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchDayTypes();
    fetchYears();
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const setInitialData = (selected: IDaysParametrization, asDate = true) => {
    if (selected.daysParametrizationDetails.length > 0) {
      console.log(
        selected.daysParametrizationDetails.map((detail: IDaysParametrizationDetail) => {
          return asDate ? new Date(detail.detailDate) : detail.detailDate;
        })
      );

      setDates(
        selected.daysParametrizationDetails.map((detail: IDaysParametrizationDetail) => {
          return asDate ? new Date(detail.detailDate) : detail.detailDate;
        })
      );
      setDays(
        selected.daysParametrizationDetails.map((detail: IDaysParametrizationDetail) => {
          detail.detailDate = asDate ? new Date(detail.detailDate) : detail.detailDate;
          return detail;
        })
      );
    }
  };

  const handleYearChange = (e) => {
    const selected = years.filter((year) => year.id === e.value)[0];
    setSelectedYear(selected);
    resetForm();
  };

  const resetForm = (showOtherMonths = true) => {
    let _filters = { ...filters };
    _filters["detailDate"].value = null;
    setDetailDateFilterValue("");
    setFilters(_filters);
    setMonthList(false);
    if (showOtherMonths) {
      setTimeout(() => {
        setMonthList(true);
      }, 1);
    }
    setCalendarPage(0);
    setDates([]);
    setDays([]);
  };

  useEffect(() => {
    async function initialSearch() {
      if (selectedYear?.id) {
        await handleSearch();
      }
    }
    initialSearch();
  }, [selectedYear]);

  useEffect(() => {
    async function addWeekend() {
      setTimeout(() => {
        document.querySelectorAll(".weekend").forEach((el) => {
          if (dates.filter((date) => date.toString() == el.attributes.getNamedItem("data-date").value).length > 0) {
            el.parentElement.classList.remove("p-highlight");
          } else {
            el.parentElement.classList.add("p-highlight");
          }
        });
      }, 10);
    }
    addWeekend();
    setTimeout(() => {
      handleResize();
    }, 100);
  }, [monthList, calendarPage]);

  const handleSearch = async () => {
    // Lógica de búsqueda con el año seleccionado
    if (selectedYear?.id) {
      setMonthList(true);
      console.log(`Realizar búsqueda para el año ${selectedYear.year}`);
    } else {
      setMonthList(false);
      alert("Selecciona un año antes de buscar.");
    }
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, newRowData, field, originalEvent: event } = e;
    let _days = [...days];
    if (field == "dayTypeId") {
      rowData[field] = newValue;
      _days.find((day) => day.detailDate === rowData.detailDate).dayTypeId = newValue;
    } else {
      rowData[field] = newValue;
      _days.find((day) => day.detailDate === rowData.detailDate).description = newValue;
    }
    setDays(_days);
  };

  const cellEditor = (options) => {
    if (options.field === "dayTypeId") return selectEditor(options);
    else return textEditor(options);
  };

  const textEditor = (options) => {
    return (
      <InputTextarea
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        className="max-w-[148px] h-[35px] -mb-[5px] appearance-none relative z-10 bg-transparent outline-primary border-0 !p-2"
      />
    );
  };

  const selectEditor = (options) => {
    return (
      <div className="relative">
        <select
          className="appearance-none relative -mb-0.5 z-10 bg-transparent outline-primary max-w-[115px] p-2 h-[35px]"
          onChange={(e) => options.editorCallback(e.target.value)}
        >
          <option value={null}>Seleccione</option>
          {dayTypes.map((dayType, index) => {
            return (
              <option key={index} selected={dayType.tdi_codigo == options.value} value={dayType.tdi_codigo}>
                {dayType.tdi_descripcion_corta}
              </option>
            );
          })}
        </select>
        <svg
          className="absolute right-1 z-0 -translate-y-1/2 top-1/2"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.33569 7.16785L8.00069 9.83282L10.6657 7.16785"
            stroke="#533893"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    let date = typeof rowData?.detailDate == "string" ? new Date(rowData?.detailDate) : rowData?.detailDate;
    return date?.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const dayTypeBodyTemplate = (rowData) => {
    return (
      <div className="relative">
        <span className="relative p-2 h-10 max-w-[115px] w-[115px]">
          {dayTypes.filter((type) => type.tdi_codigo == rowData.dayTypeId)[0]?.tdi_descripcion_corta}
        </span>
        <svg
          className="absolute right-1 z-0 -translate-y-1/2 top-1/2"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.33569 7.16785L8.00069 9.83282L10.6657 7.16785"
            stroke="#533893"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  };

  const dateTemplate = (dateTemplate: CalendarDateTemplateEvent) => {
    const month = dateTemplate.month + 1;
    if (dateTemplate.otherMonth) {
      return dateTemplate.day;
    } else {
      const date = new Date(
        `${dateTemplate.year}/${month > 9 ? month : "0" + month}/${
          dateTemplate.day > 9 ? dateTemplate.day : "0" + dateTemplate.day
        }`
      );

      return date.getDay() == 6 || date.getDay() == 0 ? (
        <div className="weekend" data-date={date}>
          {dateTemplate.day}
        </div>
      ) : (
        dateTemplate.day
      );
    }
  };

  const paginatorTemplate = (prev = "Anterior", next = "Siguiente") => {
    return {
      layout: "PrevPageLink PageLinks NextPageLink",
      PrevPageLink: (options) => {
        return (
          <Button
            type="button"
            className={classNames(options.className, "border-round")}
            onClick={options.onClick}
            disabled={options.disabled}
          >
            <span className="p-3 text-black">{prev}</span>
          </Button>
        );
      },
      NextPageLink: (options) => {
        return (
          <Button
            className={classNames(options.className, "border-round")}
            onClick={options.onClick}
            disabled={options.disabled}
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
          <Button className={options.className} onClick={options.onClick}>
            {options.page + 1}
          </Button>
        );
      },
    };
  };

  const validateYear = (value) => {
    if (value?.toString().length == 0) {
      setYearError("El campo es obligatorio.");
    } else {
      if (value?.toString().length < 4) {
        setYearError("Debe tener 4 caracteres.");
      } else {
        setYearError(null);
      }
    }
  };

  const renderCalendars = () => {
    const calendars = [[], []];
    if (selectedYear?.id) {
      for (let index = 1; index < 13; index++) {
        let date = new Date(`${selectedYear.year}/${index > 9 ? index : "0" + index}/01`);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        calendars[index <= 6 ? 0 : 1].push(
          <div key={index > 9 ? index : "0" + index}>
            <Calendar
              className="md:min-w-[288pxx]"
              dateTemplate={(e) => dateTemplate(e)}
              value={dates}
              onChange={(e) => {
                addDates(e);
              }}
              inline
              // showWeek
              selectionMode="multiple"
              nextIcon={false}
              prevIcon={false}
              minDate={date}
              maxDate={lastDay}
              viewDate={date}
              monthNavigator={false}
              showOtherMonths={true}
              selectOtherMonths={false}
            />
          </div>
        );
      }
    }
    return (
      <div className="flex flex-wrap justify-between overflow-x-auto no-month-navigator gap-x-6 gap-y-14 pt-5 md:w-1/2 xl:w-[62%] md:pr-6 w-full">
        {calendars[calendarPage]}
        <div className="w-full">
          <Paginator
            className="!pb-0"
            template={paginatorTemplate()}
            first={calendarPage}
            rows={1}
            totalRecords={2}
            onPageChange={(e) => setCalendarPage(e.first)}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <Toast ref={toast} position="bottom-right" />
      <ConfirmDialog id="messages"></ConfirmDialog>
      <ConfirmDialog
        className="rounded-2xl"
        headerClassName="rounded-t-2xl"
        contentClassName="md:w-[640px] max-w-full p-8 items-center justify-center"
        message={
          <div className="flex flex-wrap w-full items-center justify-center">
            <div className="mx-auto text-primary text-3xl w-full text-center">Crear año</div>

            <div className="flex items-center justify-center w-full mt-6 pt-0.5">
              <label htmlFor="year" className="text-[22px] block mr-4">
                Año
              </label>
              <InputText
                keyfilter="int"
                inputMode="tel"
                onBlur={(e) => validateYear(e.target.value)}
                className={yearError ? "p-invalid w-[76px] py-2" : "w-[76px] py-2"}
                value={year ? year?.toString() : null}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                maxLength={4}
              />
            </div>
            {yearError && <small className="text-red-600 mt-1">{yearError}</small>}
          </div>
        }
        visible={visibleConfirm}
        onHide={() => {
          setVisibleConfirm(false);
          setYear(null);
        }}
        footer={confirmDialogFooter}
        closeIcon={closeIcon}
        resizable={false}
        draggable={false}
      ></ConfirmDialog>
      {/* Calendar year filter */}
      <div className="p-card rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-8 !px-6">
          <div className="p-card-title flex justify-between">
            <span className="text-3xl">Resumen año {selectedYear?.year}</span>
            <div
              className="my-auto text-base text-main flex items-center gap-x-2 cursor-pointer"
              onClick={() => setVisibleConfirm(true)}
            >
              <span>Crear año</span>
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.00008 5.83331V11.1666"
                  stroke="#533893"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.6666 8.50002H5.33325"
                  stroke="#533893"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z"
                  stroke="#533893"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="p-card-content">
            <div className="flex gap-x-6">
              <div className="flex flex-col gap-y-1.5 max-w-2xs">
                <label htmlFor="yearDropdown" className="text-base">
                  Selecciona el año:
                </label>
                <Dropdown
                  id="yearDropdown"
                  name="yearDropdown"
                  optionLabel="year"
                  options={years}
                  optionValue="id"
                  value={selectedYear?.id}
                  onChange={handleYearChange}
                  placeholder="Seleccionar"
                />
              </div>
              {/* <div className="mt-auto mb-0">
                <Button
                  disabled={!selectedYear}
                  rounded
                  label="Buscar"
                  className="!px-10 !text-sm"
                  onClick={handleSearch}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar months */}
      {monthList && (
        <div className="relative pb-36">
          <div className="relative z-10 p-card rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
            <div className="p-card-body !py-8 !px-6">
              <div className="p-card-title flex justify-between">
                <span className="text-3xl">Meses</span>
              </div>
              <div className="p-card-content !pb-0">
                <div className="flex flex-wrap w-full">
                  {renderCalendars()}
                  <div className="md:w-1/2 xl:w-[38%] w-full relative">
                    <label className="text-base">Días hábiles y no hábiles</label>
                    <div className="p-card shadow-none border border-[#D9D9D9]">
                      <div className="p-card-body day-parametrization">
                        {selectedYear?.id && (
                          <div className="overflow-auto max-w-[calc(100vw-10.1rem)]">
                            <DataTable
                              paginator
                              paginatorTemplate={paginatorTemplate("<", ">")}
                              rows={15}
                              filters={filters}
                              size="small"
                              value={days}
                              editMode="cell"
                              showGridlines
                              tableStyle={{ minWidth: "22.625rem" }}
                              globalFilterFields={["detailDate"]}
                              header={renderHeader}
                            >
                              <Column
                                bodyClassName="text-sm font-normal"
                                headerClassName="text-base font-medium"
                                key="detailDate"
                                field="detailDate"
                                header="Fecha"
                                dataType="date"
                                body={dateBodyTemplate}
                              ></Column>
                              <Column
                                bodyClassName="!p-0 text-sm font-normal sm:max-w-[115px] sm:w-[115px] sm:min-w-[115px]"
                                headerClassName="text-base font-medium"
                                key="dayTypeId"
                                field="dayTypeId"
                                header={
                                  <span>
                                    Tipo <span className="text-red-600">*</span>
                                  </span>
                                }
                                body={dayTypeBodyTemplate}
                                editor={(options) => cellEditor(options)}
                                onCellEditComplete={onCellEditComplete}
                              ></Column>
                              <Column
                                bodyClassName="!p-0 text-sm font-normal sm:max-w-[148px] sm:w-[148px] sm:min-w-[148px]"
                                headerClassName="text-base font-medium"
                                key="description"
                                field="description"
                                header="Descripción"
                                body={(rowData) => (
                                  <div className="relative">
                                    <span className="relative z-10 p-2 h-10 max-w-[148px] w-[148px]">
                                      {rowData.description}
                                    </span>
                                  </div>
                                )}
                                // body={descrptionTemplate}
                                editor={(options) => cellEditor(options)}
                                onCellEditComplete={onCellEditComplete}
                              ></Column>
                            </DataTable>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-16 pt-1 px-14">
                      <div className="flex items-center gap-6">
                        <div className="relative h-10 w-10 border border-[#D9D9D9]"></div>
                        <span className="text-sm">Día hábil</span>
                      </div>
                      <div className="flex items-center gap-6 mt-8 pt-0.5">
                        <div className="relative h-10 w-10 border border-[#D9D9D9] bg-primary opacity-25 rounded-full"></div>
                        <span className="text-sm">Día no hábil</span>
                      </div>
                      <div className="mt-10 text-sm">
                        <p>Opciones columna “Tipo”</p>
                        <p className="font-medium mt-3.5">
                          No laboral PR : <span className="font-normal !font-sans">No laboral por resolución</span>
                        </p>
                        <p className="font- mt-2">
                          No laboral PF : <span className="font-normal !font-sans">No laboral por festivo</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="fixed z-30 p-card rounded-none shadow-none border-t border-[#D9D9D9] w-full"
            style={{ top: "calc(100vh - 91px)", width: buttonWidth.width, left: buttonWidth.left  }}
          >
            <div className="p-card-body !py-6 !px-10 flex gap-x-7 justify-end max-w-[1200px] mx-auto">
              <Button
                text
                rounded
                severity="secondary"
                className="!px-8 !py-2 !text-base !text-black !border !border-primary"
                label="Cancelar"
                onClick={() => {
                  resetForm();
                  setInitialData(selectedYear);
                }}
              />
              <Button
                label="Guardar"
                rounded
                className="!px-8 !py-2 !text-base"
                onClick={save}
                disabled={days.filter((day) => day.dayTypeId == null).length > 0 || days.length <= 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
