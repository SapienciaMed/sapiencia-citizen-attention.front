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
import { IWorkEntity } from "../interfaces/workEntity.interfaces";
import { IUser } from "../interfaces/user.interfaces";
import { KeyFilterType } from "primereact/keyfilter";
import { inputMode } from "../utils/helpers";
import { Dropdown } from "primereact/dropdown";
import { IWorkEntityType } from "../interfaces/workEntityType.interface";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
function WorkEntitiesPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IWorkEntity[]>([]);
  const [workEntityTypes, setWorkEntityTypes] = useState<IWorkEntityType[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });

  const workEntityService = useWorkEntityService();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ mode: "all" });

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

  const onSubmit = async () => {
    setLoading(true);
    try {
      let payload = getValues() as { filingNumber: number; identification: number };
      /* const response = await workEntityService.getWorkEntityByIdentificationAndFilingNumber(
        payload?.identification,
        payload?.filingNumber
      );

      if (response.operation.code === EResponseCodes.OK) {
        setData([response.data]);
        setShowTable(true);
      } else {
        setData([]);
        setShowTable(false);
        confirmDialog({
          id: "messages",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Lo sentimos</div>
              <div className="flex items-center justify-center w-full mt-6 pt-0.5">No se encontraron resultados</div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          footer: (options) => (
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
          ),
        });
      } */
    } catch (error) {
      console.error("Error al obtener la PQRSDF:", error);
    } finally {
      setLoading(false);
    }
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
    reset({ identification: "", filingNumber: "" }, { keepValues: false, keepErrors: false });
    // setData([]);
    setShowTable(false);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : '';
  };

  const columns = () => {
    return [
      {
        name: "Id entidad",
        key: "id",
        field: "id",
        formClass: "w-[115px]",
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
        formClass: "w-[212px]",
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
        formClass: "w-full sm:w-[260px] 1xl:ml-6",
        rules: {
          maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
        },
      },
      {
        name: "Documento de identidad",
        key: "identification",
        formClass: "w-full sm:w-[260px] 1xl:ml-auto",
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
        formClass: "w-full sm:w-[260px] mx-auto",
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
        rules: {
          maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
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
          to={"editar/" + rowData?.userId}
          className="hover:text-primary flex mx-auto items-center justify-center tooltip-see-attached-dt"
          data-pr-tooltip="Editar"
          data-pr-position="right"
        >
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.80246 22.0608C6.01067 22.0678 4.2831 21.394 2.96912 20.1758C2.32922 19.5841 1.81863 18.8665 1.46942 18.068C1.12021 17.2695 0.939941 16.4073 0.939941 15.5358C0.939941 14.6643 1.12021 13.8022 1.46942 13.0037C1.81863 12.2052 2.32922 11.4875 2.96912 10.8958L12.1041 2.26832C13.0436 1.41073 14.2698 0.935272 15.5418 0.935272C16.8139 0.935272 18.04 1.41073 18.9795 2.26832C19.4694 2.72306 19.8621 3.27222 20.1342 3.88274C20.4062 4.49326 20.5519 5.15252 20.5625 5.82082C20.5658 6.39837 20.4493 6.97033 20.2206 7.50065C19.9918 8.03097 19.6557 8.50814 19.2333 8.90207L10.0862 17.5417C9.53426 18.0538 8.80914 18.3384 8.05621 18.3384C7.30327 18.3384 6.57816 18.0538 6.02621 17.5417C5.75233 17.2893 5.53373 16.9829 5.38421 16.6418C5.23468 16.3008 5.15749 15.9324 5.15749 15.56C5.15749 15.1876 5.23468 14.8192 5.38421 14.4781C5.53373 14.137 5.75233 13.8307 6.02621 13.5783L14.4845 5.6154C14.6545 5.44569 14.8848 5.35037 15.125 5.35037C15.3651 5.35037 15.5955 5.44569 15.7654 5.6154C15.9351 5.78532 16.0304 6.01566 16.0304 6.25582C16.0304 6.49598 15.9351 6.72631 15.7654 6.89623L7.30704 14.8592C7.21217 14.9419 7.13613 15.0441 7.08402 15.1587C7.03192 15.2734 7.00496 15.3978 7.00496 15.5237C7.00496 15.6497 7.03192 15.7741 7.08402 15.8887C7.13613 16.0034 7.21217 16.1055 7.30704 16.1883C7.52591 16.3755 7.80445 16.4784 8.09246 16.4784C8.38047 16.4784 8.65901 16.3755 8.87787 16.1883L18.025 7.5729C18.2577 7.34482 18.4419 7.07203 18.5665 6.77094C18.6911 6.46984 18.7535 6.14666 18.75 5.82082C18.74 5.40084 18.6448 4.98726 18.4704 4.6051C18.2959 4.22294 18.0457 3.88016 17.735 3.59749C17.1385 3.04461 16.3551 2.73743 15.5418 2.73743C14.7285 2.73743 13.9452 3.04461 13.3487 3.59749L4.24996 12.2129C3.78918 12.6351 3.42126 13.1486 3.16956 13.7206C2.91785 14.2927 2.78787 14.9108 2.78787 15.5358C2.78787 16.1608 2.91785 16.7789 3.16956 17.351C3.42126 17.923 3.78918 18.4365 4.24996 18.8587C5.23416 19.7761 6.52954 20.2861 7.87496 20.2861C9.22037 20.2861 10.5158 19.7761 11.5 18.8587L20.5504 10.2917C20.6337 10.2062 20.7333 10.1382 20.8433 10.0918C20.9533 10.0454 21.0714 10.0215 21.1908 10.0215C21.3102 10.0215 21.4283 10.0454 21.5383 10.0918C21.6483 10.1382 21.7479 10.2062 21.8312 10.2917C22.0009 10.4616 22.0962 10.6919 22.0962 10.9321C22.0962 11.1722 22.0009 11.4026 21.8312 11.5725L12.7083 20.1758C11.3767 21.4124 9.61944 22.0876 7.80246 22.0608Z"
              fill="#533893"
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-x-3.5 gap-y-6 w-full">
              {columns().map((column, index) => {
                if (!column.hasOwnProperty("showForm") || column?.showForm) {
                  return (
                    <Controller
                      key={index}
                      name={column.key}
                      control={control}
                      rules={column.rules}
                      render={({ field, fieldState }) => (
                        <div className={classNames("flex flex-col gap-y-1.5",column?.formClass)}>
                          <label htmlFor={field.name} className="text-base">
                            {column?.name} {column?.rules?.required && (<span className="text-red-600">*</span>)}
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
                              className={classNames({ "p-invalid": fieldState.error }, "w-full !font-sans mini-select")}
                              optionLabel={column?.optionLabel}
                              options={column?.options}
                              optionValue={column?.optionValue}
                              onChange={(e) => field.onChange(e.value)}
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
                  disabled={!isValid || loading}
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
              <div className="p-card-title justify-between flex">
                <span className="text-xl md:text-3xl">Resultados de búsqueda</span>
                <span></span>
              </div>
              <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
                <div className="overflow-hidden max-w-[calc(100vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] hidden md:block borderless reverse-striped">
                  <DataTable
                    value={data}
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
