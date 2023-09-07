import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { useDaysParametrizationService } from "../hooks/daysParametrizationService.hook";
import { EResponseCodes } from "../constants/api.enum";
import { IDaysParametrization } from "../interfaces/daysParametrization.interfaces";
import { IDaysParametrizationDetail } from "../interfaces/daysParametrizationDetail.interfaces";
import { InputTextarea } from "primereact/inputtextarea";
import { IDayType } from "../interfaces/dayType.interfaces";

function CalendarPage(): React.JSX.Element {
  const [selectedYear, setSelectedYear] = useState<IDaysParametrization | undefined>(undefined);
  const [monthList, setMonthList] = useState(false);
  const [dayTypes, setDayTypes] = useState<IDayType[]>([]);
  const [years, setYears] = useState<IDaysParametrization[]>([]);
  const [days, setDays] = useState<IDaysParametrizationDetail[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const daysParametrizationService = useDaysParametrizationService();
  // const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchYears = async () => {
      // setLoading(true);
      try {
        const response = await daysParametrizationService.getDaysParametrizations();

        if (response.operation.code === EResponseCodes.OK) {
          setYears(response.data);
          const selected = response.data.filter((year) => year.year === new Date().getFullYear())[0];
          setSelectedYear(selected);
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
  };

  const handledayTypeChange = (e: DropdownChangeEvent, options: any) => {
    console.log(e, options);

    const selected = dayTypes.filter((type) => type.tdi_codigo === e.value)[0];
    options.editorCallback(e.target.value);
  };

  const handleSearch = async () => {
    // Lógica de búsqueda con el año seleccionado
    if (selectedYear?.id) {
      setMonthList(true);
      console.log(`Realizar búsqueda para el año ${selectedYear}`);
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
      <select onChange={(e) => options.editorCallback(e.target.value)}>
        {dayTypes.map((dayType) => {
          return <option selected={dayType.tdi_codigo == options.value} value={dayType.tdi_codigo}>
            {dayType.tdi_descripcion}
          </option>;
        })}
      </select>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return rowData.detailDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const dayTypeBodyTemplate = (rowData) => {
    return dayTypes.filter((type) => type.tdi_codigo == rowData.dayTypeId)[0]?.tdi_descripcion;
  };

  const renderCalendars = () => {
    const calendars = [];
    for (let index = 1; index < 13; index++) {
      let date = new Date(`2023/${index > 9 ? index : "0" + index}/01`);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      calendars.push(
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

    return (
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 no-month-navigator gap-x-6 gap-y-14 pt-5">
        {calendars}
      </div>
    );
  };
  return (
    <div className="p-6">
      {/* Calendar year filter */}
      <div className="p-card rounded-4xl">
        <div className="p-card-body py-8 px-6">
          <div className="p-card-title flex justify-between">
            <span className="text-3xl">Resumen año {selectedYear?.year}</span>
            <div className="my-auto text-base text-main flex items-center gap-x-2 cursor-pointer">
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
              <div className="mt-auto mb-0">
                <Button
                  disabled={!selectedYear}
                  rounded
                  label="Buscar"
                  className="!px-10 !text-sm"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar months */}
      {monthList && (
        <div className="p-card rounded-4xl mt-6">
          <div className="p-card-body py-8 px-6">
            <div className="p-card-title flex justify-between">
              <span className="text-3xl">Meses</span>
            </div>
            <div className="p-card-content">
              <div className="grid grid-cols-3">
                {renderCalendars()}
                <div className="col-span-1">
                  <label className="text-base">Días hábiles y no hábiles</label>
                  <div className="p-card">
                    <div className="p-card-body">
                      <DataTable
                        size="small"
                        value={days}
                        editMode="cell"
                        showGridlines
                        tableStyle={{ minWidth: "22.625rem" }}
                      >
                        <Column
                          key="detailDate"
                          field="detailDate"
                          header="Fecha"
                          dataType="date"
                          body={dateBodyTemplate}
                        ></Column>
                        <Column
                          key="dayTypeId"
                          field="dayTypeId"
                          header="Tipo"
                          body={dayTypeBodyTemplate}
                          editor={(options) => cellEditor(options)}
                          onCellEditComplete={onCellEditComplete}
                        ></Column>
                        <Column
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
