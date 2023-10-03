import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EResponseCodes } from "../constants/api.enum";
// import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
// import { IWorkEntity } from "../interfaces/workEntity.interfaces";
import { Tooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";
import { IWorkEntity, IWorkEntityFilters } from "../interfaces/workEntity.interfaces";
import { IUser } from "../interfaces/user.interfaces";
import { KeyFilterType } from "primereact/keyfilter";
import { emailPattern, inputMode } from "../utils/helpers";
import { Dropdown } from "primereact/dropdown";
import { IWorkEntityType } from "../interfaces/workEntityType.interface";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { IPagingData } from "../utils/api-response";
function WorkEntitiesPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPagingData<IWorkEntity>>({
    array: [],
    meta: {
      total: 0,
    },
  });
  const [workEntityTypes, setWorkEntityTypes] = useState<IWorkEntityType[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isFilled, setIsFilled] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });

  const workEntityService = useWorkEntityService();

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ mode: "all" });

  const checkIsFilled = () => {
    const values = Object.values(getValues()).filter(val => val!=null && val!='' && val != undefined);
    console.log(values);
    
    setIsFilled(!!values.length)    
  };

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

  const onSearch = async () => {
    setLoading(true);
    try {
      let payload = getValues() as IWorkEntityFilters;
      payload.perPage = perPage;
      const response = await workEntityService.getWorkEntityByFilters(payload);

      if (response.operation.code === EResponseCodes.OK) {
        setData(response.data);
        console.log(response.data.meta.per_page);

        setShowTable(true);
      } else {
        setShowTable(false);
        setData({
          array: [],
          meta: {
            total: 0,
            per_page: perPage,
          },
        });
        confirmDialog({
          id: "messages",
          className: "rounded-2xl",
          headerClassName: "rounded-t-2xl",
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
      console.error("Error al obtener las entidades de trabajo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showTable) {
      onSearch();
    }
  }, [perPage, page]);

  const acceptButton = (options) => {
    return (
      <div className="flex items-center justify-center gap-2 pb-2">
        <Button
          label="Aceptar"
          rounded
          className="!px-4 !py-2 !text-base !mr-0"
          disabled={loading}
          onClick={(e) => {
            options.accept();
          }}
        />
      </div>
    );
  };

  const handleResize = () => {
    if (parentForm.current?.offsetWidth) {
      let style = getComputedStyle(parentForm.current);
      let domReact = parentForm.current.getBoundingClientRect();

      setButtonWidth({
        width: parentForm?.current.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight),
        left: domReact.x - parseInt(style.marginLeft),
      });
    }
  };

  useEffect(() => {
    const fetchWorkEntityTypes = async () => {
      setLoading(true);
      try {
        const response = await workEntityService.getWorkEntityTypes();

        if (response.operation.code === EResponseCodes.OK) {
          setWorkEntityTypes(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista de tipos de entidades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkEntityTypes();
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetForm = () => {
    const toResetArray = columns()
      .filter((column) => !column.hasOwnProperty("showForm") || column?.showForm)
      .map((column) => {
        return [column.key, ""];
      });
    reset(Object.fromEntries(toResetArray), { keepValues: false, keepErrors: false });
    setData({
      array: [],
      meta: {
        total: 0,
        per_page: perPage,
      },
    });
    setShowTable(false);
    checkIsFilled();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : "";
  };

  const columns = () => {
    return [
      {
        name: "Id entidad",
        key: "id",
        field: "id",
        formClass: "w-full 2xs:w-[115px]",
        rules: {
          required: false,
          maxLength: { value: 5, message: "No debe tener más de 5 caracteres." },
        },
        keyfilter: () => {
          return "int" as KeyFilterType;
        },
        inputMode: (): inputMode => {
          return "tel";
        },
      },
      {
        name: "Tipo entidad",
        type: "select",
        key: "workEntityTypeId",
        formClass: "w-full 2xs:w-[calc(100%-129px)] md:w-[212px]",
        optionLabel: "tet_descripcion",
        optionValue: "tet_codigo",
        options: workEntityTypes,
        body: (rowData: IWorkEntity) => {
          return rowData?.workEntityType?.tet_descripcion;
        },
      },
      {
        name: "Nombre entidad",
        key: "name",
        field: "name",
        formClass: "w-full sm:w-[calc(50%-7px)] md:w-[260px] 1xl:ml-6",
        rules: {
          maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
        },
      },
      {
        name: "Documento de identidad",
        key: "identification",
        formClass: "w-full sm:w-[calc(50%-7px)] md:w-[260px] 1xl:ml-auto",
        rules: {
          maxLength: { value: 15, message: "No debe tener más de 15 caracteres." },
        },
        body: (rowData: IWorkEntity) => {
          return rowData?.user?.typeDocument + " " + rowData?.user?.numberDocument;
        },
      },
      {
        name: "Nombres",
        key: "names",
        formClass: "w-full sm:w-[calc(50%-7px)] md:w-[260px]",
        showTable: false,
        rules: {
          maxLength: { value: 50, message: "No debe tener más de 50 caracteres." },
        },
        keyfilter: () => {
          return /^[A-Za-z\s]*$/ as KeyFilterType;
        },
      },
      {
        name: "Apellidos",
        key: "lastNames",
        formClass: "w-full sm:w-[calc(50%-7px)] md:w-[260px] xl:mx-auto",
        showTable: false,
        rules: {
          maxLength: { value: 50, message: "No debe tener más de 50 caracteres." },
        },
        keyfilter: () => {
          return /^[A-Za-z\s]*$/ as KeyFilterType;
        },
      },
      {
        name: "Nombres y Apellidos",
        key: "names",
        body: (rowData: IWorkEntity) => {
          return rowData?.user?.names + " " + rowData?.user?.lastNames;
        },
        showForm: false,
      },
      {
        name: "Correo electrónico",
        key: "email",
        field: "user.email",
        formClass: "w-full sm:w-[calc(50%-7px)] md:w-[260px]",
        rules: {
          maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
          pattern: { value: emailPattern, message: "La dirección de correo electrónico es inválida." },
        },
        keyfilter: () => {
          return "email" as KeyFilterType;
        },
        inputMode: (): inputMode => {
          return "email";
        },
      },
      {
        name: "N° contacto 1",
        key: "numberContact1",
        field: "user.numberContact1",
        showForm: false,
      },
      {
        name: "N° contacto 2",
        key: "numberContact2",
        field: "user.numberContact2",
        showForm: false,
      },
      {
        name: "Estado",
        key: "status",
        body: (rowData: IWorkEntity) => {
          return rowData?.status ? "Activo" : "Inactivo";
        },
        showForm: false,
      },
      {
        name: "Acción",
        key: "name",
        body: (rowData: IWorkEntity) => {
          return editUser(rowData);
        },
        showForm: false,
      },
    ];
  };

  const editUser = (rowData: IWorkEntity) => {
    return (
      <span>
        <Tooltip target=".tooltip-see-attached-dt" />
        <Link
          to={"editar/" + rowData?.id}
          className="hover:text-primary flex mx-auto items-center justify-center tooltip-see-attached-dt"
          data-pr-tooltip="Editar"
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
        </Link>
      </span>
    );
  };

  /* const statusTemplate = (rowData: IWorkEntity) => {
    return rowData?.answer && rowData?.answerDate ? "Cerrada" : "Abierta";
  }; */

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <ConfirmDialog id="messages"></ConfirmDialog>
      <span className="text-3xl block md:hidden pb-5">Entidades de trabajo</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Entidades de trabajo</span>
            <Link to="crear" className="my-auto text-base text-main flex items-center gap-x-2 cursor-pointer">
              <span>Crear</span>
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
            </Link>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
            <p className="text-lg">Buscar por</p>
            <form onSubmit={handleSubmit(onSearch)} onChange={checkIsFilled} className="flex flex-wrap gap-x-3.5 gap-y-6 w-full mt-10">
              {columns().map((column, index) => {
                if (!column.hasOwnProperty("showForm") || column?.showForm) {
                  return (
                    <Controller
                      key={index}
                      name={column.key}
                      control={control}
                      rules={column.rules}
                      render={({ field, fieldState }) => (
                        <div className={classNames("flex flex-col gap-y-1.5", column?.formClass)}>
                          <label htmlFor={field.name} className="text-base">
                            {column?.name} {column?.rules?.required && <span className="text-red-600">*</span>}
                          </label>
                          {!column?.type && (
                            <InputText
                              keyfilter={column.hasOwnProperty("keyfilter") ? column?.keyfilter() : undefined}
                              id={field.name}
                              value={field.value}
                              inputMode={column.hasOwnProperty("inputMode") ? column.inputMode() : undefined}
                              className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                              onChange={(e) => field.onChange(e.target.value)}
                              maxLength={column?.rules?.maxLength?.value}
                            />
                          )}
                          {column?.type == "select" && (
                            <Dropdown
                              id={field.name}
                              value={field.value}
                              className={classNames({ "p-invalid": fieldState.error }, "w-full !font-sans select-sm")}
                              optionLabel={column?.optionLabel}
                              options={[
                                { [column?.optionLabel]: "Seleccionar", [column?.optionValue]: "" },
                                ...column?.options,
                              ]}
                              optionValue={column?.optionValue}
                              onChange={(e) =>{ field.onChange(e.value);checkIsFilled()}}
                              placeholder="Seleccionar"
                            />
                          )}
                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                  );
                }
              })}
              <div className="md:mt-8 flex w-full gap-x-3 justify-end">
                <Button
                  text
                  rounded
                  type="button"
                  severity="secondary"
                  className="!py-2 !text-base !font-sans !text-black"
                  disabled={loading}
                  onClick={() => resetForm()}
                >
                  Limpiar campos
                </Button>
                <Button
                  label="Buscar"
                  rounded
                  className="!px-4 !py-2 !text-base"
                  type="submit"
                  // onClick={save}
                  disabled={loading || !isFilled}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      {showTable && (
        <div className="relative pb-16 md:pb-28 z-0">
          <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
            <div className="p-card-body !py-6 !px-6 md:!px-11">
              <div className="p-card-title justify-between flex items-center">
                <span className="text-xl md:text-3xl">Resultados de búsqueda</span>
                <div className="flex text-sm items-center gap-x-5">
                  <div className="min-w-[150px]">
                    Total de resultados <span className="ml-2 text-primary">{data.meta.total}</span>
                  </div>
                  <div className="flex items-center min-w-[210px]">
                    Registro por página
                    <div className="ml-6">
                      <Dropdown
                        id="per_page"
                        value={data.meta?.per_page ?? 3}
                        className={"w-12 !font-sans select-xs"}
                        panelClassName="select-xs"
                        optionLabel="value"
                        options={[
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
              <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
                <div className="overflow-hidden mx-auto max-w-[calc(100vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] hidden md:block borderless reverse-striped">
                  <DataTable
                    value={data.array}
                    showGridlines={false}
                    stripedRows={true}
                    emptyMessage={<span className="!font-sans">No se encontraron resultados</span>}
                    tableStyle={{ minWidth: "22.625rem", marginBottom: "6.063rem" }}
                  >
                    {columns().map((column) => {
                      if (!column.hasOwnProperty("showTable") || column?.showTable) {
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
                      }
                    })}
                  </DataTable>
                </div>
                <div className="p-5 p-card md:hidden block relative rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
                  <div className="pb-5">
                    {columns().map((column, index) => {
                      return (
                        <div className="flex flex-wrap items-start justify-between" key={index}>
                          <div className={classNames("w-1/2 text-sm", { "mt-4": index > 0 })}>{column.name}</div>
                          <div className={classNames("w-1/2 text-sm !font-sans text-right", { "mt-4": index > 0 })}>
                            {column.hasOwnProperty("body") ? column?.body(data[0]) : data[0]?.[column?.key]}
                          </div>
                        </div>
                      );
                    })}
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

export default WorkEntitiesPage;
