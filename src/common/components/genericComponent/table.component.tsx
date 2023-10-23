import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "primereact/column"
import { DataTable, DataTableSelectionChangeEvent } from "primereact/datatable"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "../../../styles/table-movil-style.scss"


interface User {
    identification: string;
    names: string;
    lastName: string;
    email: string;
    noContact1: string;
    noContact2: string;
    userId:string
}

interface PageNumber {
    page: number;
  }

interface Props {
  data: object[]
}

export const TableGenericComponent = (props:Props) => {

    const { data } = props;

    const [selectPage, setSelectPage] = useState<PageNumber>({ page: 5 });
    
    const pageNumber: PageNumber[] = [{ page: 5 }, { page: 10 }, { page: 15 }, { page: 20 }];

    const statusBodyTemplate = (user:DataTableSelectionChangeEvent<User[]>) => {
        
        return (
            <>
                <Link to={'radicar/'+ user.identification}>
                    <Tooltip target=".custom-target-icon" style={{borderRadius:'1px'}} />
                    <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                        data-pr-tooltip="Radicar"
                        data-pr-position="right"
                    >
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5599 1H3C1.89543 1 1 1.89543 1 3V16.0938V19.125C1 20.2296 1.89543 21.125 3 21.125H6.27997M11.5599 1L15.9599 7.46875M11.5599 1V5.46875C11.5599 6.57332 12.4554 7.46875 13.5599 7.46875H15.9599M15.9599 7.46875V8.1875M9.02008 23.9727L10.9831 23.4383C11.3594 23.3358 11.6976 23.1256 11.956 22.8334L22.0203 11.4516C22.6024 10.7932 22.7811 9.78914 22.4516 8.97447C22.2358 8.44104 21.8606 8.12778 20.3028 8.15125C19.7766 8.15917 19.2844 8.40859 18.9358 8.80283L8.54169 20.5576C8.2184 20.9232 8.03996 21.3944 8.03996 21.8824V23.2238C8.03996 23.6525 8.38748 24 8.81618 24V24C8.88505 24 8.95362 23.9908 9.02008 23.9727Z" stroke="black" stroke-width="2"/>
                        </svg>
                    </i>

                </Link>
            </>
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
                disabled={options.disabled}
                style={{ opacity: "1.4" }}
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
                disabled={options.disabled}
                style={{ opacity: "1.4" }}
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
              <Button
                style={{ backgroundColor: "#533893", borderRadius: "4px", color: "white" }}
                className={options.className}
                onClick={options.onClick}
              >
                {options.page + 1}
              </Button>
            );
          },
        };
      };

  return (
    <>
        <div className="flex flex-row items-center justify-between mb-8 ">
            <div className="col-1">
                <label className="text-2xl">Resultados de búsqueda</label>
            </div>
            <div className="flex flex-row items-center" style={{width:'32em'}}>
                <div className="pl-8 mr-4 flex items-center">
                    <label className="mr-2 text-base ">Total de resultados</label>
                    <span className="text-black flex items-center bold big">{data.length}</span>
                </div>
                <div className="flex items-center">
                    <label className="mr-2 p-colorpicker">Registro por página</label>
                    <Dropdown
                        value={selectPage}
                        onChange={(e: DropdownChangeEvent) => setSelectPage(e.value)}
                        options={pageNumber}
                        optionLabel="page"
                        className="h-10"
                    />
                </div>
            </div>
        </div>

        <div className="overflow-hidden max-w-[calc(100vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] hidden md:block borderless reverse-striped">
            <DataTable
                value={data}
                paginator
                paginatorTemplate={paginatorTemplate()}
                rows={selectPage.page}
                stripedRows
                selectionMode="single"
                dataKey="id"
                scrollable
            >
                <Column header="No."  style={{ textAlign: "center" }} headerStyle={{ width: '3rem' }} body={(data, options) => options.rowIndex + 1}></Column>
                <Column style={{ textAlign: "center" }} headerStyle={{ width: '3rem' }} body={(data, options) => 'CC'}></Column>
                <Column style={{ textAlign: "center" }} field={"identification"} header="Doc. Identidad"></Column>
                <Column style={{ textAlign: "center" }} field="names" header="Nombre y apellidos"></Column>
                <Column
                    style={{ textAlign: "center", justifyContent: "center" }}
                    field="email"
                    header="Correo electrónico"
                ></Column>
                <Column style={{ textAlign: "center" }} field="noContact1" header="No. Contacto 1"></Column>
                <Column style={{ textAlign: "center" }} field="noContact2" header="No. Contacto 2"></Column>
                <Column
                    field="accion"
                    header="Acción"
                    body={statusBodyTemplate}
                    style={{ textAlign: "center" }}
                ></Column>
            </DataTable>
    </div>
    </>
  )
}
