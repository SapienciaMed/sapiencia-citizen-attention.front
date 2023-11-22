import { Button } from "primereact/button";
import { ConfirmDialog, ConfirmDialogOptions, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useBreadCrumb from "../../common/hooks/bread-crumb.hook";
import { EResponseCodes } from "../constants/api.enum";
import { EDocumentTypes } from "../constants/documentTypes";
import { useCitizenAttentionService } from "../hooks/CitizenAttentionService.hook";
import useCheckMobileScreen from "../hooks/isMobile.hook";
import {
  IAttentionRequestType,
  ICitizenAttention,
  ICorregimiento,
  IDetailServiceChannel,
  IServiceChannel,
  IUserType,
  IValueGroup,
} from "../interfaces/citizenAttention.interfaces";
import { IDependence } from "../interfaces/dependence.interfaces";
import { IGenericData } from "../interfaces/genericData.interfaces";
import { IProgram } from "../interfaces/program.interfaces";
import { IRequestSubjectType } from "../interfaces/requestSubjectType.interfaces";

interface Props {
  isEdit?: boolean;
}

function FormCitizenAttentionsPage({ isEdit = false }: Props): React.JSX.Element {
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [citizenAttentionData, setCitizenAttentionData] = useState<ICitizenAttention>();
  const [serviceChannels, setServiceChannels] = useState<IServiceChannel[]>([]);
  const [detailServiceChannels, setDetailServiceChannels] = useState<IDetailServiceChannel[]>([]);
  const [userTypes, setUserTypes] = useState<IUserType[]>([]);
  const [attentionRequestTypes, setAttentionRequestTypes] = useState<IAttentionRequestType[]>([]);
  const [valueGroups, setValueGroups] = useState<IValueGroup[]>([]);
  const [corregimientos, setCorregimientos] = useState<ICorregimiento[]>([]);
  const [requestSubjectTypes, setRequestSubjectTypes] = useState<IRequestSubjectType[]>([]);
  const [dependencies, setDependencies] = useState<IDependence[]>([]);
  const [stratums, setStratums] = useState<IGenericData[]>([]);
  const [totalAttentions, setTotalAttentions] = useState<number>(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });

  const navigate = useNavigate();

  const checkMobileScreen = useCheckMobileScreen();

  const citizenAttentionService = useCitizenAttentionService();

  useBreadCrumb({
    isPrimaryPage: true,
    name: "Registro de atención",
    url: "/atencion-ciudadana/registrar-atencion",
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    setValue,
    trigger,
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

  const { id } = useParams();

  const onSave = async () => {
    setLoading(true);

    try {
      let values = getValues();
      delete values.serviceChannelId;
      delete values.valueGroupId;
      let payload = values as ICitizenAttention;
      if (isEdit) {
        payload.id = parseInt(id);
      }      
      const response = await (isEdit
        ? citizenAttentionService.updateCitizenAttention(payload)
        : citizenAttentionService.createCitizenAttention(payload));

      if (response.operation.code === EResponseCodes.OK) {
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">
                {isEdit ? "Actualización exitosa" : "¡Registro exitoso!"}
              </div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                {isEdit ? "¡Asunto actualizado exitosamente!" : "Atención ciudadana registrada con éxito"}
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Cerrar",
          footer: (options) => acceptButton(options),
        });
        if (!isEdit) {
          resetForm();
          setPrograms([]);
          setRequestSubjectTypes([]);
          setUserTypes([]);
        }
        let newTotal = totalAttentions + 1;
        setTotalAttentions(newTotal);
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
      console.error("Error al " + (isEdit ? "editar" : "crear") + " tipo de asunto:", error);
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
    const toFetch = [
      { method: "getDocumentType", isAux: true, setData: setDocumentTypes },
      { method: "getAttentionRequestTypes", isAux: false, setData: setAttentionRequestTypes },
      { method: "getDependencies", isAux: false, setData: setDependencies },
      { method: "getStratums", isAux: false, setData: setStratums },
      { method: "getSeviceChannels", isAux: false, setData: setServiceChannels },
      { method: "getValueGroups", isAux: false, setData: setValueGroups },
      { method: "getCorregimientos", isAux: false, setData: setCorregimientos },
      { method: "getCorregimientos", isAux: false, setData: setCorregimientos },
    ];

    toFetch.forEach((currentFetch) => {
      let fetchData = async () => {
        setLoading(true);
        try {
          const response = await citizenAttentionService[currentFetch.method]();
          if (currentFetch.isAux) {
            const auxResponse = JSON.parse(JSON.stringify(response));
            if (auxResponse.status === true) {
              currentFetch.setData(response.data);
            }
          } else {
            if (response.operation.code === EResponseCodes.OK) {
              currentFetch.setData(response.data);
            }
          }
        } catch (error) {
          console.error("Error al obtener la lista de tipos de documento:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    });

    const fetchAttentions = async () => {
      setLoading(true);
      try {
        const response = await citizenAttentionService.getCitizenAttentionByFilters({ perPage: 9999999999 });
        if (response.operation.code === EResponseCodes.OK) {
          setTotalAttentions(response.data.array.length);
        }
      } catch (error) {
        console.error("Error al obtener el número de atenciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttentions();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (citizenAttentionData) {
      checkIsFilled();
      trigger();
    }
  }, [citizenAttentionData]);

  const resetForm = () => {
    const allInputs = [...columns(), ...columnsDB(), ...columnsAtention()];
    const toResetArray = allInputs.map((column) => {
      return [column.key, ""];
    });
    reset(Object.fromEntries(toResetArray), { keepValues: false, keepErrors: false });
    checkIsFilled();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : "";
  };

  const columnsAtention = () => {
    return [
      {
        name: "Tipo de solicitud",
        type: "select",
        key: "attentionRequestTypeId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "description",
        optionValue: "id",
        options: attentionRequestTypes,
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "Dependencia",
        type: "select",
        key: "dependencyId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "dep_descripcion",
        optionValue: "dep_codigo",
        options: dependencies,
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: (value) => {
          const dependency = dependencies.filter((dependency) => dependency.dep_codigo == value)[0];
          setPrograms(dependency?.programs);
          setValue("programId", "");
        },
      },
      {
        name: "Programa",
        type: "select",
        key: "programId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "prg_descripcion",
        optionValue: "prg_codigo",
        options: programs,
        disabled: !programs?.length,
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: (value) => {
          const program = programs.filter((program) => program.prg_codigo == value)[0];
          setRequestSubjectTypes(
            program.affairs.map((affair) => {
              return {
                aso_codigo: affair.aso_codigo,
                aso_asunto: affair.aso_asunto,
              };
            })
          );
          setValue("requestSubjectTypeId", "");
        },
      },
      {
        name: "Tema de solicitud",
        type: "select",
        key: "requestSubjectTypeId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "aso_asunto",
        optionValue: "aso_codigo",
        options: requestSubjectTypes,
        disabled: !requestSubjectTypes?.length,
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "Comunas y corregimientos",
        type: "select",
        key: "corregimientoId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "name",
        optionValue: "id",
        options: corregimientos,
      },
      {
        name: "Grupo de valor",
        type: "select",
        key: "valueGroupId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "name",
        optionValue: "id",
        options: valueGroups,
        onChange: (value) => {
          const valueGroup = valueGroups.filter((valueGroup) => valueGroup.id == value)[0];
          setUserTypes(valueGroup?.userTypes);
          setValue("userTypeId", "");
        },
      },
      {
        name: "Tipo de usuario",
        type: "select",
        key: "userTypeId",
        formClass: "col-span-full sm:col-span-4",
        optionLabel: "name",
        optionValue: "id",
        options: userTypes,
        disabled: !userTypes?.length,
      },
      {
        name: "Observación",
        key: "observation",
        field: "observation",
        placeholder: "Escribe aquí",
        formClass: "col-span-full",
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 5000, message: "No debe tener más de 5000 caracteres." },
        },
        counter: true,
      },
    ];
  };

  const columnsDB = () => {
    return [
      {
        name: "Canal de atención",
        type: "select",
        key: "serviceChannelId",
        formClass: "w-1/3",
        optionLabel: "cna_canal",
        optionValue: "cna_codigo",
        options: serviceChannels,
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: (value) => {
          const channel = serviceChannels.filter((channel) => channel.cna_codigo == value)[0];
          setDetailServiceChannels(channel.details);
          setValue("detailServiceChannelId", "");
        },
      },
      {
        name: "Elija ¿Cuál?",
        type: "select",
        key: "detailServiceChannelId",
        formClass: "w-1/3",
        optionLabel: "cad_nombre",
        optionValue: "cad_codigo",
        options: detailServiceChannels,
        disabled: !detailServiceChannels?.length,
        rules: {
          required: "El campo es obligatorio.",
        },
      },
    ];
  };

  const columns = () => {
    const requiredIfNit = (value) => {
      if (getValues("documentTypeId") == EDocumentTypes.NIT && !value.trim()) return "El campo es obligatorio.";
      return true;
    };
    const requiredIfNotNit = (value) => {
      if (getValues("documentTypeId") != EDocumentTypes.NIT && !value.trim()) return "El campo es obligatorio.";
      return true;
    };
    return [
      {
        name: "Tipo",
        type: "select",
        key: "documentTypeId",
        formClass: "col-span-1 sm:col-span-2 xl:col-span-1",
        optionLabel: "LGE_ELEMENTO_CODIGO",
        optionValue: "LGE_CODIGO",
        options: documentTypes,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "No. documento",
        key: "identification",
        field: "identification",
        formClass: "col-span-full sm:col-span-4",
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 15, message: "No debe tener más de 15 caracteres." },
        },
      },
      {
        name: "Primer nombre",
        key: "firstName",
        field: "firstName",
        formClass: "col-span-full sm:col-span-3 sm:col-start-1",
        hidden: () => {
          return getValues("documentTypeId") == EDocumentTypes.NIT;
        },
        rules: {
          validate: {
            required: requiredIfNotNit,
          },
          maxLength: { value: 50, message: "No debe tener más de 50 caracteres." },
        },
      },
      {
        name: "Segundo nombre",
        key: "secondName",
        field: "secondName",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return getValues("documentTypeId") == EDocumentTypes.NIT;
        },
        rules: {
          maxLength: { value: 50, message: "No debe tener más de 50 caracteres." },
        },
      },
      {
        name: "Primer apellido",
        key: "firstSurname",
        field: "firstSurname",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return getValues("documentTypeId") == EDocumentTypes.NIT;
        },
        rules: {
          validate: {
            required: requiredIfNotNit,
          },
          maxLength: { value: 50, message: "No debe tener más de 50 caracteres." },
        },
      },
      {
        name: "Segundo apellido",
        key: "secondSurname",
        field: "secondSurname",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return getValues("documentTypeId") == EDocumentTypes.NIT;
        },
        rules: {
          maxLength: { value: 50, message: "No debe tener más de 50 caracteres." },
        },
      },
      {
        name: "Razón social",
        key: "businessName",
        field: "businessName",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return getValues("documentTypeId") != EDocumentTypes.NIT;
        },
        rules: {
          validate: {
            required: requiredIfNit,
          },
          maxLength: { value: 200, message: "No debe tener más de 200 caracteres." },
        },
      },
      {
        name: "Correo electrónico",
        key: "email",
        field: "email",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 200, message: "No debe tener más de 200 caracteres." },
        },
      },
      {
        name: "No. De contacto 1",
        key: "firstContactNumber",
        field: "firstContactNumber",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 10, message: "No debe tener más de 10 caracteres." },
        },
      },
      {
        name: "No. De contacto 2",
        key: "secondContactNumber",
        field: "secondContactNumber",
        formClass: "col-span-full sm:col-span-3",
        hidden: () => {
          return false;
        },
        rules: {
          maxLength: { value: 10, message: "No debe tener más de 10 caracteres." },
        },
      },
      {
        name: "Estrato",
        type: "select",
        key: "stratumId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "itemDescription",
        optionValue: "id",
        options: stratums,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
      },
    ];
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      onChange={checkIsFilled}
      className="p-4 md:p-6 max-w-[1200px] mx-auto mt-6"
      ref={parentForm}
    >
      <ConfirmDialog id="messages"></ConfirmDialog>
      <span className="text-2xl block md:hidden pb-5 text-center">Registro de atención</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title grid grid-cols-2 justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Registro de atención</span>
            <div className="grid md:grid-cols-2 gap-x-3.5 md:gap-x-20 gap-y-4 w-full col-span-full md:col-span-1 sm:mt-6">
              <div className="col-span-full text-xl text-center">Registro diario de atenciones</div>
              <div className="flex flex-col gap-y-1.5">
                <label htmlFor="currentDate" className="text-base">
                  Fecha
                </label>
                <div>
                  <InputText
                    id="currentDate"
                    disabled={true}
                    value={new Date().toLocaleDateString("en-GB")}
                    className="w-full py-2 !font-sans"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-1.5">
                <label htmlFor="currentDate" className="text-base">
                  Total
                </label>
                <div>
                  <InputText
                    id="currentDate"
                    disabled={true}
                    value={String(totalAttentions)}
                    className="w-full py-2 !font-sans"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Base de datos */}
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9] mt-6">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-content !pb-0 !pt-0 md:!pt-1">
            <p className="text-base text-center md:text-left">
              BASE DE DATOS - CANAL TELEFÓNICO - PRESENCIAL - VIRTUAL
            </p>
            <p className="text-base text-center md:text-left">
              El objetivo de este formulario es recopilar cada una de las llamadas, visitas o atenciones virtuales que
              ingresan a La Agencia de Educación Postsecundaria de Medellín - Sapiencia.
            </p>
            <div className="w-full items-center justify-center">
              <div className="md:flex-nowrap flex-wrap flex items-center justify-center lg:space-x-11 md:space-x-3.5 gap-y-6 w-full sm:mt-10">
                {columnsDB().map((column, index) => {
                  return (
                    <Controller
                      key={column.key}
                      name={column.key}
                      control={control}
                      rules={column.rules}
                      render={({ field, fieldState }) => (
                        <div className={classNames("flex flex-col gap-y-1.5 w-full", column?.formClass)}>
                          <label htmlFor={field.name} className="text-base">
                            {column?.name} {column?.rules?.required && <span className="text-red-600">*</span>}
                          </label>
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
                              disabled={column?.disabled}
                              onChange={(e) => {
                                field.onChange(e.value);
                                if (column?.onChange) {
                                  column.onChange(e.value);
                                }
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del ciudadano */}
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9] mt-6">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Información del ciudadano</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-1">
            <div className="grid grid-cols-4 sm:grid-cols-12 lg:gap-x-4.5 gap-x-3.5 gap-y-6 w-full sm:mt-7">
              {columns().map((column, index) => {
                return (
                  !column?.hidden() && (
                    <Controller
                      key={column.key}
                      name={column.key}
                      control={control}
                      rules={column.rules}
                      render={({ field, fieldState }) => (
                        <div className={classNames("flex flex-col gap-y-1.5", column?.formClass)}>
                          <label htmlFor={field.name} className="text-base">
                            {column?.name}{" "}
                            {(column?.rules?.required || column?.rules?.validate?.required) && (
                              <span className="text-red-600">*</span>
                            )}
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
                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Información de la atención */}
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9] mt-6">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Información de la atención</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-1">
            <div className="grid grid-cols-4 sm:grid-cols-12 lg:gap-x-4.5 gap-x-3.5 gap-y-6 w-full sm:mt-7">
              {columnsAtention().map((column, index) => {
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
                          <InputTextarea
                            id={field.name}
                            value={field.value}
                            placeholder={column?.placeholder}
                            disabled={column?.disabled}
                            className={classNames(
                              { "p-invalid": fieldState.error },
                              "w-full py-2 !font-sans min-h-[64px"
                            )}
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
                            disabled={column?.disabled}
                            options={[
                              { [column?.optionLabel]: "Seleccionar", [column?.optionValue]: "" },
                              ...column?.options,
                            ]}
                            optionValue={column?.optionValue}
                            onChange={(e) => {
                              field.onChange(e.value);
                              checkIsFilled();
                              if (column?.onChange) {
                                column.onChange(e.value);
                              }
                            }}
                            placeholder="Seleccionar"
                          />
                        )}
                        {column.counter && (
                          <span className="ml-auto mr-0 text-sm font-sans">
                            Max {column?.rules?.maxLength?.value} caracteres
                          </span>
                        )}
                        {getFormErrorMessage(field.name)}
                      </div>
                    )}
                  />
                );
              })}
              <div className="md:mt-8 flex w-full gap-x-3 justify-end col-span-full">
                {/* <Button
                  text
                  rounded
                  type="button"
                  severity="secondary"
                  className="!py-2 !text-base !font-sans !text-black"
                  disabled={loading}
                  onClick={() => cancel()}
                >
                  Cancelar
                </Button> */}
                <Button
                  label="Guardar"
                  rounded
                  className="!px-4 !py-2 !text-base !font-sans"
                  type="submit"
                  // onClick={save}
                  disabled={loading || !isFilled || !isValid}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FormCitizenAttentionsPage;
