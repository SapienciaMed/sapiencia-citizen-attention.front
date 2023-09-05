import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";

function CalendarPage(): React.JSX.Element {
    const [selectedYear, setSelectedYear] = useState(null);
    const [monthList, setMonthList] = useState([]);
    const [dates, setDates] = useState(null);
    // const [loading, setLoading] = useState(false);

    const years = [
        { label: "2020", value: 2020 },
        { label: "2021", value: 2021 },
        { label: "2022", value: 2022 },
        { label: "2023", value: 2023 },
        // Agrega más años según sea necesario
    ];

    const handleYearChange = (e) => {
        setSelectedYear(e.value);
    };

    const handleSearch = () => {
        // Lógica de búsqueda con el año seleccionado
        if (selectedYear) {
            console.log(`Realizar búsqueda para el año ${selectedYear}`);
        } else {
            alert("Selecciona un año antes de buscar.");
        }
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
                            setDates(e.value);
                            console.log(dates);
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
        console.log(calendars);

        return (
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 no-month-navigator gap-x-6 gap-y-14">
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
                        <span className="text-3xl">
                            Resumen año {selectedYear}
                        </span>
                        <div className="my-auto text-base text-main flex items-center gap-x-2 cursor-pointer">
                            <span>Crear año</span>
                            <svg
                                width="16"
                                height="17"
                                viewBox="0 0 16 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
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
                                <label
                                    htmlFor="yearDropdown"
                                    className="text-base"
                                >
                                    Selecciona el año:
                                </label>
                                <Dropdown
                                    id="yearDropdown"
                                    name="yearDropdown"
                                    optionLabel="label"
                                    options={years}
                                    value={selectedYear}
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
            <div className="p-card rounded-4xl mt-6">
                <div className="p-card-body py-8 px-6">
                    <div className="p-card-title flex justify-between">
                        <span className="text-3xl">Meses</span>
                    </div>
                    <div className="p-card-content">
                        <div className="grid grid-cols-3">
                            {renderCalendars()}
                            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 no-month-navigator gap-x-6 gap-y-14">
                                <label className="text-base">
                                    Días hábiles y no hábiles
                                </label>
                                <div className="p-card">
                                    <div className="p-card-body"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
