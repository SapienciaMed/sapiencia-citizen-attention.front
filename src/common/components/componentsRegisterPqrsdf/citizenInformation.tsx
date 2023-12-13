import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fetchData } from "../../apis/fetchData";

import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { classNames } from "primereact/utils";
import { usePqrsdfService } from "../../hooks/PqrsdfService.hook";
import { FormPqrsdf, IPqrsdf } from "../../interfaces/pqrsdf.interfaces";
import { toLocaleDate } from "../../utils/helpers";
import { DropDownComponent } from "./dropDownComponent";
import { InputTextComponent } from "./inputTextComponent";
import { CnputTextareaComponent } from "./inputTextarea.component";
import { ScrollPanelComponent } from "./scrollPanelComponent";
import { TriStateCheckboxComponent } from "./triStateCheckboxComponent";
import { UploadComponent } from "./uploadComponent";
import { trashIcon } from "../icons/trash";
import { useCitizenAttentionService } from "../../hooks/CitizenAttentionService.hook";
import { EResponseCodes } from "../../constants/api.enum";
import { IProgram } from "../../interfaces/program.interfaces";
import { IRequestSubjectType } from "../../interfaces/requestSubjectType.interfaces";
import { IGenericData } from "../../interfaces/genericData.interfaces";
import { IPerson } from "../../interfaces/person.interfaces";

const ApiDatatypoSolicitudes = fetchData("/get-type-solicituds");
const ApiDatatypoDocument = fetchData("/get-type-docuement");
const ApiDatalegalEntity = fetchData("/get-legal-entity");
const ApiDataResponseMedium = fetchData("/get-response-medium");
const ApiDataListaParametros = fetchData("/get-listaParametros");

interface Props {
  isPerson?: boolean;
  channel?: object;
  resetChanel?: () => void;
}

interface IChannel {
  channels?: string;
  attention?: string;
  isValid?: boolean;
}

