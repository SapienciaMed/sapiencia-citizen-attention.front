import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import React, { useEffect, useRef, useState } from "react";
import { EResponseCodes } from "../constants/api.enum";
import { useDaysParametrizationService } from "../hooks/daysParametrizationService.hook";
import { IDayType } from "../interfaces/dayType.interfaces";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import { IDaysParametrizationDetail } from "../interfaces/daysParametrizationDetail.interfaces";
import { Paginator } from "primereact/paginator";
import { classNames } from "primereact/utils";

function CalendarPage(): React.JSX.Element {
  const toast = useRef(null);
  const [selectedYear, setSelectedYear] = useState<IDaysParametrization | undefined>(undefined);
  const [monthList, setMonthList] = useState(false);
  const [dayTypes, setDayTypes] = useState<IDayType[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const [years, setYears] = useState<IDaysParametrization[]>([]);
  const [days, setDays] = useState<IDaysParametrizationDetail[]>([]);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [calendarPage, setCalendarPage] = useState(0);
  const daysParametrizationService = useDaysParametrizationService();
  // const [loading, setLoading] = useState(false);

  const accept = async () => {
    if (year?.toString()?.length == 4 && year > 2000) {
      if (years.filter((currentYear) => currentYear.year == year).length) {
        toast.current.show({
          severity: "error",
          summary: "Lo sentimos!",
          detail: "El año ya existe en el calendario, por favor verifique.",
          life: 3000,
        });
      } else {
        // setLoading(true);
        try {
          const response = await daysParametrizationService.createDaysParametrization(year);

          if (response.operation.code === EResponseCodes.OK) {
            let newYears = [...years, response.data].sort((a, b) => b.year - a.year);

            setYears(newYears);
            setYear(null);
            toast.current.show({
              severity: "success",
              summary: "Proceso exitoso!",
              detail: "Año creado con éxito.",
              life: 3000,
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
      toast.current.show({
        severity: "warn",
        summary: "Completa el formulario",
        detail: "Debes ingresar un año válido.",
        life: 3000,
      });
    }
  };

  const addDates = (value) => {
    const newDates: Date[] = value;
    setDates([...newDates]);
    const nextDays = [...days];
    newDates.forEach((date) => {
      if (nextDays.filter((day) => day.detailDate == date).length == 0) {
        nextDays.push({
          detailDate: date,
          description: "",
          dayTypeId: null,
        });
      }
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
    <div className="flex items-center justify-center gap-2">
      <Button
        text
        rounded
        severity="secondary"
        className="!px-4 !text-base"
        label="Cancelar"
        onClick={() => setVisibleConfirm(false)}
      />
      <Button label="Aceptar" rounded className="!px-4 !text-base" onClick={accept} disabled={year < 2000} />
    </div>
  );

  useEffect(() => {
    const fetchYears = async () => {
      // setLoading(true);
      try {
        const response = await daysParametrizationService.getDaysParametrizations();

        if (response.operation.code === EResponseCodes.OK) {
          setYears(response.data);
          const selected = response.data.filter((year) => year.year === new Date().getFullYear())[0];
          setSelectedYear(selected);
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
  }, []);

  const handleYearChange = (e) => {
    const selected = years.filter((year) => year.id === e.value)[0];
    setSelectedYear(selected);
    setMonthList(false);
    setCalendarPage(0);
  };  

  useEffect(() => {
    async function initialSearch() {
      if (selectedYear?.id) {
        await handleSearch();
      }
    }
    initialSearch();
  }, [selectedYear]);

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
    if (field == "dayTypeId") {
      rowData[field] = newRowData.dayTypeId;
    } else {
      rowData[field] = newValue;
    }
  };

  const cellEditor = (options) => {
    if (options.field === "dayTypeId") return selectEditor(options);
    else return textEditor(options);
  };

  const textEditor = (options) => {
    return <InputTextarea value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const selectEditor = (options) => {
    return (
      <div className="relative">
        <select
          className="appearance-none relative z-10 bg-transparent outline-primary max-w-[115px] p-2 h-10"
          onChange={(e) => options.editorCallback(e.target.value)}
        >
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
    return rowData.detailDate
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace("/", ".");
  };

  const dayTypeBodyTemplate = (rowData) => {
    return (
      <div className="relative">
        <span className="relative z-10 p-2 h-10 max-w-[115px]">
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

  const renderCalendars = () => {
    const calendars = [[], []];
    for (let index = 1; index < 13; index++) {
      let date = new Date(`${selectedYear.year}/${index > 9 ? index : "0" + index}/01`);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      calendars[index <= 6 ? 0 : 1].push(
        <div key={index > 9 ? index : "0" + index}>
          <Calendar
            value={dates}
            onChange={(e) => {
              addDates(e.value);
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

    const template1 = {
      layout: 'PrevPageLink PageLinks NextPageLink',
      PrevPageLink: (options) => {
          return (
              <Button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                  <span className="p-3">Previous</span>                  
              </Button>
          );
      },
      NextPageLink: (options) => {
          return (
              <Button className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                  <span className="p-3">Next</span>                  
              </Button>
          );
      },
      PageLinks: (options) => {
          if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
              const className = classNames(options.className, { 'p-disabled': true });

              return (
                  <span className={className} style={{ userSelect: 'none' }}>
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

    return (
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 no-month-navigator gap-x-6 gap-y-14 pt-5">
        {calendars[calendarPage]}
        <div className="col-span-full">
          <Paginator template={template1} first={calendarPage} rows={1} totalRecords={2} onPageChange={(e) => setCalendarPage(e.first)} />
        </div>
      </div>
    );
  };
  return (
    <div className="p-6 max-w-[2400px] mx-auto">
      <Toast ref={toast} position="bottom-right" />

      <ConfirmDialog
        className="rounded-2xl"
        headerClassName="rounded-t-2xl"
        contentClassName="w-[640px] max-w-full p-8 items-center justify-center"
        message={
          <div className="flex flex-wrap w-full items-center justify-center">
            <div className="mx-auto text-primary text-3xl w-full text-center">Crear año</div>

            <div className="flex items-center justify-center">
              <label htmlFor="year" className="text-[22px] block mr-4">
                Año
              </label>
              <InputNumber
                inputId="year"
                useGrouping={false}
                value={year}
                // onValueChange={(e) => setYear(e.value)}
                onChange={(e) => setYear(e.value)}
                maxLength={4}
              />
            </div>
          </div>
        }
        visible={visibleConfirm}
        onHide={() => setVisibleConfirm(false)}
        footer={confirmDialogFooter}
        closeIcon={closeIcon}
        resizable={false}
        draggable={false}
      ></ConfirmDialog>
      {/* Calendar year filter */}
      <div className="p-card rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body py-8 px-6">
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
                  placeholder="Selecciona un año"
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
        <div className="p-card rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
          <div className="p-card-body py-8 px-6">
            <div className="p-card-title flex justify-between">
              <span className="text-3xl">Meses</span>
            </div>
            <div className="p-card-content">
              <div className="grid grid-cols-3">
                {renderCalendars()}
                <div className="col-span-1">
                  <label className="text-base">Días hábiles y no hábiles</label>
                  <div className="p-card shadow-none border border-[#D9D9D9]">
                    <div className="p-card-body">
                      <DataTable
                        size="small"
                        value={days}
                        editMode="cell"
                        showGridlines
                        tableStyle={{ minWidth: "22.625rem" }}
                      >
                        <Column
                          className="text-sm font-normal"
                          key="detailDate"
                          field="detailDate"
                          header="Fecha"
                          dataType="date"
                          body={dateBodyTemplate}
                        ></Column>
                        <Column
                          className="!p-0 text-sm font-normal max-w-[115px] w-[115px]"
                          key="dayTypeId"
                          field="dayTypeId"
                          header="Tipo"
                          body={dayTypeBodyTemplate}
                          editor={(options) => cellEditor(options)}
                          onCellEditComplete={onCellEditComplete}
                        ></Column>
                        <Column
                          className="text-sm font-normal"
                          key="description"
                          field="description"
                          header="Descripción"
                          // body={descrptionTemplate}
                          editor={(options) => cellEditor(options)}
                          onCellEditComplete={onCellEditComplete}
                        ></Column>
                      </DataTable>
                    </div>
                  </div>
                  <div className="mt-16 pt-1 px-14">
                    <div className="flex gap-6">
                      <div className="relative h-10 w-10 border border-[#D9D9D9]"></div>
                      <span className="text-sm">Día hábil</span>
                    </div>
                    <div className="flex gap-6 mt-8 pt-0.5">
                      <div className="relative h-10 w-10 border border-[#D9D9D9] bg-primary opacity-25 rounded-full"></div>
                      <span className="text-sm">Día no hábil</span>
                    </div>
                    <div className="mt-10 text-sm">
                      <p>Opciones columna “Tipo”</p>
                      <p className="font-medium mt-3.5">
                        No laboral PR : <span className="font-normal">No laboral por resolución</span>
                      </p>
                      <p className="font- mt-2">
                        No laboral PF : <span className="font-normal">No laboral por festivo</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
