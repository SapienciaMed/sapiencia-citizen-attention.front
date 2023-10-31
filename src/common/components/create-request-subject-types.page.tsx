import { Button } from "primereact/button";
import { ConfirmDialog, ConfirmDialogOptions, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EResponseCodes } from "../constants/api.enum";
// import { useRequestSubjectTypeService } from "../hooks/RequestSubjectTypeService.hook";
// import { IRequestSubjectType } from "../interfaces/requestSubjectType.interfaces";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
import { useRequestSubjectTypeService } from "../hooks/RequestSubjectTypeService.hook";
import useCheckMobileScreen from "../hooks/isMobile.hook";
import { IProgram } from "../interfaces/program.interfaces";
import {
  IRequestObject,
  IRequestSubjectType
} from "../interfaces/requestSubjectType.interfaces";
import { IPagingData } from "../utils/api-response";

function CreateRequestSubjectTypesPage(): React.JSX.Element {
  const { authorization } = useContext(AppContext);
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPagingData<IRequestSubjectType>>({
    array: [],
    meta: {
      total: 0,
    },
  });
  const [requestObjects, setRequestSubjectTypeTypes] = useState<IRequestObject[]>([]);
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });

  const navigate = useNavigate();

  const checkMobileScreen = useCheckMobileScreen();

  const requestSubjectTypeService = useRequestSubjectTypeService();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ mode: "all" });

  const checkIsFilled = () => {
    const values = Object.values(getValues()).filter((val) => val != null && val != "" && val != undefined);

    setIsFilled(!!values.length);
  };

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

  const cancel = async () => {
    confirmDialog({
      id: "messages",
      className: "!rounded-2xl overflow-hidden",
      headerClassName: "!rounded-t-2xl",
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
      footer: (options) =>
        cancelButtons(
          options,
          "Aceptar",
          () => {
            resetForm();
            navigate(-1);
          },
          () => {
            options.accept();
          }
        ),
    });
  };

  const cancelButtons = (
    options: ConfirmDialogOptions,
    acceptLabel = "Continuar",
    callback = null,
    cancelCallback = null,
    disabledCondition = false
  ) => {
    if (!callback) {
      callback = options.reject();
    }
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
            if (cancelCallback) {
              cancelCallback();
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          label={acceptLabel}
          rounded
          className="!px-4 !py-2 !text-base !mr-0 !font-sans"
          disabled={loading || disabledCondition}
          onClick={(e) => {
            callback();
          }}
        />
      </div>
    );
  };

  const onSave = async () => {
    setLoading(true);

    try {
      let values = getValues();
      let payload = values as IRequestSubjectType;
      payload.programs = values.programId.map((program: number) => {
        return { prg_codigo: program };
      });
      const response = await requestSubjectTypeService.createRequestSubjectType(payload);

      if (response.operation.code === EResponseCodes.OK) {
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Creación exitosa</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                ¡Asunto creado exitosamente!
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Cerrar",
          footer: (options) => acceptButton(options),
        });
        resetForm();
      } else {
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">
                {response.operation?.title ?? "Lo sentimos"}
              </div>
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
      console.error("Error al crear tipo de asunto:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkMobileScreen && !isMobile) {
      setIsMobile(true);
    } else if (!checkMobileScreen && isMobile) {
      setIsMobile(false);
    }
  }, [checkMobileScreen]);

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
    const fetchRequestObjects = async () => {
      setLoading(true);
      try {
        const response = await requestSubjectTypeService.getRequestObjects();

        if (response.operation.code === EResponseCodes.OK) {
          setRequestSubjectTypeTypes(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista de objectos de solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequestObjects();
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const response = await requestSubjectTypeService.getPrograms();

        if (response.operation.code === EResponseCodes.OK) {
          setPrograms(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista de programas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetForm = () => {
    const toResetArray = columns().map((column) => {
      return [column.key, ""];
    });
    reset(Object.fromEntries(toResetArray), { keepValues: false, keepErrors: false });
    checkIsFilled();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : "";
  };

  const columns = () => {
    return [
      {
        name: "Nombre Asunto",
        key: "aso_asunto",
        field: "name",
        formClass: "col-span-3 sm:col-span-1 md:col-span-3 lg:col-span-1",
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
        },
      },
      {
        name: "Objeto",
        type: "select",
        key: "requestObjectId",
        formClass: "col-span-3 sm:col-span-1 md:col-span-3 lg:col-span-1",
        optionLabel: "obs_description",
        optionValue: "obs_codigo",
        options: requestObjects,
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "Programas",
        type: "multiselect",
        key: "programId",
        formClass: "col-span-3 sm:col-span-1 md:col-span-3 lg:col-span-1",
        optionLabel: "prg_descripcion",
        optionValue: "prg_codigo",
        options: programs,
        rules: {
          required: "El campo es obligatorio.",
        },
      },
    ];
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <ConfirmDialog id="messages"></ConfirmDialog>
      <span className="text-3xl block md:hidden pb-5">Crear tipos de asuntos</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Crear tipos de asuntos</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-1">
            <form
              onSubmit={handleSubmit(onSave)}
              onChange={checkIsFilled}
              className="grid grid-cols-3 lg:gap-x-11 gap-x-3.5 gap-y-6 w-full mt-10"
            >
              {columns().map((column, index) => {
                return (
                  <Controller
                    key={column.key}
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
                            id={field.name}
                            value={field.value}
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
                            onChange={(e) => {
                              field.onChange(e.value);
                              checkIsFilled();
                            }}
                            placeholder="Seleccionar"
                          />
                        )}
                        {column?.type == "multiselect" && (
                          <MultiSelect
                            id={field.name}
                            value={field.value}
                            className={classNames(
                              { "p-invalid": fieldState.error },
                              "w-full !font-sans select-sm max-w-full truncate"
                            )}
                            optionLabel={column?.optionLabel}
                            options={column?.options}
                            optionValue={column?.optionValue}
                            onChange={(e) => {
                              field.onChange(e.value);
                              checkIsFilled();
                            }}
                            placeholder="Seleccionar"
                          />
                        )}
                        {getFormErrorMessage(field.name)}
                      </div>
                    )}
                  />
                );
              })}
              <div className="md:mt-8 flex w-full gap-x-3 justify-end col-span-full">
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
                  className="!px-4 !py-2 !text-base !font-sans"
                  type="submit"
                  // onClick={save}
                  disabled={loading || !isFilled || !isValid}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRequestSubjectTypesPage;