export const CitizenInformation = ({ isPerson = false, channel, resetChanel }: Props) => {
  const channels = channel as IChannel;

  const location = useLocation();
  const isPortal = location.pathname.includes("portal");
  const navigate = useNavigate();
  const optionSolicitudes = ApiDatatypoSolicitudes.read();
  const optionTypeDocument = ApiDatatypoDocument.read();
  const optionLegalEntity = ApiDatalegalEntity.read();
  const optionResponseMedium = ApiDataResponseMedium.read();
  const linkPoliticaCondiciones = ApiDataListaParametros.read();
  const { LPA_VALOR } = linkPoliticaCondiciones[0];

  const pqrsdfService = usePqrsdfService();
  const citizenInformationService = useCitizenAttentionService();

  const {
    control,
    formState: { errors, isValid, dirtyFields },
    handleSubmit,
    getFieldState,
    setValue,
    reset,
    resetField,
    getValues,
    watch,
    register,
  } = useForm({ mode: "all" });

  const watchCountry = watch("pais");
  const watchDeparment = watch("departamento");

  const showFieldPersons = useRef("");
  const showDependecia = useRef("");
  const showClasificacion = useRef("");
  const showMupio = useRef(null);
  const radicado = useRef(null);
  const birthdateData = useRef(null);

  const [personData, setPersonData] = useState<IPerson | null>();
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [requestSubjectTypes, setRequestSubjectTypes] = useState<IRequestSubjectType[]>([]);
  const [valueTypeSolicitud, setValueTypeSolicitud] = useState(null);
  const [valueDocument, setValueDocument] = useState(null);
  const [valueTypeEntidad, setValueTypeEntidad] = useState(null);
  const [valuePais, setValuePais] = useState(null);
  const [valueDepartamento, setValueDepartamento] = useState(null);
  const [valueMunicipio, setValueMunicipio] = useState(null);
  const [valueMedioRespuesta, setValueMedioRespuesta] = useState(null);
  const [valueAsunto, setValueAsunto] = useState(null);
  const [statuscheckBox, setstatuscheckBox] = useState(null);
  const [program, setprogram] = useState(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [file, setfile] = useState<File>(null);
  const [visibleMsg, setVisibleMsg] = useState(null);
  const [name, setName] = useState("");
  const [clasification, setClasification] = useState("");
  const [dependence, setDependence] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondSurname, setSecondSurname] = useState("");
  const [valueIdentification, setValueIdentification] = useState("");
  const [countries, setCountries] = useState<IGenericData[]>([]);
  const [departments, setDepartments] = useState<IGenericData[]>([]);
  const [municipalities, setMunicipalities] = useState<IGenericData[]>([]);
  const [birthDate, setBirthDate] = useState<Nullable<Date>>(null);
  const [email, setEmail] = useState("");
  const [firstContactNumber, setFirstContactNumber] = useState("");
  const [secondContactNumber, setSecondContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [btnDisable, setBtnDisable] = useState("");
  const [statusSummit, SetstatusSummit] = useState<boolean>(true);

  const seleTipoDocument = (document: {
    LGE_CODIGO: number;
    LGE_ELEMENTO_CODIGO: string;
    LGE_ELEMENTO_DESCRIPCION: string;
  }) => {
    setValueDocument(document);

    showFieldPersons.current = document == null ? "" : document.LGE_ELEMENTO_DESCRIPCION;

    switch (showFieldPersons.current) {
      case "Cedula de Ciudadania":
        resetField("RazonSocial");
        setValueTypeEntidad(null);
        break;
      case "Cedula de Extranjeria":
        resetField("RazonSocial");
        setValueTypeEntidad(null);
        break;
      case "Tarjeta de Identidad":
        resetField("RazonSocial");
        setValueTypeEntidad(null);
        break;
      case "NIT":
        resetField("primerNombre");
        resetField("segundoNombre");
        resetField("primerApellido");
        resetField("segundoApellido");
        resetField("fechaNacimento");
        break;
      case "Anónimo":
        resetField("tipoEntidad");
        resetField("noDocumento");
        resetField("primerNombre");
        resetField("segundoNombre");
        resetField("primerApellido");
        resetField("segundoApellido");
        resetField("fechaNacimento");
        setValueTypeEntidad(null);
        break;

      default:
        break;
    }

    return document;
  };

  useEffect(() => {
    const fecthPrograms = async () => {
      try {
        const response = await citizenInformationService.getPrograms();
        if (response.operation.code === EResponseCodes.OK) {
          setPrograms(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        // setLoading(false);
      }
    };
    fecthPrograms();

    const fecthCountries = async () => {
      try {
        const response = await citizenInformationService.getCountries();
        if (response.operation.code === EResponseCodes.OK) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        // setLoading(false);
      }
    };
    fecthCountries();
  }, []);

  const { identification } = useParams();

  useEffect(() => {
    const getUser = async (identification: string) => {
      try {
        const response = await pqrsdfService.getPersonByDocument(parseInt(identification));
        if (response.operation.code === EResponseCodes.OK) {
          setPersonData(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        // setLoading(false);
      }
    };
    if (identification) {
      getUser(identification);
    }
  }, [identification]);

  useEffect(() => {
    if (channels.isValid && isValid) {
      SetstatusSummit(false);
    } else {
      SetstatusSummit(true);
    }
  }, [channels.isValid]);

  useEffect(() => {
    if (channels.isValid && isValid) {
      SetstatusSummit(false);
    } else {
      SetstatusSummit(true);
    }
  }, [isValid]);

  const selectCountry = async (countryId, childReset = true) => {
    const country = countries.filter((country) => country.id == countryId)[0];
    if (childReset) {
      setValue("departamento", "");
    }
    let departments = await getDepartments(country);

    return { parent: country, childs: departments };
  };

  const selectDepartment = async (departmentId, preData = [], childReset = true) => {
    const department = (preData.length ? preData : departments).filter(
      (department) => department.id == departmentId
    )[0];
    if (childReset) {
      setValue("municipio", "");
    }
    let municipalities = await getMunicipalities(department);

    return { parent: department, childs: municipalities };
  };

  const selectMunicipality = (municipio: { LGE_CODIGO: number; LGE_ELEMENTO_DESCRIPCION: string }) => {
    setValueMunicipio(municipio);

    return municipio;
  };

  const getDepartments = async (country?: IGenericData) => {
    let departments: IGenericData[] = [];
    if (country) {
      // setLoading(true);
      try {
        const response = await service.getDepartments(country.itemCode);
        if (response.operation.code === EResponseCodes.OK) {
          departments = response.data;
          setDepartments(response.data);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        // setLoading(false);
      }
    }
    return departments;
  };

  const service = useCitizenAttentionService();

  const getMunicipalities = async (department?: IGenericData) => {
    let municipalities: IGenericData[] = [];
    if (department) {
      // setLoading(true);
      try {
        const response = await service.getMunicipalities(parseInt(department.itemCode));
        if (response.operation.code === EResponseCodes.OK) {
          municipalities = response.data;
          setMunicipalities(response.data);
        } else {
          setMunicipalities([]);
        }
      } catch (error) {
        console.error("Error al obtener la lista:", error);
      } finally {
        // setLoading(false);
      }
    }
    return municipalities;
  };

  const selectProgram = (programId) => {
    const program = programs.filter((program) => program.prg_codigo == programId)[0];
    const optionsRequestSubjectTypes = program?.affairs ? program.affairs : [];
    setClasification(program?.clpClasificacionPrograma?.[0]?.clp_descripcion);
    setDependence(program?.depDependencia?.dep_descripcion);
    setRequestSubjectTypes(optionsRequestSubjectTypes);
    setValue("asuntoSolicitud", "");
  };

  const selectResponseMedium = (respuesta: { MRE_CODIGO: number; MRE_DESCRIPCION: string }) => {
    setValueMedioRespuesta(respuesta);

    return respuesta;
  };

  const selectRequestSubject = (respuesta: { ASO_CODIGO: number; ASO_ASUNTO: string }) => {
    setValueAsunto(respuesta);

    return respuesta;
  };

  const [fileaa, setFileaa] = useState(null);

  const handleFileView = () => {
    if (fileaa) {
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

  const getFile = (file: File) => {
    setfile(file);
    setFileaa(file);
    return file;
  };

  const checkBox = (dato: { status: boolean | null }) => {
    setstatuscheckBox(dato);

    const estado = dato ? true : null;

    return estado;
  };

  useEffect(() => {
    if (identification && personData) {
      setBtnDisable("input-desabled");
      const setInitialData = async () => {
        const user = personData;

        setValue("tipo", "tipo", { shouldDirty: true });
        setValue("fechaNacimento", "fechaNacimento", { shouldDirty: true });

        setName(user?.firstName);
        setValue("primerNombre", user?.firstName, { shouldDirty: true });
        setLastName(user?.firstSurname);
        setValue("primerApellido", user?.firstSurname, { shouldDirty: true });
        setSecondName(user?.secondName);
        setValue("segundoNombre", user?.secondName, { shouldDirty: true });
        setSecondSurname(user?.secondSurname);
        setValue("segundoApellido", user?.secondSurname, { shouldDirty: true });
        seleTipoDocument({
          LGE_CODIGO: user?.documentType?.id,
          LGE_ELEMENTO_CODIGO: user?.documentType?.itemCode,
          LGE_ELEMENTO_DESCRIPCION: user?.documentType?.itemDescription,
        });
        setValueIdentification(user?.identification);
        setValue("noDocumento", user?.identification, { shouldDirty: true });
        setBirthDate(toLocaleDate(user?.birthdate));
        handleDateChange(toLocaleDate(user?.birthdate));
        setEmail(user?.email);
        setValue("correoElectronico", user?.email, { shouldDirty: true });
        setFirstContactNumber(user?.firstContactNumber);
        setValue("noContacto1", user?.firstContactNumber, { shouldDirty: true });
        setSecondContactNumber(user?.secondContactNumber);
        setValue("noContacto2", user?.secondContactNumber, { shouldDirty: true });
        setAddress(user?.address);
        setValue("direccion", user?.address, { shouldDirty: true });

        setValueTypeEntidad(user?.entityType?.tej_codigo);

        const country = await selectCountry(user?.countryId, false);
        setTimeout(() => {
          setValue("pais", user?.countryId);
        }, 1000);
        await selectDepartment(user?.departmentId, country.childs, false);
        setTimeout(() => {
          setValue("departamento", user?.departmentId);
        }, 1250);
        setTimeout(() => {
          setValue("municipio", user?.municipalityId);
        }, 1500);
      };

      setInitialData();
    } else {
      setBtnDisable("");
    }
  }, [personData]);

  const handleDateChange = (date: any) => {
    setValue("fechaNacimento", date);
    const birthdate = `${date?.getFullYear()}-${date?.getMonth() + 1}-${date?.getDate()}`;
    birthdateData.current = birthdate;
    return birthdate;
  };

  const onSubmit = async (data: FormPqrsdf) => {
    const pqrsdf: IPqrsdf = {
      requestTypeId: data.tipoDeSolicitud["TSO_CODIGO"],
      responseMediumId: data.medioRespuesta["MRE_CODIGO"],
      requestSubjectId: parseInt(getValues("asuntoSolicitud")),
      clasification: clasification,
      dependency: dependence,
      description: data["Descripcion"],
      idCanalesAttencion: parseInt(channels.attention),
      person: {
        identification: data["noDocumento"],
        documentTypeId: data.tipo["LGE_CODIGO"],
        entityTypeId: getValues("tipoEntidad"),
        firstName: data["primerNombre"],
        secondName: data["segundoNombre"],
        firstSurname: data["primerApellido"],
        secondSurname: data["segundoApellido"],
        birthdate: birthdateData.current,
        firstContactNumber: data["noContacto1"],
        secondContactNumber: data["noContacto2"],
        email: data["correoElectronico"],
        address: data["direccion"],
        countryId: getValues("pais"),
        departmentId: getValues("departamento"),
        municipalityId: getValues("municipio"),
        isBeneficiary: true,
      },
      file: {
        name: file ? file.name : "",
        isActive: true,
      },
    };
    SetstatusSummit(true);
    const respFile = await pqrsdfService.upLoadFile(file);
    const resp = await pqrsdfService.createPqrsdf(pqrsdf, file);

    if (resp.operation["code"] == "OK") {
      radicado.current = resp.data.filingNumber;
      setVisibleMsg(true);
      setValueTypeSolicitud(null);
      setValueTypeEntidad(null);
      setValueMedioRespuesta(null);
      setValueAsunto(null);
      setstatuscheckBox(null);
      setprogram(null);
      setfile(null);
      showDependecia.current = "";
      showClasificacion.current = "";
      SetstatusSummit(false);
      setBirthDate(null);
      resetChanel();
      if (isPerson) {
        resetField("tipoDeSolicitud");
        resetField("politicaTratamiento");
        resetField("medioRespuesta");
        resetField("programaSolicitud");
        resetField("asuntoSolicitud");
        resetField("Descripcion");
        resetField("RazonSocial");
        resetField("archivo");
      } else {
        setValueDocument(null);
        setValuePais(null);
        setValueDepartamento(null);
        setValueMunicipio(null);
        reset();
      }
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className=" flex justify-content-center">
        <Dialog
          header="¡Registro enviado!"
          className="p-dialog-titlebar-icon"
          visible={visibleMsg}
          onHide={() => setVisibleMsg(false)}
          pt={{
            root: { className: "text-center" },
            header: { style: { color: "#5e3893", fontSize: "1.8rem" }, className: "text-3xl" },
            closeButton: { style: { color: "#5e3893", display: "none" } },
          }}
        >
          <p className="m-0 textMsg">Se ha registrado satisfactoriamente la PQRSDF</p>
          <p className="m-0 textMsg">Con número de radicado {radicado.current}</p>
          <Button
            className="mt-8"
            style={{ backgroundColor: "533893" }}
            onClick={() => {
              setVisibleMsg(false),
                navigate(isPortal ? "/portal/ingreso" : "/atencion-ciudadana/atencion-ciudadania-radicar-pqrsdf");
            }}
            label="Cerrar"
            rounded
          />
        </Dialog>
      </div>

      <div className="div-container" style={{ marginBottom: "0" }}>
        <div className="row-1 width-25">
          <label className="font-label">
            Tipo de solicitud<span className="required">*</span>
          </label>
          <Controller
            name="tipoDeSolicitud"
            control={control}
            rules={{ required: "Campo obligatorio." }}
            render={({ field, fieldState }) => (
              <>
                <Suspense fallback={<div>Cargando...</div>}>
                  <DropDownComponent
                    id={field.value}
                    value={field.value}
                    optionLabel="TSO_DESCRIPTION"
                    className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                    onChange={field.onChange}
                    focusInputRef={field.ref}
                    options={optionSolicitudes.data}
                    placeholder="Seleccionar"
                    width="100%"
                  />
                </Suspense>
              </>
            )}
          />
          {getFormErrorMessage("tipoDeSolicitud")}
        </div>

        <span className="split"></span>

        <div className="div-container width-50 div-movil-100">
          <div className="row-1 width-50">
            <label className="font-label">
              Tipo<span className="required">*</span>
            </label>
            <Controller
              name="tipo"
              defaultValue={valueDocument}
              control={control}
              rules={{ required: "Campo obligatorio." }}
              render={({ field, fieldState }) => (
                <>
                  <Suspense fallback={<div>Cargando...</div>}>
                    <DropDownComponent
                      id={field.name}
                      value={valueDocument}
                      disabled={isPerson}
                      optionLabel={"LGE_ELEMENTO_DESCRIPCION"}
                      className={classNames({ "p-invalid": fieldState.error }, `${btnDisable} !h-10`)}
                      onChange={(e) =>
                        field.onChange(() => {
                          seleTipoDocument(e.value);
                          setValue("tipo", e.value);
                        })
                      }
                      focusInputRef={field.ref}
                      options={optionTypeDocument.data}
                      placeholder="Seleccionar"
                      width="100%"
                    />
                  </Suspense>
                </>
              )}
            />
            {getFormErrorMessage("tipo")}
          </div>

          <span style={{ width: "2%" }}></span>

          {showFieldPersons.current != "Anónimo" ? (
            <>
              <div className="row-1 width-50">
                <label className="font-label">
                  No. documento<span className="required">*</span>
                </label>
                <Controller
                  name="noDocumento"
                  control={control}
                  defaultValue={valueIdentification}
                  rules={{
                    required: "Campo obligatorio.",
                    maxLength: { value: 15, message: "Solo se permiten 15 caracteres" },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        disabled={isPerson}
                        className={classNames({ "p-invalid": fieldState.error }, `${btnDisable} !h-10`)}
                        onChange={(e) =>
                          field.onChange(() => {
                            setValueIdentification(e.target.value);
                            setValue("noDocumento", e.target.value);
                          })
                        }
                        placeholder=""
                        width="100%"
                      />
                      {getFormErrorMessage("noDocumento")}
                      {/*noDocumento.length > 15?(<p className=''>Longitud 15 caracteres</p>):(<></>)*/}
                    </>
                  )}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <span className="split"></span>

        {showFieldPersons.current == "NIT" ? (
          <div className="row-1 width-25">
            <label className="font-label">
              Tipo entidad<span className="required">*</span>
            </label>
            <Controller
              name="tipoEntidad"
              control={control}
              defaultValue={valueTypeEntidad}
              rules={{ required: "Campo obligatorio." }}
              render={({ field, fieldState }) => (
                <>
                  <Suspense fallback={<div>Cargando...</div>}>
                    <DropDownComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                      optionValue="TEJ_CODIGO"
                      onChange={(e) =>
                        field.onChange(() => {
                          setValueTypeEntidad(e.value);
                          setValue("tipoEntidad", e.value);
                        })
                      }
                      focusInputRef={field.ref}
                      optionLabel="TEJ_NOMBRE"
                      options={optionLegalEntity.data}
                      placeholder="Seleccionar"
                      width="100%"
                    />
                  </Suspense>
                </>
              )}
            />
            {getFormErrorMessage("tipoEntidad")}
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="div-container">
        <div style={{ width: "100%", marginBottom: "18px" }}>
          <h2 className="tittle-h2">Información del ciudadano</h2>
        </div>

        {showFieldPersons.current == "NIT" ? (
          <div className="row-1 width-50">
            <label className="font-label">
              Razón social<span className="required">*</span>
            </label>
            <Controller
              name="RazonSocial"
              control={control}
              rules={{
                required: "Campo obligatorio.",
                maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputTextComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                    onChange={(e) =>
                      field.onChange(() => {
                        setValue("RazonSocial", e.target.value);
                      })
                    }
                    placeholder=""
                    width="100%"
                  />
                </>
              )}
            />
            {getFormErrorMessage("RazónSocial")}
          </div>
        ) : (
          <></>
        )}

        {showFieldPersons.current != "NIT" ? (
          <>
            {showFieldPersons.current != "Anónimo" ? (
              <>
                <div className="row-1 width-25">
                  <label className="font-label">
                    Primer nombre<span className="required">*</span>
                  </label>
                  <Controller
                    name="primerNombre"
                    control={control}
                    defaultValue={name}
                    rules={{
                      required: "Campo obligatorio.",
                      maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                          onChange={(e) =>
                            field.onChange(() => {
                              setName(e.target.value);
                              setValue("primerNombre", e.target.value);
                            })
                          }
                          placeholder=""
                          width="100%"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("primerNombre")}
                </div>

                <span className="split"></span>

                <div className="div-container"></div>

                <div className="row-1 width-25">
                  <label className="font-label">Segundo nombre</label>
                  <Controller
                    name="segundoNombre"
                    defaultValue={secondName}
                    control={control}
                    rules={{
                      maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                          onChange={(e) =>
                            field.onChange(() => {
                              setSecondName(e.target.value);
                              setValue("segundoNombre", e.target.value);
                            })
                          }
                          placeholder=""
                          width="100%"
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <span className="split"></span>

                <div className="row-1 width-25">
                  <label className="font-label">
                    Primer apellido<span className="required">*</span>
                  </label>
                  <Controller
                    name="primerApellido"
                    control={control}
                    defaultValue={lastName}
                    rules={{
                      required: "Campo obligatorio.",
                      maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                          onChange={(e) =>
                            field.onChange(() => {
                              setLastName(e.target.value);
                              setValue("primerApellido", e.target.value);
                            })
                          }
                          placeholder=""
                          width="100%"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("primerApellido")}
                </div>

                <span className="split"></span>

                <div className="row-1 width-25">
                  <label className="font-label">Segundo apellido</label>
                  <Controller
                    name="segundoApellido"
                    control={control}
                    defaultValue={secondSurname}
                    rules={{
                      maxLength: { value: 50, message: "Solo se permiten  50 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                          onChange={(e) =>
                            field.onChange(() => {
                              setSecondSurname(e.target.value);
                              setValue("segundoApellido", e.target.value);
                            })
                          }
                          placeholder=""
                          width="100%"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("segundoApellido")}
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="div-container">
        {showFieldPersons.current != "NIT" ? (
          <>
            {showFieldPersons.current != "Anónimo" ? (
              <>
                <div className="row-1 width-25">
                  <label className="font-label">
                    Fecha de nacimiento<span className="required">*</span>
                  </label>
                  <Controller
                    name="fechaNacimento"
                    control={control}
                    rules={{ required: "Campo obligatorio." }}
                    render={({ field, fieldState }) => (
                      <>
                        <span className="p-input-icon-right">
                          <Calendar
                            id={field.name}
                            value={birthDate}
                            className={classNames({ "p-invalid ": fieldState.error }, "!h-10 ")}
                            onChange={(e) => field.onChange(handleDateChange(e.value))}
                            dateFormat="dd/mm/yy"
                            maxDate={new Date()}
                            style={{ width: "100%" }}
                            placeholder="DD / MM / AAA"
                          />
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.6667 1.3335V4.00016M5.33333 1.3335V4.00016M2 6.00016H14M12.6667 2.66683H3.33333C2.59667 2.66683 2 3.2635 2 4.00016V12.6668C2 13.4035 2.59667 14.0002 3.33333 14.0002H12.6667C13.4033 14.0002 14 13.4035 14 12.6668V4.00016C14 3.2635 13.4033 2.66683 12.6667 2.66683ZM4.67533 8.48616C4.58333 8.48616 4.50867 8.56083 4.50933 8.65283C4.50933 8.74483 4.584 8.8195 4.676 8.8195C4.768 8.8195 4.84267 8.74483 4.84267 8.65283C4.84267 8.56083 4.768 8.48616 4.67533 8.48616ZM8.00867 8.48616C7.91667 8.48616 7.842 8.56083 7.84267 8.65283C7.84267 8.74483 7.91733 8.8195 8.00933 8.8195C8.10133 8.8195 8.176 8.74483 8.176 8.65283C8.176 8.56083 8.10133 8.48616 8.00867 8.48616ZM11.342 8.48616C11.25 8.48616 11.1753 8.56083 11.176 8.65283C11.176 8.74483 11.2507 8.8195 11.3427 8.8195C11.4347 8.8195 11.5093 8.74483 11.5093 8.65283C11.5093 8.56083 11.4347 8.48616 11.342 8.48616ZM4.67533 11.1528C4.58333 11.1528 4.50867 11.2275 4.50933 11.3195C4.50933 11.4115 4.584 11.4862 4.676 11.4862C4.768 11.4862 4.84267 11.4115 4.84267 11.3195C4.84267 11.2275 4.768 11.1528 4.67533 11.1528ZM8.00867 11.1528C7.91667 11.1528 7.842 11.2275 7.84267 11.3195C7.84267 11.4115 7.91733 11.4862 8.00933 11.4862C8.10133 11.4862 8.176 11.4115 8.176 11.3195C8.176 11.2275 8.10133 11.1528 8.00867 11.1528Z"
                              stroke="#533893"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </>
                    )}
                  />
                  {getFormErrorMessage("fechaNacimento")}
                </div>

                <span className="split"></span>

                <div className="row-1 width-25">
                  <label className="font-label">
                    No. De contacto 1<span className="required">*</span>
                  </label>
                  <Controller
                    name="noContacto1"
                    defaultValue={firstContactNumber}
                    control={control}
                    rules={{
                      required: "Campo obligatorio.",
                      maxLength: { value: 10, message: "Solo se permiten 10 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                          onChange={(e) =>
                            field.onChange(() => {
                              setFirstContactNumber(e.target.value);
                              setValue("noContacto1", e.target.value);
                            })
                          }
                          placeholder=""
                          width="100%"
                          keyfilter="int"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("noContacto1")}
                </div>

                <span className="split"></span>

                <div className="row-1 width-25">
                  <label className="font-label">No. De contacto 2</label>
                  <Controller
                    name="noContacto2"
                    control={control}
                    defaultValue={secondContactNumber}
                    rules={{
                      maxLength: { value: 10, message: "Solo se permiten 10 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                          onChange={(e) =>
                            field.onChange(() => {
                              setSecondContactNumber(e.target.value);
                              setValue("noContacto2", e.target.value);
                            })
                          }
                          placeholder=""
                          width="100%"
                          keyfilter="int"
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="div-container">
        {showFieldPersons.current != "Anónimo" ? (
          <>
            <div className="row-1 width-50">
              <label className="font-label">
                Correo electrónico<span className="required">*</span>
              </label>
              <Controller
                name="correoElectronico"
                control={control}
                rules={{
                  required: "Este campo es obligatorio",
                  maxLength: { value: 100, message: "Solo se permiten 100 caracteres" },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico no válido",
                  },
                }}
                defaultValue={email}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                      onChange={(e) =>
                        field.onChange(() => {
                          setEmail(e.target.value);
                          setValue("correoElectronico", e.target.value);
                        })
                      }
                      placeholder=""
                      keyfilter="email"
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage("correoElectronico")}
            </div>

            <span className="split"></span>

            <div className="row-1 width-50">
              <label className="font-label">
                Dirección<span className="required">*</span>
              </label>
              <Controller
                name="direccion"
                control={control}
                defaultValue={address}
                rules={{
                  required: "Campo obligatorio.",
                  maxLength: { value: 300, message: "Solo se permiten 300 caracteres" },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                      onChange={(e) =>
                        field.onChange(() => {
                          setAddress(e.target.value);
                          setValue("direccion", e.target.value);
                        })
                      }
                      placeholder=""
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage("direccion")}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="div-container">
        <div className="row-1 width-25">
          <label className="font-label">
            País<span className="required">*</span>
          </label>
          <Controller
            name="pais"
            control={control}
            rules={{ required: "Campo obligatorio." }}
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                  onChange={(e) => {
                    field.onChange(e.value);
                    selectCountry(e.value);
                  }}
                  focusInputRef={field.ref}
                  optionValue="id"
                  optionLabel="itemDescription"
                  options={countries}
                  placeholder="Selecionar"
                  width="100%"
                />
              </>
            )}
          />
          {getFormErrorMessage("pais")}
        </div>

        <span className="split"></span>

        {watchCountry == 4 ? (
          <>
            <div className="row-1 width-25">
              <label className="font-label">
                Departamento<span className="required">*</span>
              </label>
              <Controller
                name="departamento"
                control={control}
                rules={{ required: "Campo obligatorio." }}
                render={({ field, fieldState }) => (
                  <>
                    <DropDownComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                      onChange={(e) => {
                        field.onChange(e.value);
                        selectDepartment(e.value);
                      }}
                      focusInputRef={field.ref}
                      optionValue="id"
                      optionLabel="itemDescription"
                      options={departments}
                      placeholder="Selecionar"
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage("departamento")}
            </div>
          </>
        ) : (
          <></>
        )}

        <span className="split"></span>

        {watchDeparment == 204 && (
          <div className="row-1 width-25">
            <label className="font-label">
              Municipio<span className="required">*</span>
            </label>
            <Controller
              name="municipio"
              control={control}
              rules={{ required: "Campo requerido." }}
              render={({ field, fieldState }) => (
                <>
                  <DropDownComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                    onChange={(e) => field.onChange(e.value)}
                    focusInputRef={field.ref}
                    optionValue="id"
                    optionLabel="itemDescription"
                    options={municipalities}
                    placeholder="Selecionar"
                    width="100%"
                  />
                </>
              )}
            />
            {getFormErrorMessage("municipio")}
          </div>
        )}
      </div>

      <div className="div-container">
        <div className="row-1 width-50">
          <label className="font-label">
            Seleccione el medio por el cual quiere recibir la respuesta<span className="required">*</span>
          </label>
          <Controller
            name="medioRespuesta"
            control={control}
            rules={{ required: "Campo obligatorio." }}
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={valueMedioRespuesta}
                  className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                  onChange={(e) =>
                    field.onChange(() => {
                      selectResponseMedium(e.value);
                      setValue("medioRespuesta", e.value);
                    })
                  }
                  focusInputRef={field.ref}
                  optionLabel="MRE_DESCRIPCION"
                  options={optionResponseMedium.data}
                  placeholder="Seleccionar"
                  width="100%"
                />
              </>
            )}
          />
          {getFormErrorMessage("medioRespuesta")}
        </div>
      </div>

      <div className="div-container">
        <div className="row-1 width-50">
          <label className="font-label">
            Programa al que aplica la solicitud<span className="required">*</span>
          </label>
          <Controller
            name="programaSolicitud"
            control={control}
            rules={{ required: "Campo obligatorio." }}
            render={({ field, fieldState }) => (
              <>
                <Suspense fallback={<div>Cargando...</div>}>
                  <DropDownComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                    onChange={(e) => {
                      field.onChange(e.value);
                      selectProgram(e.value);
                    }}
                    focusInputRef={field.ref}
                    optionLabel="prg_descripcion"
                    optionValue="prg_codigo"
                    options={programs}
                    placeholder="Seleccionar"
                    width="100%"
                  />
                </Suspense>
              </>
            )}
          />
          {getFormErrorMessage("programaSolicitud")}
        </div>

        <span className="split"></span>

        <div className="row-1 width-50">
          <label className="font-label">
            Asunto de la solicitud<span className="required">*</span>
          </label>
          <Controller
            name="asuntoSolicitud"
            control={control}
            rules={{ required: "Campo obligatorio." }}
            render={({ field, fieldState }) => (
              <>
                <Suspense fallback={<div>Cargando...</div>}>
                  <DropDownComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                    onChange={(e) => field.onChange(e.value)}
                    focusInputRef={field.ref}
                    optionLabel="aso_asunto"
                    optionValue="aso_codigo"
                    options={requestSubjectTypes}
                    disabled={!requestSubjectTypes.length}
                    placeholder="Seleccionar"
                    width="100%"
                  />
                </Suspense>
              </>
            )}
          />
          {getFormErrorMessage("asuntoSolicitud")}
        </div>
      </div>

      <div className="div-container">
        <div className="row-1 width-50">
          <label className="font-label">Clasificación</label>
          <InputTextComponent
            placeholder={showClasificacion.current}
            width=""
            value={clasification}
            disabled={true}
            className="mi-input !h-10"
          />
        </div>

        <span className="split"></span>

        <div className="row-1 width-50">
          <label className="font-label">Dependencia</label>
          <InputTextComponent
            placeholder={showDependecia.current}
            width=""
            value={dependence}
            disabled={true}
            className="mi-input !h-10"
          />
        </div>
      </div>

      <div className="div_container width-100">
        <label className="font-label">
          Descripción<span className="required">*</span>
        </label>
        <Controller
          name="Descripcion"
          control={control}
          rules={{
            required: "Campo obligatorio.",
            maxLength: { value: 5000, message: "Solo se permiten 5000 caracteres" },
          }}
          render={({ field, fieldState }) => (
            <>
              <CnputTextareaComponent
                id={field.name}
                value={field.value}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </>
          )}
        />
        <div className="alert-textarea">
          {getFormErrorMessage("Descripcion")}
          <span className="font-label">Max 5000 caracteres</span>
        </div>
      </div>

      <div className="div-upload">
        <label className="font-label">Archivos o documentos que soportan la solicitud</label>
        <label
          className="upload-label"
          style={{ display: "flex", alignItems: "center" }}
          htmlFor="modal"
          onClick={() => setVisible(true)}
        >
          Adjuntar archivos{" "}
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.00008 5.83331V11.1666"
              stroke="#533893"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M10.6666 8.50002H5.33325"
              stroke="#533893"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z"
              stroke="#533893"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </label>
        {file != undefined && file.name ? (
          <div className="flex items-center">
            <div>
              <button className="!text-base !text-red-500" onClick={() => handleFileView()}>
                {file.name}
              </button>
            </div>
            <div>
              <Button
                icon={trashIcon}
                onClick={() => setfile(null)}
                rounded
                text
                severity="danger"
                aria-label="Cancel"
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        <Button label="Show" style={{ display: "none" }} name="modal" id="modal" onClick={() => setVisible(true)} />
        <Dialog
          header="Si tienes más de un documento, se deben unir en un solo archivo para ser cargados"
          className="text-center div-modal movil"
          visible={visible}
          onHide={() => setVisible(false)}
          pt={{
            root: { style: { width: "35em" } },
          }}
        >
          <Controller
            name="archivo"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <UploadComponent
                  id={field.name}
                  dataArchivo={(e: File) => field.onChange(getFile(e))}
                  showModal={(e: boolean) => field.onChange(setVisible(e))}
                />
              </>
            )}
          />
          <Button
            className="mt-8"
            style={{ backgroundColor: "533893" }}
            onClick={() => setVisible(false)}
            label="Cancelar"
            rounded
          />
        </Dialog>
      </div>

      <div className="div_container" style={{ marginBottom: "20px" }}>
        <label className="font-label">Aviso de privacidad</label>
        <ScrollPanelComponent />
      </div>

      <div className="div_container width-100" style={{ marginBottom: "20px" }}>
        <label className="font-label">
          Para conocer la Política de Tratamiento y Protección de datos personales de Sapiencia, dar click{" "}
          <a href={LPA_VALOR} style={{ color: "#533893" }} target="_blank">
            aquí
          </a>{" "}
        </label>
        <Controller
          name="politicaTratamiento"
          control={control}
          rules={{ required: "Campo obligatorio." }}
          render={({ field, fieldState }) => (
            <>
              <TriStateCheckboxComponent
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(checkBox(e.value))}
                className={classNames({ "p-invalid": fieldState.error })}
              />
              {getFormErrorMessage(field.name)}
            </>
          )}
        />
      </div>

      <div>
        <Button disabled={statusSummit} rounded label="Enviar solicitud" className="!px-10 !text-sm btn-sumit" />
      </div>
    </form>
  );
};
