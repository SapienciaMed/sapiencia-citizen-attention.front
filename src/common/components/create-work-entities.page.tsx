import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, ConfirmDialogOptions, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { IWorkEntity } from "../interfaces/workEntity.interfaces";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { EResponseCodes } from "../constants/api.enum";
import { RadioButton } from "primereact/radiobutton";

import { IUser } from "../interfaces/user.interfaces";
import { Dropdown } from "primereact/dropdown";
import { IWorkEntityType } from "../interfaces/workEntityType.interface";
function CreateWorkEntitiesPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const searchButton = useRef(null);
  const createEntityForm = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const cancelButtons = (options: ConfirmDialogOptions) => {
    return (
      <div className="flex items-center justify-center gap-2 pb-2">
        <Button
          text
          rounded
          severity="secondary"
          className="!py-2 !text-base !font-sans !text-black"
          disabled={loading}
          onClick={(e) => {
            options.accept();
            resetForm();
            navigate(-1);
          }}
        >
          Cancelar
        </Button>
        <Button
          label="Continuar"
          rounded
          className="!px-4 !py-2 !text-base !mr-0"
          disabled={loading}
          onClick={(e) => {
            options.reject();            
          }}
        />
      </div>
    );
  };

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

  const onSearch = async () => {
    setLoading(true);
    try {
      let payload = getValues() as { identification: number };
      const response = await workEntityService.getUserByDocument(payload?.identification);

      if (response.operation.code === EResponseCodes.OK) {
        setData([response.data]);
        setShowTable(true);
      } else {
        setShowTable(false);
        setData([]);
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
      console.error("Error al obtener el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      let payload = getValues() as IWorkEntity;
      payload.userId = selectedUser;
      const response = await workEntityService.createWorkEntity(payload);

      if (response.operation.code === EResponseCodes.OK) {
        resetForm();
        confirmDialog({
          id: "messages",
          className: "rounded-2xl",
          headerClassName: "rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-2xl md:text-3xl w-full text-center">¡Cambios guardados!</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">¡Creación exitosa!</div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Cerrar",
          footer: (options) => acceptButton(options),
        });
      } else {
        /* setShowTable(false);
        setData([]); */
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
      console.error("Error al crear Entidad:", error);
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
    reset({ identification: "" }, { keepValues: false, keepErrors: false });
    setData([]);
    setShowTable(false);
    setSelectedUser(null);
  };

  const cancel = () => {
    confirmDialog({
      id: "messages",
      className: "rounded-2xl",
      headerClassName: "rounded-t-2xl",
      contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
      message: (
        <div className="flex flex-wrap w-full items-center justify-center mx-auto">
          <div className="mx-auto text-primary text-2xl md:text-3xl w-full text-center">Cancelar acción</div>
          <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
            ¿Desea cancelar la acción?,
            <br />
            no se guardarán los datos
          </div>
        </div>
      ),
      closeIcon: closeIcon,
      acceptLabel: "Cerrar",
      footer: (options) => cancelButtons(options),
    });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : "";
  };

  const columns = () => {
    return [
      {
        name: "Doc. identidad",
        key: "numberDocument",
        body: (rowData: IUser) => {
          return rowData?.typeDocument + " " + rowData?.numberDocument;
        },
      },
      {
        name: "Nombres y Apellidos",
        key: "name",
        body: (rowData: IUser) => {
          return rowData?.names + " " + rowData?.lastNames;
        },
      },
      {
        name: "Correo electrónico",
        key: "email",
        field: "email",
      },
      {
        name: "N° contacto 1",
        key: "numberContact1",
        field: "numberContact1",
      },
      {
        name: "N° contacto 2",
        key: "numberContact2",
        field: "numberContact2",
      },
      {
        name: "Seleccionar",
        key: "name",
        body: (rowData: IUser) => {
          return radioUser(rowData);
        },
      },
    ];
  };

  const radioUser = (rowData: IUser) => {
    return (
      <RadioButton
        className="mini-radio"
        inputId={"selectedUser" + rowData?.id}
        name="selectedUser"
        value={rowData?.id}
        onChange={(e) => setSelectedUser(e.value)}
        checked={selectedUser === rowData?.id}
      />
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <ConfirmDialog id="messages"></ConfirmDialog>
      <span className="text-3xl block md:hidden pb-5">Crear Entidad de trabajo</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Crear Entidad de trabajo</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
            <form onSubmit={handleSubmit(onSearch)} className="flex flex-wrap gap-6 w-full">
              <Controller
                name="identification"
                control={control}
                rules={{
                  required: "Campo obligatorio.",
                  maxLength: { value: 15, message: "No debe tener más de 15 caracteres." },
                }}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-y-1.5 md:max-w-[16rem] w-full">
                    <label htmlFor={field.name} className="text-base">
                      Número de identificación <span className="text-red-600">*</span>
                    </label>
                    <InputText
                      keyfilter="int"
                      id={field.name}
                      value={field.value}
                      inputMode="tel"
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                      onChange={(e) => field.onChange(e.target.value)}
                      maxLength={15}
                    />
                    {getFormErrorMessage(field.name)}
                  </div>
                )}
              />
              <div className="md:mt-8 flex w-full md:w-auto gap-x-3 justify-end ml-auto">
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
                  ref={searchButton}
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
          {selectedUser && (
            <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
              <div className="p-card-body !py-6 !px-6 md:!px-11">
                <div className="p-card-title justify-between flex">
                  <span className="text-xl md:text-3xl">Entidad</span>
                  <span></span>
                </div>
                <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
                  <form onSubmit={handleSubmit(onSave)} className="flex flex-wrap gap-6 w-full" ref={createEntityForm}>
                    <Controller
                      name="workEntityTypeId"
                      control={control}
                      rules={{
                        required: "Campo obligatorio.",
                      }}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-y-1.5 md:max-w-2xs w-full">
                          <label htmlFor={field.name} className="text-base">
                            Tipo entidad <span className="text-red-600">*</span>
                          </label>
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            className={classNames({ "p-invalid": fieldState.error }, "w-full !font-sans mini-select")}
                            optionLabel="tet_descripcion"
                            options={workEntityTypes}
                            optionValue="tet_codigo"
                            onChange={(e) => field.onChange(e.value)}
                            placeholder="Seleccionar"
                          />

                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: "Campo obligatorio.",
                        maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-y-1.5 md:max-w-[16rem] w-full">
                          <label htmlFor={field.name} className="text-base">
                            Nombre entidad <span className="text-red-600">*</span>
                          </label>
                          <InputText
                            id={field.name}
                            value={field.value}
                            inputMode="text"
                            className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                            onChange={(e) => field.onChange(e.target.value)}
                            maxLength={100}
                          />
                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                    <div
                      className="fixed z-30 p-card rounded-none shadow-none border-t border-[#D9D9D9] w-full top-[calc(100vh-65px)] md:top-[calc(100vh-91px)]"
                      style={{ width: buttonWidth.width, left: buttonWidth.left }}
                    >
                      <div className="p-card-body !py-3 md:!py-6 md:!px-10 flex gap-x-6 justify-center md:justify-end max-w-[1200px] mx-auto">
                        <Button
                          text
                          rounded
                          type="button"
                          severity="secondary"
                          className="!py-2 !text-base !font-sans !text-black"
                          disabled={loading}
                          onClick={() => cancel()}
                        >
                          Cancelar
                        </Button>
                        <Button
                          label="Guardar"
                          rounded
                          className="!px-4 !py-2 !text-base"
                          type="submit"
                          disabled={!isValid || loading}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!selectedUser && (
        <div
          className="fixed z-30 p-card rounded-none shadow-none border-t border-[#D9D9D9] w-full top-[calc(100vh-65px)] md:top-[calc(100vh-91px)]"
          style={{ width: buttonWidth.width, left: buttonWidth.left }}
        >
          <div className="p-card-body !py-3 md:!py-6 md:!px-10 flex gap-x-7 justify-center md:justify-start max-w-[1200px] mx-auto">
            <Button
              label="Regresar"
              rounded
              className="!px-8 !py-2 !text-base"
              onClick={() => {
                navigate(-1);
              }}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateWorkEntitiesPage;
