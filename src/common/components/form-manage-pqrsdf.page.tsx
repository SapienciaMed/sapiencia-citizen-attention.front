import { Button } from "primereact/button";
import { ConfirmDialog, ConfirmDialogOptions, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import useBreadCrumb from "../../common/hooks/bread-crumb.hook";
import { EResponseCodes } from "../constants/api.enum";
import { EDocumentTypes } from "../constants/documentTypes";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook";
import useCheckMobileScreen from "../hooks/isMobile.hook";
import { IDependence } from "../interfaces/dependence.interfaces";
import { IGenericData } from "../interfaces/genericData.interfaces";
import { IPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { IProgram } from "../interfaces/program.interfaces";
import { IRequestSubjectType } from "../interfaces/requestSubjectType.interfaces";
import { emailPattern, splitUrl, toLocaleDate } from "../utils/helpers";
import { useCitizenAttentionService } from "../hooks/CitizenAttentionService.hook";
import { IRequestType } from "../interfaces/requestType.interfaces";
import { ILegalEntityType } from "../interfaces/legalEntityType.interfaces";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { IResponseMedium } from "../interfaces/responseMedium.interfaces";
import { IPerson } from "../interfaces/person.interfaces";
import { IMotive } from "../interfaces/motive.interfaces";
import { IFile } from "../interfaces/file.interfaces";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { UploadManagetComponent } from "./genericComponent/uploadManagetComponent";
import { AppContext } from "../contexts/app.context";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";
import { Tooltip } from "primereact/tooltip";
import { showIcon } from "./icons/show";
import { trashIcon } from "./icons/trash";
import { IFactor, IResposeType } from "../interfaces/mastersTables.interface";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { IWorkEntityType } from "../interfaces/workEntityType.interface";
import { IUserManageEntity, IWorkEntity } from "../interfaces/workEntity.interfaces";

interface Props {
  isEdit?: boolean;
}

interface InfoTable {
  user: string;
  visiblePetitioner?: boolean;
  action?: Blob;
  id?: number;
}

function FormManagePqrsdfPage({ isEdit = false }: Props): React.JSX.Element {
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initDataLoaded, setInitDataLoaded] = useState(false);
  const [isUpdatePerson, setIsUpdatePerson] = useState(false);
  const { authorization } = useContext(AppContext);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [pqrsdfData, setPqrsdfData] = useState<IPqrsdf>();
  const [perPage, setPerPage] = useState(10);
  const [tableData, setTableData] = useState<InfoTable[]>([]);  
  const [fileResponsePqrsdf, setFileResponsePqrsdf] = useState<Blob>(null);
  const [fileName, setFileName] = useState<string>("");
  const [supportFiles, setSupportFiles] = useState<[]>([]);
  const [countries, setCountries] = useState<IGenericData[]>([]);
  const [responsibles, setResponsibles] = useState<IUserManageEntity[]>([]);
  const [departments, setDepartments] = useState<IGenericData[]>([]);
  const [municipalities, setMunicipalities] = useState<IGenericData[]>([]);
  const [responseTypes, setResponseTypes] = useState<IResposeType[]>([]);
  const [factors, setFactors] = useState<IFactor[]>([]);
  const [responseMediums, setResponseMediums] = useState<IResponseMedium[]>([]);
  const [workEntityTypes, setWorkEntityTypes] = useState<IWorkEntityType[]>([]);
  const [requestTypes, setRequestTypes] = useState<IRequestType[]>([]);
  const [legalEntityTypes, setLegalEntityTypes] = useState<ILegalEntityType[]>([]);
  const [requestSubjectTypes, setRequestSubjectTypes] = useState<IRequestSubjectType[]>([]);
  const [motives, setMotives] = useState<IMotive[]>([]);
  const [dependencies, setDependencies] = useState<IDependence[]>([]);  
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });

  const navigate = useNavigate();

  const checkMobileScreen = useCheckMobileScreen();

  const pqrsdfService = usePqrsdfService();
  const citizenAttentionService = useCitizenAttentionService();
  const workEntityService = useWorkEntityService();
  const service = { ...citizenAttentionService, ...pqrsdfService, ...workEntityService };

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
    watch,
  } = useForm({ mode: "all" });

  const watchResponseTypeId = watch("responseTypeId");

  const checkIsFilled = () => {
    const personKeys = Object.keys(getValues("person"));
    const personValues = personKeys
      .map((key) => {
        return { key: key, val: getValues("person." + key) };
      })
      .filter((property) => {
        let initialValue = pqrsdfData?.person?.[property.key];
        if (property.key == "birthdate") {
          property.val = toLocaleDate(property.val).getTime();
          initialValue = toLocaleDate(pqrsdfData?.person?.[property.key]).getTime();
        }
        return property.val != null && property.val != "" && property.val != undefined && property.val != initialValue;
      });
    const values = Object.values(getValues()).filter((val) => val != null && val != "" && val != undefined);

    setIsFilled(!!values.length && !!personValues.length);
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
      let payload = values as IPqrsdf;
      payload.id = parseInt(id);
      const response = await pqrsdfService.pqrsdfResponse(payload, fileResponsePqrsdf, supportFiles);

      if (response.operation.code === EResponseCodes.OK) {
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Envío exitoso</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                Respuesta enviada satisfactoriamente
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Cerrar",
          footer: (options) => acceptButton(options),
        });        
        navigate(-1);
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
      { method: "getFactors", isAux: false, setData: setFactors },
      { method: "getPrograms", isAux: false, setData: setPrograms },
      { method: "getCountries", isAux: false, setData: setCountries },
      { method: "getDependencies", isAux: false, setData: setDependencies },
      { method: "getRequestTypes", isAux: false, setData: setRequestTypes },
      { method: "getResponseTypes", isAux: false, setData: setResponseTypes },
      { method: "getResponseMediums", isAux: false, setData: setResponseMediums },
      { method: "getWorkEntityTypes", isAux: false, setData: setWorkEntityTypes },
      { method: "getLegalEntityTypes", isAux: false, setData: setLegalEntityTypes },
    ];

    toFetch.forEach((currentFetch) => {
      let fetchData = async () => {
        setLoading(true);
        try {
          const response = await service[currentFetch.method]();
          if (currentFetch.isAux) {
            const auxResponse = JSON.parse(JSON.stringify(response));
            if (auxResponse.status === true) {
              response.data.pop();
              currentFetch.setData(response.data);
            }
          } else if (response.operation.code === EResponseCodes.OK) {
            if (currentFetch.method == "getSeviceChannels") {
              response.data.pop();
            }
            currentFetch.setData(response.data);
          }
        } catch (error) {
          console.error("Error al obtener la lista:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    });

    const fetchPqrsdf = async (id: number) => {
      setLoading(true);
      try {
        const response = await pqrsdfService.getPqrsdfById(id);

        if (response.operation.code === EResponseCodes.OK) {
          setPqrsdfData(response.data);
          console.log(response.data);
          let pqrsdf = response.data;
          /* setValue("aso_asunto", pqrsdf.aso_asunto);
          setValue("requestObjectId", pqrsdf.requestObjectId);
          setValue(
            "programId",
            pqrsdf.programs.map((program) => {
              return program.prg_codigo;
            })
          ); */
        } else {
          navigate(-1);
        }
      } catch (error) {
        navigate(-1);
        console.error("Error al obtener la pqrsdf:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPqrsdf(parseInt(id));

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const setInitialForm = async () => {
    const pqrsdf = pqrsdfData;
    //Id columns
    setValue("requestTypeId", pqrsdf?.requestTypeId);
    setValue("identification", pqrsdf?.person?.documentType?.itemCode + " " + pqrsdf?.person?.identification);
    setValue("person.entityTypeId", pqrsdf?.person?.entityTypeId);
    //Citizen information
    setValue("person.firstName", pqrsdf?.person?.firstName);
    setValue("person.secondName", pqrsdf?.person?.secondName);
    setValue("person.firstSurname", pqrsdf?.person?.firstSurname);
    setValue("person.secondSurname", pqrsdf?.person?.secondSurname);
    setValue("person.businessName", pqrsdf?.person?.businessName);
    setValue("person.email", pqrsdf?.person?.email);
    setValue("person.firstContactNumber", pqrsdf?.person?.firstContactNumber);
    setValue("person.secondContactNumber", pqrsdf?.person?.secondContactNumber);
    setValue("person.birthdate", toLocaleDate(pqrsdf?.person?.birthdate));
    setValue("person.address", pqrsdf?.person?.address);
    setValue("person.countryId", pqrsdf?.person?.countryId);
    const country = countries.filter((country) => country.id == pqrsdf?.person?.countryId)[0];
    const auxDepartments = await getDepartments(country);
    const department = auxDepartments.filter((department) => department.id == pqrsdf?.person?.departmentId)[0];
    setValue("person.departmentId", pqrsdf?.person?.departmentId);
    await getMunicipalities(department);
    setValue("person.municipalityId", pqrsdf?.person?.municipalityId);
    setValue("responseMediumId", pqrsdf?.responseMediumId);
    //Request information
    setValue("programId", pqrsdf?.programId);
    await setRequestSubjectTypesByProgram(pqrsdf?.programId);
    setValue("requestSubjectId", pqrsdf?.requestSubjectId);
    setValue("programClasification", pqrsdf?.program?.clpClasificacionPrograma?.[0].clp_descripcion);
    setValue("programDependence", pqrsdf?.program?.depDependencia?.dep_descripcion);
    setValue("description", pqrsdf?.description);
    setValue("file", [pqrsdf?.file]);
    setInitDataLoaded(true);
  };

  useEffect(() => {
    if (pqrsdfData) {
      setInitialForm();
    }
  }, [pqrsdfData]);

  useEffect(() => {
    if (initDataLoaded) {
      checkIsFilled();
      trigger();
    }
  }, [initDataLoaded]);

  const resetForm = () => {
    const allInputs = [...columns(), ...columnsId()];
    const toResetArray = allInputs.map((column) => {
      return [column.key, ""];
    });
    reset(Object.fromEntries(toResetArray), { keepValues: false, keepErrors: false });
    checkIsFilled();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : "";
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
        options: /* serviceChannels */ [],
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: (value) => {
          /* const channel = serviceChannels.filter((channel) => channel.cna_codigo == value)[0];
          setDetailServiceChannels(channel?.details ? channel.details : []);
          setValue("detailServiceChannelId", ""); */
        },
      },
      {
        name: "Elija ¿Cuál?",
        type: "select",
        key: "detailServiceChannelId",
        formClass: "w-1/3",
        optionLabel: "cad_nombre",
        optionValue: "cad_codigo",
        options: /* detailServiceChannels */ [],
        disabled: !initDataLoaded || ![]?.length,
        rules: {
          required: "El campo es obligatorio.",
        },
      },
    ];
  };

  const columnsId = () => {
    return [
      {
        name: "Tipo de solicitud",
        type: "select",
        key: "requestTypeId",
        formClass: "col-span-full sm:col-span-2",
        optionLabel: "tso_description",
        optionValue: "tso_codigo",
        options: requestTypes,
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "Doc. Identidad",
        key: "identification",
        field: "identification",
        formClass: "col-span-full sm:col-span-2",
        hidden: () => {
          return false;
        },
        disabled: !initDataLoaded || true,
        rules: {
          maxLength: { value: 15, message: "Solo se permiten 15 caracteres." },
        },
      },
      {
        name: "Tipo de entidad",
        type: "select",
        key: "person.entityTypeId",
        formClass: "col-span-full sm:col-span-2",
        optionLabel: "tej_nombre",
        optionValue: "tej_codigo",
        options: legalEntityTypes,
        hidden: () => {
          return pqrsdfData?.person?.documentTypeId != EDocumentTypes.NIT;
        },
        rules: {
          validate: {
            required: requiredIfNit,
          },
        },
      },
    ];
  };

  const requiredIfNit = (value) => {
    if (pqrsdfData?.person?.documentTypeId == EDocumentTypes.NIT && !value) return "El campo es obligatorio.";
    return true;
  };
  const requiredIfNotNit = (value) => {
    if (
      pqrsdfData?.person?.documentTypeId != EDocumentTypes.NIT &&
      pqrsdfData?.person?.documentTypeId != EDocumentTypes.AN &&
      !value
    )
      return "El campo es obligatorio.";
    return true;
  };

  const isNit = (withNit: boolean = true) => {
    return withNit
      ? pqrsdfData?.person?.documentTypeId == EDocumentTypes.NIT ||
          pqrsdfData?.person?.documentTypeId == EDocumentTypes.AN
      : pqrsdfData?.person?.documentTypeId == EDocumentTypes.AN;
  };

  const getDepartments = async (country?: IGenericData) => {
    let departments: IGenericData[] = [];
    if (country) {
      setLoading(true);
      try {
        const response = await service.getDepartments(parseInt(country.itemCode));
        if (response.operation.code === EResponseCodes.OK) {
          departments = response.data;
          setDepartments(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        setLoading(false);
      }
    }
    return departments;
  };

  const getMunicipalities = async (department?: IGenericData) => {
    let municipalities: IGenericData[] = [];
    if (department) {
      setLoading(true);
      try {
        const response = await service.getMunicipalities(parseInt(department.itemCode));
        if (response.operation.code === EResponseCodes.OK) {
          municipalities = response.data;
          setMunicipalities(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        setLoading(false);
      }
    }
    return municipalities;
  };

  const getResponsibles = async (workEntityTypeId: number) => {
    let responsibles: IUserManageEntity[] = [];
    if (workEntityTypeId) {
      setLoading(true);
      try {
        const response = await service.getEntityManagersByEntityTypeId(workEntityTypeId);
        if (response.operation.code === EResponseCodes.OK) {
          responsibles = response.data;
          setResponsibles(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        setLoading(false);
      }
    }
    return responsibles;
  };

  const getPersonData = (): IPerson => {
    let person: IPerson = getValues("person") as IPerson;
    person.id = pqrsdfData?.personId;
    person.identification = pqrsdfData?.person?.identification;
    person.documentTypeId = pqrsdfData?.person?.documentTypeId;
    person.entityTypeId = pqrsdfData?.person?.entityTypeId;
    return person;
  };

  const updatePerson = async () => {
    setLoading(true);
    try {
      const personData: IPerson = getPersonData();

      const response = await pqrsdfService.updatePerson(personData);

      if (response.operation.code === EResponseCodes.OK) {
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Actualización exitosa</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                ¡Información actualizada con éxito!
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Cerrar",
          footer: (options) => acceptButton(options),
        });
      }
    } catch (error) {
      console.error("Error al editar la información del ciudadano", error);
    } finally {
      setLoading(false);
    }
  };

  const isPersonChange = () => {
    if (initDataLoaded) {
      const personKeys = Object.keys(getValues("person"));
      const values = personKeys
        .map((key) => {
          return { key: key, val: getValues("person." + key) };
        })
        .filter((property) => {
          let initialValue = pqrsdfData?.person?.[property.key];
          if (property.key == "birthdate") {
            property.val = toLocaleDate(property.val).getTime();
            initialValue = toLocaleDate(pqrsdfData?.person?.[property.key]).getTime();
          }
          return (
            property.val != null && property.val != "" && property.val != undefined && property.val != initialValue
          );
        });
      setIsUpdatePerson(!!values.length);
    }
  };

  const setRequestSubjectTypesByProgram = async (programId) => {
    const program = programs.filter((program) => program.prg_codigo == programId)[0];
    const optionsRequestSubjectTypes = program?.affairs
      ? program.affairs.map((affair) => {
          return {
            aso_codigo: affair.aso_codigo,
            aso_asunto: affair.aso_asunto,
          };
        })
      : [];
    setValue("programClasification", program?.clpClasificacionPrograma?.[0].clp_descripcion);
    setValue("programDependence", program?.depDependencia?.dep_descripcion);
    setRequestSubjectTypes(optionsRequestSubjectTypes);
    setValue("requestSubjectId", "");
  };

  const columnsRequest = () => {
    return [
      {
        name: "Programa al que aplica la solicitud",
        type: "select",
        key: "programId",
        formClass: "col-span-full md:col-span-7 xl:col-span-6 2xl:col-span-4",
        optionLabel: "prg_descripcion",
        optionValue: "prg_codigo",
        options: programs,
        disabled: !initDataLoaded || !programs.length || loading,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: (value) => {
          setRequestSubjectTypesByProgram(value);
        },
      },
      {
        name: "Asunto de la solicitud",
        type: "select",
        key: "requestSubjectId",
        formClass: "col-span-full md:col-span-5 xl:col-span-4",
        optionLabel: "aso_asunto",
        optionValue: "aso_codigo",
        options: requestSubjectTypes,
        disabled: !initDataLoaded || !requestSubjectTypes?.length || loading,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: (value) => {
          const requestSubjectType = requestSubjectTypes.filter(
            (requestSubjectType) => requestSubjectType.aso_codigo == value
          )[0];
          setMotives(requestSubjectType?.motives);
          setValue("motiveId", "");
        },
      },
      {
        name: "Motivo de la solicitud",
        type: "select",
        key: "motiveId",
        formClass: "col-span-full md:col-span-6 lg:col-span-4",
        optionLabel: "motive",
        optionValue: "id",
        options: motives,
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return !motives?.length;
        },
        rules: {
          validate: {
            required: () => {
              if (motives?.length) return "El campo es obligatorio.";
              return true;
            },
          },
        },
      },
      {
        name: "Clasificación",
        key: "programClasification",
        field: "programClasification",
        formClass: "col-span-full md:col-span-6",
        hidden: () => {
          return false;
        },
        disabled: !initDataLoaded || true,
      },
      {
        name: "Dependencia",
        key: "programDependence",
        field: "programDependence",
        formClass: "col-span-full md:col-span-6",
        hidden: () => {
          return false;
        },
        disabled: !initDataLoaded || true,
      },
      {
        type: "textarea",
        name: "Descripción",
        key: "description",
        field: "description",
        placeholder: "Escribe aquí",
        formClass: "col-span-full",
        rules: {
          maxLength: { value: 5000, message: "Solo se permiten 5000 caracteres." },
        },
        counter: true,
        hidden: () => {
          return false;
        },
        disabled: !initDataLoaded || true,
      },
      {
        type: "files",
        name: "Archivos o documentos que soportan la solicitud",
        key: "file",
        formClass: "col-span-full",
        files: getValues("file"),
        hidden: () => {
          return false;
        },
      },
    ];
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

  const columns = () => {
    return [
      {
        name: "Primer nombre",
        key: "person.firstName",
        field: "firstName",
        formClass: "col-span-full sm:col-span-3 sm:col-start-1",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit();
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          validate: {
            required: requiredIfNotNit,
          },
          maxLength: { value: 50, message: "Solo se permiten 50 caracteres." },
        },
      },
      {
        name: "Segundo nombre",
        key: "person.secondName",
        field: "secondName",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit();
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          maxLength: { value: 50, message: "Solo se permiten 50 caracteres." },
        },
      },
      {
        name: "Primer apellido",
        key: "person.firstSurname",
        field: "firstSurname",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit();
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          validate: {
            required: requiredIfNotNit,
          },
          maxLength: { value: 50, message: "Solo se permiten 50 caracteres." },
        },
      },
      {
        name: "Segundo apellido",
        key: "person.secondSurname",
        field: "secondSurname",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit();
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          maxLength: { value: 50, message: "Solo se permiten 50 caracteres." },
        },
      },
      {
        name: "Razón social",
        key: "person.businessName",
        field: "businessName",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return pqrsdfData?.person?.documentTypeId != EDocumentTypes.NIT;
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          validate: {
            required: requiredIfNit,
          },
          maxLength: { value: 200, message: "Solo se permiten 200 caracteres." },
        },
      },
      {
        name: "Fecha de nacimiento",
        key: "person.birthdate",
        field: "birthdate",
        type: "date",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit();
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "No. De contacto 1",
        key: "person.firstContactNumber",
        field: "firstContactNumber",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit(false);
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 10, message: "Solo se permiten 10 caracteres." },
        },
      },
      {
        name: "No. De contacto 2",
        key: "person.secondContactNumber",
        field: "secondContactNumber",
        formClass: "col-span-full sm:col-span-3",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit(false);
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          maxLength: { value: 10, message: "Solo se permiten 10 caracteres." },
        },
      },
      {
        name: "Correo electrónico",
        key: "person.email",
        field: "email",
        formClass: "col-span-full sm:col-span-6",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit(false);
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          required: "El campo es obligatorio.",
          pattern: { value: emailPattern, message: "La dirección de correo electrónico es inválida." },
          maxLength: { value: 200, message: "Solo se permiten 200 caracteres." },
        },
      },
      {
        name: "Dirección ",
        key: "person.address",
        field: "address",
        formClass: "col-span-full sm:col-span-6",
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return isNit(false);
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 300, message: "Solo se permiten 300 caracteres." },
        },
      },
      {
        name: "País",
        type: "select",
        key: "person.countryId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "itemDescription",
        optionValue: "id",
        options: countries,
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: async (value) => {
          const country = countries.filter((country) => country.id == value)[0];
          await getDepartments(country);
          setValue("departmentId", "");
          isPersonChange();
        },
      },
      {
        name: "Departamento",
        type: "select",
        key: "person.departmentId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "itemDescription",
        optionValue: "id",
        options: departments,
        disabled: !initDataLoaded || !departments?.length || loading,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: async (value) => {
          const department = departments.filter((department) => department.id == value)[0];
          await getMunicipalities(department);
          setValue("municipalityId", "");
          isPersonChange();
        },
      },
      {
        name: "Municipio",
        type: "select",
        key: "person.municipalityId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "itemDescription",
        optionValue: "id",
        options: municipalities,
        disabled: !initDataLoaded || !municipalities?.length || loading,
        hidden: () => {
          return false;
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      {
        name: "Seleccione el medio por el cual quiere recibir la respuesta",
        type: "select",
        key: "responseMediumId",
        formClass: "col-span-full md:col-span-7 xl:col-span-6",
        optionLabel: "mre_descripcion",
        optionValue: "mre_codigo",
        options: responseMediums,
        disabled: !initDataLoaded || loading,
        hidden: () => {
          return false;
        },
        onChange: async (value) => {
          isPersonChange();
        },
        rules: {
          required: "El campo es obligatorio.",
        },
      },
      //Action
      {
        type: "button",
        formClass: "col-span-full md:col-span-2 xl:col-span-6 text-right",
        hidden: () => {
          return false;
        },
        template: () => (
          <div className="mt-auto">
            <Button
              key={"updatedPerson"}
              label="Actualizar"
              rounded
              className="!px-4 !py-2 !text-base !font-sans"
              type="button"
              onClick={updatePerson}
              disabled={loading || !isUpdatePerson}
            />
          </div>
        ),
      },
    ];
  };

  const columnsResponse = () => {
    return [
      {
        name: "Tipo de respuesta",
        type: "select",
        key: "responseTypeId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "description",
        optionValue: "id",
        options: responseTypes,
        disabled: !initDataLoaded || !responseTypes.length || loading,
        hidden: () => {
          return false;
        },
        rules: {
          required: "El campo es obligatorio.",
        },
        onChange: async () => {
          if (watchResponseTypeId != 4) {
            setValue("isPetitioner", "");
          }
          if (watchResponseTypeId == 4) {
            setValue("workEntityTypeId", "");
          }
        },
      },
      {
        name: "Enviar a",
        type: "select",
        key: "workEntityTypeId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "tet_descripcion",
        optionValue: "tet_codigo",
        options: workEntityTypes,
        disabled: !initDataLoaded || !workEntityTypes?.length || loading,
        hidden: () => {
          return watchResponseTypeId == 4;
        },
        rules: {
          validate: {
            required: (value) => {
              if (watchResponseTypeId != 4 && !value) return "El campo es obligatorio.";
              return true;
            },
          },
        },
        onChange: async (value) => {
          await getResponsibles(value);
          setValue("assignedUserId", "");
        },
      },
      {
        name: "Enviar a",
        type: "select",
        key: "isPetitioner",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "label",
        optionValue: "id",
        options: [{ id: 1, label: "Peticionario" }],
        disabled: !initDataLoaded || !workEntityTypes?.length || loading,
        hidden: () => {
          return watchResponseTypeId != 4;
        },
        rules: {
          validate: {
            required: (value) => {
              if (watchResponseTypeId == 4 && !value) return "El campo es obligatorio.";
              return true;
            },
          },
        },
      },
      {
        name: "Responsable",
        type: "select",
        key: "assignedUserId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "fullName",
        optionValue: "id",
        options: responsibles,
        disabled: !initDataLoaded || !responsibles.length || loading,
        hidden: () => {
          return watchResponseTypeId != 1 && watchResponseTypeId != 2;
        },
      },
      {
        name: "Factor",
        type: "select",
        key: "factorId",
        formClass: "col-span-full sm:col-span-3",
        optionLabel: "name",
        optionValue: "id",
        options: factors,
        disabled: !initDataLoaded || !factors.length || loading,
        hidden: () => {
          return pqrsdfData?.statusId != 10 || watchResponseTypeId == 4;
        },
        rules: {
          validate: {
            required: (value) => {
              if (pqrsdfData?.statusId == 10 && !value) return "El campo es obligatorio.";
              return true;
            },
          },
        },
      },
      {
        type: "textarea",
        name: "Observación",
        key: "observation",
        field: "observation",
        placeholder: "Escribe aquí",
        formClass: "col-span-full",
        rules: {
          required: "El campo es obligatorio.",
          maxLength: { value: 5000, message: "Solo se permiten 5000 caracteres." },
        },
        counter: true,
        hidden: () => {
          return false;
        },
        disabled: !initDataLoaded,
      },
      {
        type: "file",
        key: "responseFile",
        formClass: "col-span-full",
        hidden: () => {
          return false;
        },
      },
      {
        type: "button",
        formClass: "col-span-full w-full",
        hidden: () => {
          return false;
        },
        template: () => {
          return (
            <div className="flex w-full gap-x-3 justify-end col-span-full">
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
                label="Enviar"
                rounded
                className="!px-4 !py-2 !text-base !font-sans"
                type="submit"
                disabled={loading || !isValid}
              />
            </div>
          );
        },
      },
    ];
  };

  const columnsTemplate = (column) => {
    return (
      !column?.hidden() && (
        <div key={column.key + "_wrapp"} className={classNames("flex flex-col gap-y-1.5", column?.formClass)}>
          {column?.type != "button" && column?.type != "files" && column?.type != "file" && (
            <Controller
              key={column.key}
              name={column.key}
              control={control}
              rules={column.rules}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="text-base">
                    {column?.name}
                    {""}
                    {(column?.rules?.required || column?.rules?.validate?.required) && (
                      <span className="text-red-600">*</span>
                    )}
                  </label>
                  {!column?.type && (
                    <InputText
                      id={field.name}
                      value={field.value}
                      placeholder={column?.placeholder}
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (column?.onChange) {
                          column.onChange(e.target.value);
                        }
                        checkIsFilled();
                      }}
                      maxLength={column?.rules?.maxLength?.value}
                      disabled={column?.disabled}
                    />
                  )}
                  {column?.type == "textarea" && (
                    <InputTextarea
                      id={field.name}
                      value={field.value}
                      placeholder={column?.placeholder}
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (column?.onChange) {
                          column.onChange(e.target.value);
                        }
                        checkIsFilled();
                      }}
                      maxLength={column?.rules?.maxLength?.value}
                      disabled={column?.disabled}
                    />
                  )}
                  {column?.type == "date" && (
                    <div className="w-full relative">
                      <Calendar
                        inputId={field.name}
                        value={field.value}
                        className={classNames({ "p-invalid": fieldState.error }, "w-full")}
                        inputClassName="w-full py-2 !font-sans pr-10"
                        placeholder="DD / MM / AAA"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          if (column?.onChange) {
                            column.onChange(e.target.value);
                          }
                          checkIsFilled();
                        }}
                        disabled={column?.disabled}
                        dateFormat="dd/mm/yy"
                      />
                      <label htmlFor={field.name} className="absolute right-4.5 top-3 pt-px">
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M9.66667 1.3335V4.00016M4.33333 1.3335V4.00016M1 6.00016H13M11.6667 2.66683H2.33333C1.59667 2.66683 1 3.2635 1 4.00016V12.6668C1 13.4035 1.59667 14.0002 2.33333 14.0002H11.6667C12.4033 14.0002 13 13.4035 13 12.6668V4.00016C13 3.2635 12.4033 2.66683 11.6667 2.66683ZM3.67533 8.48616C3.58333 8.48616 3.50867 8.56083 3.50933 8.65283C3.50933 8.74483 3.584 8.8195 3.676 8.8195C3.768 8.8195 3.84267 8.74483 3.84267 8.65283C3.84267 8.56083 3.768 8.48616 3.67533 8.48616ZM7.00867 8.48616C6.91667 8.48616 6.842 8.56083 6.84267 8.65283C6.84267 8.74483 6.91733 8.8195 7.00933 8.8195C7.10133 8.8195 7.176 8.74483 7.176 8.65283C7.176 8.56083 7.10133 8.48616 7.00867 8.48616ZM10.342 8.48616C10.25 8.48616 10.1753 8.56083 10.176 8.65283C10.176 8.74483 10.2507 8.8195 10.3427 8.8195C10.4347 8.8195 10.5093 8.74483 10.5093 8.65283C10.5093 8.56083 10.4347 8.48616 10.342 8.48616ZM3.67533 11.1528C3.58333 11.1528 3.50867 11.2275 3.50933 11.3195C3.50933 11.4115 3.584 11.4862 3.676 11.4862C3.768 11.4862 3.84267 11.4115 3.84267 11.3195C3.84267 11.2275 3.768 11.1528 3.67533 11.1528ZM7.00867 11.1528C6.91667 11.1528 6.842 11.2275 6.84267 11.3195C6.84267 11.4115 6.91733 11.4862 7.00933 11.4862C7.10133 11.4862 7.176 11.4115 7.176 11.3195C7.176 11.2275 7.10133 11.1528 7.00867 11.1528Z"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </label>
                    </div>
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
                        if (column?.onChange) {
                          column.onChange(e.value);
                        }
                        checkIsFilled();
                      }}
                      disabled={column?.disabled}
                      placeholder="Seleccionar"
                    />
                  )}
                  <div className="flex">
                    {getFormErrorMessage(field.name)}
                    {column.counter && (
                      <span className="ml-auto mr-0 text-sm font-sans">
                        Max {column?.rules?.maxLength?.value} caracteres
                      </span>
                    )}
                  </div>
                </>
              )}
            />
          )}
          {column?.type == "button" && column?.template()}
          {column?.type == "files" &&
            column?.files?.map((file: IFile) => (
              <div className="w-full flex flex-wrap" key={column?.key}>
                <label className="text-base w-full">{column?.name}</label>
                <a
                  className="font-medium text-red-600 mt-3 ml-1"
                  href={"https://storage.cloud.google.com/" + splitUrl(file?.name).namepath}
                  target="_blank"
                >
                  {splitUrl(file?.name).fileName}
                </a>
              </div>
            ))}
          {column?.type == "file" && (
            <div className="col-1 col-100 seeker">
              <div className="mr-2">
                <Dialog
                  visible={visibleDialog}
                  style={{ width: "50vw" }}
                  onHide={() => setVisibleDialog(false)}
                  closeIcon={closeIcon}
                  className="dialog-manage"
                >
                  <UploadManagetComponent
                    multiple={false}
                    statusDialog={(e) => {
                      setVisibleDialog(e);
                    }}
                    getNameFile={(e) => setFileName(e)}
                    filesSupportDocument={(e) => {
                      const docuement = e.map((file) => {
                        return {
                          file,
                        };
                      });
                      setFileResponsePqrsdf(docuement[0].file);
                    }}
                  />
                </Dialog>
                <div className="grid w-full">
                  <Button
                    label="Adjuntar archivos"
                    className="flex flex-row-reverse w-44 !p-0 !font-medium !text-base"
                    onClick={() => setVisibleDialog(true)}
                    text
                    icon={
                      <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M7.99984 5.83334V11.1667"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.6668 8.49999H5.3335"
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
                      </i>
                    }
                  />

                  {fileResponsePqrsdf !== null ? (
                    <div className="flex space-x-4">
                      <div className="text-red-600 text-xl">{fileName}</div>
                      <div>
                        <Button icon={showIcon} rounded text onClick={() => handleFileView(fileResponsePqrsdf)} />
                      </div>
                      <div>
                        <Button
                          icon={trashIcon}
                          rounded
                          text
                          severity="danger"
                          onClick={() => setFileResponsePqrsdf(null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    );
  };

  const switchPetitioner = (data) => {
    const [checked, setChecked] = useState(false);
    return (
      <>
        <div className="flex justify-center items-center">
          <div>NO</div>
          <div className="flex  ml-4 mr-4">
            <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
          </div>
          <div>SI</div>
        </div>
      </>
    );
  };

  const selectFileToDelete = (element: InfoTable) => {
    let _data = tableData.filter((val) => val.id !== element.id);
    setTableData(_data);
  };

  const handleFileView = (file: Blob) => {
    console.log(typeof file);
    if (file.type.includes("image")) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    } else {
      const reader = new FileReader();
      // Lee el contenido del archivo como un URL de datos
      reader.onloadend = () => {
        const fileDataUrl = reader.result;

        // Abre una nueva ventana con el contenido del archivo
        const newWindow = window.open();
        newWindow.document.write(`<iframe width="100%" height="100%" src="${fileDataUrl}"></iframe>`);
      };

      reader.readAsDataURL(file);
    }
  };

  const iconActions = (data: InfoTable) => {
    return (
      <>
        <div className="flex justify-center items-center">
          <div className="mr-4">
            <Link to={""} onClick={() => handleFileView(data.action)}>
              <Tooltip target=".custom-target-icon" style={{ borderRadius: "1px" }} />
              <i
                className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                data-pr-tooltip="Ver adjunto"
                data-pr-position="right"
              >
                {showIcon}
              </i>
            </Link>
          </div>
          <div className="ml-4">
            <Link to={""} onClick={() => selectFileToDelete(data)}>
              <Tooltip target=".custom-target-icon" style={{ borderRadius: "1px" }} />
              <i
                className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                data-pr-tooltip="Eliminar"
                data-pr-position="right"
              >
                {trashIcon}
              </i>
            </Link>
          </div>
        </div>
      </>
    );
  };

  const accordionTabs = () => {
    return [
      {
        key: "informacion_del_ciudadano",
        header: "Información del ciudadano",
        wrapperClass:
          "grid grid-cols-6 md:grid-cols-9 xl:grid-cols-12 md:gap-x-4.5 gap-x-3.5 gap-y-6 md:gap-y-4 w-full",
        columns: columns(),
      },

      {
        key: "informacion_de_la_solicitud",
        header: "Información de la solicitud",
        wrapperClass: "grid grid-cols-6 md:grid-cols-12 md:gap-x-4.5 gap-x-3.5 gap-y-6 md:gap-y-4 w-full",
        columns: columnsRequest(),
      },

      //Support files
      {
        key: "documento_de_apoyo_interno",
        header: "Documento de apoyo interno",
        wrapperClass: "block w-full overflow-x-auto",
        template: () => {
          return (
            <>
              <div className="flex flex-row items-center justify-between mb-8 header-movil">
                <div className="col-1 col-100 seeker">
                  <div className="mr-2">
                    <Dialog
                      visible={visibleDialog}
                      style={{ width: "50vw" }}
                      onHide={() => setVisibleDialog(false)}
                      closeIcon={closeIcon}
                      className="dialog-manage"
                    >
                      <UploadManagetComponent
                        getNameFile={(e) => {}}
                        filesSupportDocument={(e) => {
                          setSupportFiles(e);
                          let count = 0;
                          const documents = e.map((file) => {
                            count = count + 1;
                            return {
                              user: authorization.user.names + " " + authorization.user.lastNames,
                              visiblePetitioner: false,
                              action: file,
                              id: count,
                            };
                          });
                          setTableData(documents);
                        }}
                        statusDialog={(e) => {
                          setVisibleDialog(e);
                        }}
                      />
                    </Dialog>
                    <Button
                      label="Adjuntar archivos"
                      className="flex flex-row-reverse w-52"
                      onClick={() => setVisibleDialog(true)}
                      text
                      icon={
                        <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center">
                          <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.99984 5.83334V11.1667"
                              stroke="#533893"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.6668 8.49999H5.3335"
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
                        </i>
                      }
                    />
                  </div>
                  <div></div>
                </div>
                <div className="flex flex-row items-center tittle-header-movil">
                  <div className=" mr-4 flex items-center total">
                    <div>
                      <label className="mr-2 text-base total">Total de resultados</label>
                    </div>
                    <div>
                      <span className="text-black flex items-center bold big">{tableData.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center pagination-p">
                    <div>
                      <label className="mr-2 p-colorpicker">Registro por página</label>
                    </div>
                    <div>
                      <Dropdown
                        id="per_page"
                        value={perPage}
                        className={"w-12 !font-sans select-xs"}
                        panelClassName="select-xs"
                        optionLabel="value"
                        options={[
                          { value: 1 },
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
              <div className="overflow-hidden max-w-[calc(111vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] block md:block borderless reverse-striped">
                <DataTable
                  value={tableData}
                  paginator
                  paginatorClassName="!border-0"
                  paginatorTemplate={paginatorTemplate()}
                  rows={perPage}
                  stripedRows
                  selectionMode="single"
                  dataKey="id"
                  scrollable
                >
                  <Column
                    style={{ textAlign: "center" }}
                    className="!font-sans md:min-w-[320px] md:w-80 md:max-w-[320px] min-w[144px] max-w-[144px] w-36"
                    field="user"
                    header="Usuario"
                    headerClassName="!text-black font-medium md:min-w-[320px] md:w-80 md:max-w-[320px] min-w[144px] max-w-[144px] w-36"
                  ></Column>
                  <Column
                    style={{ textAlign: "center" }}
                    className="!font-sans md:min-w-[320px] md:w-80 md:max-w-[320px] min-w[144px] max-w-[144px] w-36"
                    field="visiblePetitioner"
                    headerClassName="!text-black font-medium md:min-w-[320px] md:w-80 md:max-w-[320px] min-w[144px] max-w-[144px] w-36"
                    header="Visible para peticionario"
                    body={switchPetitioner}
                  ></Column>
                  <Column
                    field="action"
                    className="!font-sans text-center md:min-w-[320px] md:w-80 md:max-w-[320px] min-w[144px] max-w-[144px] w-36"
                    headerClassName="!text-black font-medium text-center md:min-w-[320px] md:w-80 md:max-w-[320px] min-w[144px] max-w-[144px] w-36"
                    header="Acción"
                    body={iconActions}
                  ></Column>
                </DataTable>
              </div>
            </>
          );
        },
      },
      //Pqrsdf response
      {
        key: "respuesta_pqrsdf",
        header: "Respuesta PQRSDF " + (pqrsdfData?.filingNumber ? pqrsdfData?.filingNumber : ""),
        wrapperClass:
          "grid grid-cols-6 md:grid-cols-9 xl:grid-cols-12 md:gap-x-4.5 gap-x-3.5 gap-y-6 md:gap-y-4 w-full",
        columns: columnsResponse(),
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
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title">
            <span className="text-2xl md:text-3xl font-medium">Gestionar PQRDSF</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 mt-4 md:mt-7">
            <div className="px-4">
              <div className="border-b border-[#DEE2E6] w-full flex text-[19px] font-medium text-center">
                <span className="h-12 max-w-[184px] w-full border-b border-primary leading-6 px-1 text-primary">
                  Gestionar solicitudes
                </span>
                <Link
                  to={"/atencion-ciudadana/gestionar-pqrsdf?tab=2"}
                  className="h-12 max-w-[184px] w-full text-[#6C757D] leading-[23px] px-1"
                >
                  Respuestas a la solicitud
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-6 xl:gap-x-12 md:gap-x-4.5 gap-x-3.5 gap-y-6 w-full mt-5 pt-1.5 md:mt-20">
              {columnsId().map((column, index) => {
                return columnsTemplate(column);
              })}
            </div>
            <div className="w-full mt-4 md:mt-8 md:pt-0.5 citizen-attention">
              <Accordion activeIndex={3}>
                {accordionTabs().map((tab, index) => {
                  return (
                    <AccordionTab header={tab.header} key={tab.key}>
                      <div className={tab.wrapperClass}>
                        {tab?.columns
                          ? tab.columns.map((column, index) => {
                              return columnsTemplate(column);
                            })
                          : tab?.template()}
                      </div>
                    </AccordionTab>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FormManagePqrsdfPage;
