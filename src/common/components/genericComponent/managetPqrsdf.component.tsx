import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import moment from 'moment-timezone';
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { toLocaleDate } from "../../utils/helpers";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";

import { mastersTablesServices } from "../../hooks/masterTables.hook";
import { usePqrsdfService } from "../../hooks/PqrsdfService.hook";
import { useWorkEntityService } from "../../hooks/WorkEntityService.hook";
import { Countrys, IMResponseMedium, 
         Departament, IMunicipality, 
         ItypeRFequest, IlegalEntityType, 
         IProgram, 
         ISubjectRequest} from "../../interfaces/mastersTables.interface";
import { Link } from "react-router-dom";
import { InputSwitch } from "primereact/inputswitch";
import { Tooltip } from "primereact/tooltip";
import { UploadManagetComponen } from "./uploadManagetComponen";
import { IWorkEntity } from "../../interfaces/workEntity.interfaces";


interface City {
    name: string;
    code: string;
}

interface PageNumber {
    page: number;
  }

  interface InfoTable {
     user:string; 
     visibleBeneficiary?:boolean; 
     accion?:string;
     id?:number;
  }

export const ManagetPqrsdfComponent = () => {

    const mastetablesServices = mastersTablesServices();
    const pqrsdfService = usePqrsdfService();
    const workEntityService = useWorkEntityService();
    const arrayTypeDocumentNit = ['NIT'];
    const arrayTypeDocumentAnonimo = ['Anónimo'];
    const arrayTypeDocumentNitAndAnonymus = ['NIT','Anónimo'];
    const arrayTypeDocument = ['Cedula de Ciudadania','Cedula de Extranjeria','Tarjeta de Identidad','NIT','Anónimo']

    const [typeReques, setTypeRequest] = useState<ItypeRFequest[]>();
    const [typelegalEntity, setTypelegalEntity] = useState<IlegalEntityType[]>();
    const [countrys, setCountrys] = useState<Countrys[]>();
    const [departamets, setDepartamets] = useState<Departament[]>();
    const [municipalitys, setMunicipalitys] = useState<IMunicipality[]>();
    const [responsesMediuns,setResponsesMediuns] =useState<IMResponseMedium[]>();
    const [programs,setPrograms] =useState<IProgram[]>();
    const [subjectRequests,setSubjectRequests] =useState<ISubjectRequest[]>();
    const [selectPage, setSelectPage] = useState<PageNumber>({ page: 5 });
    const pageNumber: PageNumber[] = [{ page: 5 }, { page: 10 }, { page: 15 }, { page: 20 }];
    const [tableData, setTableData] = useState<InfoTable[]>([]);

    const [requestType, setRequestType] = useState<{tso_codigo?:number,tso_description?:string}>();
    const [legalentityType, setLegalEntityType] = useState<IlegalEntityType>();
    const [entityDocuement, setEntityDocuement] = useState('');
    const [typeDocmuent, setTypeDocmuent] = useState('');
    const [birthday, setBirthday] = useState<Nullable<Date>>(null);
    const [country, setCountry] = useState<Countrys>();
    const [departamet, setDepartamet] = useState<Departament>();
    const [municipality, setMunicipality] = useState<IMunicipality>();
    const [responsesMediun, setResponsesMediun] =useState<IMResponseMedium>();
    const [program, setProgram] =useState<IProgram>();
    const [subjectRequest,setSubjectRequest] =useState<ISubjectRequest>();
    const [nameUrl,setNameUrl] =useState<string>();
    const [namePath, setNamePath] = useState<string>();
    const [filedNumber, setFiledNumber] = useState<number>();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [nameUser, setNmaeUser] = useState<string>();
    const [selectedFile, setSelectedFile] = useState<InfoTable>();
    
    const getInfoPqrsdf = async (id:number)=>{
        const infoPqrsdf = pqrsdfService.getPqrsdfById(id);
        return infoPqrsdf
    }

    const splitUrl = (url:string)=>{
        const split = url.split('/');
        const urlSplit = split.slice(0, -1);
        const nameFile = urlSplit.pop();
        const namepath = `${urlSplit[0]}/${urlSplit[1]}/${nameFile}` 

        return{nameFile,namepath}
    }

    const getDataMasterTables = async() =>{
        const credentials = JSON.parse(localStorage.getItem('credentials'));
        const typeRequest = await mastetablesServices.getTypeRequest();
        const typeLegalEntity = await mastetablesServices.getTypeLegalentity();
        const ArrayCountry = await mastetablesServices.getCountrys();
        const arrayDepartament = await mastetablesServices.getDepartament();
        const arrayMunicipality = await mastetablesServices.getMunicipality();
        const arrayResposeMediun = await mastetablesServices.getResponseMediun();
        const arrayPrograms = await mastetablesServices.getProgram();
        const arraySubjectRequest = await mastetablesServices.getSbjectRequest();
        const userInfo = await workEntityService.getUserByFilters({identification:credentials.numberDocument})     
        return {
            typeRequest,
            typeLegalEntity,
            ArrayCountry,
            arrayDepartament,
            arrayMunicipality,
            arrayResposeMediun,
            arrayPrograms,
            arraySubjectRequest,
            userInfo
        }   
    };

    useEffect(()=>{
        getDataMasterTables().then(({
            typeRequest, typeLegalEntity,
            ArrayCountry, arrayDepartament,
            arrayMunicipality, arrayResposeMediun,
            arrayPrograms, arraySubjectRequest, userInfo})=>{
            setTypeRequest(typeRequest.data);
            setTypelegalEntity(typeLegalEntity.data);
            setCountrys(ArrayCountry.data);
            setDepartamets(arrayDepartament.data);
            setMunicipalitys(arrayMunicipality.data);
            setResponsesMediuns(arrayResposeMediun.data);        
            setPrograms(arrayPrograms.data);
            setSubjectRequests(arraySubjectRequest.data);
            const FullName = `${userInfo.data[0].names} ${userInfo.data[0].lastNames}` 
            setNmaeUser(FullName)
        })
    },[]);

    const defaultValues = {
        typeOfRequest: {tso_codigo: null,tso_description:''},
        noDocument: "",
        typeLegalEntity:{tej_codigo: null,tej_nombre:''},
        businessName:'',
        firstName:'',
        secondName:'',
        lastName:'',
        secondLastName:'',
        brithdayDate:null,
        firtContact:'',
        secondContact:'',
        email:'',
        address:'',
        country:{LGE_CODIGO:null, LGE_ELEMENTO_DESCRIPCION:''},
        departament:{
            LGE_CODIGO: null,
            LGE_ELEMENTO_CODIGO: "",
            LGE_ELEMENTO_DESCRIPCION: ""
        },
        municipality:{
            LGE_CODIGO: null,
            LGE_ELEMENTO_CODIGO: "",
            LGE_ELEMENTO_DESCRIPCION: ""
        },
        responseMediun:{
            MRE_CODIGO:null,
            MRE_DESCRIPCION:"",
        },
        program:{
            PRG_CODIGO: null,
            PRG_DESCRIPCION: "",
            CLP_CODIGO: null,
            CLP_DESCRIPCION: "",
            DEP_CODIGO: null,
            DEP_DESCRIPCION: ""
        },
        subjectRerquest:{
            ASO_CODIGO: null,
            ASO_ASUNTO: ""
        },
        classification:'',
        dependence:'',
        description:'',
        file:''
      };

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
    } = useForm({ defaultValues, mode: "all" }); 
    
    const handleDateChange = (date: any) => {        
        setValue("brithdayDate",toLocaleDate(date));
        const birthdate = moment(date).format('DD-MM-YYYY');
        return birthdate;
      };

    //pasar id de la pqr este es provicional id prueba 73 y 1
    useEffect(()=>{
        getInfoPqrsdf(1).then(({data})=>{
            console.log(data);
            setTypeDocmuent(data['person']['documentType']['itemDescription'])
            setRequestType({
                tso_codigo: data['requestType']['tso_codigo'],
                tso_description: data['requestType']['tso_description'],
            });
            setValue("typeOfRequest",{
                tso_codigo: data['requestType']['tso_codigo'],
                tso_description: data['requestType']['tso_description'],
            },{ shouldDirty: true });
            setEntityDocuement(`${data['person']['documentType']['itemCode']} ${data['person']['identification']}`);
            setLegalEntityType({
                tej_codigo: data['person']['entityTypeId'],
                tej_nombre: data['person']['entityType']['tej_nombre'],
              });
            setValue('typeLegalEntity',{
            tej_codigo: data['person']['entityTypeId'],
            tej_nombre: data['person']['entityType']['tej_nombre'],
            },{ shouldDirty: true });
            setValue('firstName',data['person']['firstName'],{ shouldDirty: true });
            setValue('secondName',data['person']['secondName']);
            setValue('lastName',data['person']['firstSurname'],{ shouldDirty: true });
            setValue('secondLastName',data['person']['secondSurname']);            
            setBirthday(toLocaleDate(data['person']['birthdate']));
            setValue('brithdayDate',toLocaleDate(data['person']['birthdate']),{ shouldDirty: true });
            setValue('firtContact',data['person']['firstContactNumber'],{ shouldDirty: true });
            setValue('secondContact',data['person']['secondContactNumber']);
            setValue('email',data['person']['email'],{ shouldDirty: true });
            setValue('address',data['person']['address'],{ shouldDirty: true });

            setCountry({
                LGE_CODIGO:data['person']['countryId'],
                LGE_ELEMENTO_DESCRIPCION:data['person']['country']['itemDescription']
            });
            setValue('country',{
                LGE_CODIGO:data['person']['countryId'],
                LGE_ELEMENTO_DESCRIPCION:data['person']['country']['itemDescription']
            },{ shouldDirty: true });

            setDepartamet({
                LGE_CODIGO: data['person']['department']['id'],
                LGE_ELEMENTO_CODIGO: data['person']['department']['itemCode'],
                LGE_ELEMENTO_DESCRIPCION: data['person']['department']['itemDescription']
            })
            setValue('departament',{
                LGE_CODIGO: data['person']['department']['id'],
                LGE_ELEMENTO_CODIGO: data['person']['department']['itemCode'],
                LGE_ELEMENTO_DESCRIPCION: data['person']['department']['itemDescription']
            },{ shouldDirty: true });

            setMunicipality({
                LGE_CODIGO: data['person']['municipality']['id'],
                LGE_ELEMENTO_CODIGO: data['person']['municipality']['itemCode'],
                LGE_ELEMENTO_DESCRIPCION: data['person']['municipality']['itemDescription']
            });
            setValue('municipality',{
                LGE_CODIGO: data['person']['municipality']['id'],
                LGE_ELEMENTO_CODIGO: data['person']['municipality']['itemCode'],
                LGE_ELEMENTO_DESCRIPCION: data['person']['municipality']['itemDescription']
            },{ shouldDirty: true });

            setResponsesMediun({
                MRE_CODIGO:data['responseMedium']['mre_codigo'],
                MRE_DESCRIPCION:data['responseMedium']['mre_descripcion'],
            });
            setValue('responseMediun',{
                MRE_CODIGO:data['responseMedium']['mre_codigo'],
                MRE_DESCRIPCION:data['responseMedium']['mre_descripcion'],
            },{ shouldDirty: true });

            const programData:IProgram = {
                PRG_CODIGO: data['program']['prg_codigo'],
                PRG_DESCRIPCION: data['program']['prg_descripcion'],
                CLP_CODIGO: data['program']['clpClasificacionPrograma'][0]['clp_codigo'],
                CLP_DESCRIPCION: data['program']['clpClasificacionPrograma'][0]['clp_descripcion'],
                DEP_CODIGO: data['program']['depDependencia'][0]['dep_codigo'],
                DEP_DESCRIPCION: data['program']['depDependencia'][0]['dep_descripcion']
            };
            setProgram({
                PRG_CODIGO: programData.PRG_CODIGO,
                PRG_DESCRIPCION: programData.PRG_DESCRIPCION,
                CLP_CODIGO: programData.CLP_CODIGO,
                CLP_DESCRIPCION: programData.CLP_DESCRIPCION,
                DEP_CODIGO: programData.DEP_CODIGO,
                DEP_DESCRIPCION: programData.DEP_DESCRIPCION
            });
            setValue('program',{
                PRG_CODIGO: programData.PRG_CODIGO,
                PRG_DESCRIPCION: programData.PRG_DESCRIPCION,
                CLP_CODIGO: programData.CLP_CODIGO,
                CLP_DESCRIPCION: programData.CLP_DESCRIPCION,
                DEP_CODIGO: programData.DEP_CODIGO,
                DEP_DESCRIPCION: programData.DEP_DESCRIPCION
            },{ shouldDirty: true });
            
            setSubjectRequest({
                ASO_CODIGO: data['requestSubject']['aso_codigo'],
                ASO_ASUNTO: data['requestSubject']['aso_asunto']
            });
            setValue('subjectRerquest',{
                ASO_CODIGO: data['requestSubject']['aso_codigo'],
                ASO_ASUNTO: data['requestSubject']['aso_asunto']
            },{ shouldDirty: true });

            setValue('classification',programData.CLP_DESCRIPCION)
            setValue('dependence',programData.DEP_DESCRIPCION)

            setValue('description',data['description'],{ shouldDirty: true });
            const {nameFile,namepath} = splitUrl(data['file']['name']);
            setNameUrl(namepath);
            setNamePath(nameFile);

            setFiledNumber(data['filingNumber']);
        })
    },[]);

    const cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
      
    const getFormErrorMessage = (name) => {
        return errors[name] ? (
          <small className="p-error">{errors[name].message}</small>
        ) : (
          <small className="p-error">&nbsp;</small>
        );
      };

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let nextMonth = month === 11 ? 0 : month ;
    let nextYear = nextMonth === 0 ? year + 1 : year;
    let maxDate = new Date();
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);

    const handleSwitchChange = (value, data) => {
        console.log(value, data);
    }

    const suwitchBeneficiary=(data)=>{
        const [checked, setChecked] = useState(false);
        return(
            <>
            <div className="flex justify-center items-center">
                <div>NO</div>
                <div className="flex  ml-4 mr-4">
                    <InputSwitch  checked={checked} onChange={(e) => setChecked(e.value)} />
                </div>
                <div>SI</div>
            </div>
            </>
        )
    }

    const handleFileView = (fileDate) => {
        
          const reader = new FileReader();
    
          // Lee el contenido del archivo como un URL de datos
          reader.onloadend = () => {
            const fileDataUrl = reader.result;
    
            // Abre una nueva ventana con el contenido del archivo
            const newWindow = window.open();
            newWindow.document.write(`<iframe width="100%" height="100%" src="${fileDataUrl}"></iframe>`);
          };
    
          reader.readAsDataURL(fileDate);
        
    };



    const selectFileToDelete = (element) => {

        let _data = tableData.filter((val) => val.id !== element.id);       
        setTableData(_data);
    };

    const accionesIcons = (data)=> {   
        return(
            <>
            <div className="flex justify-center items-center">
                <div className="mr-4">
                    <Link to={''} onClick={()=>handleFileView(data.accion)}>
                        <Tooltip target=".custom-target-icon" style={{borderRadius:'1px'}} />
                        <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                            data-pr-tooltip="Ver adjunto"
                            data-pr-position="right"
                        >
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.13477 13.498C0.953775 13.193 0.953775 12.807 1.13477 12.502C3.03972 9.279 6.51962 6.5 9.99952 6.5C13.4794 6.5 16.9583 9.279 18.8633 12.501C19.0443 12.807 19.0443 13.194 18.8633 13.5C16.9583 16.721 13.4794 19.5 9.99952 19.5C6.51962 19.5 3.03972 16.721 1.13477 13.498Z" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12.1204 10.879C13.2924 12.051 13.2924 13.95 12.1204 15.122C10.9484 16.294 9.04948 16.294 7.87751 15.122C6.70554 13.95 6.70554 12.051 7.87751 10.879C9.04948 9.707 10.9494 9.707 12.1204 10.879" stroke="#058CC1" stroke-width="1.4286" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.9995 1V3.5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3 3L4.67995 5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16.9993 3L15.3193 5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </i>

                    </Link>
                </div>
                <div className="ml-4">
                    <Link to={''} onClick={()=>selectFileToDelete(data)}>
                        <Tooltip target=".custom-target-icon" style={{borderRadius:'1px'}} />
                        <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                            data-pr-tooltip="Eliminar"
                            data-pr-position="right"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1378 21H7.85782C6.81082 21 5.94082 20.192 5.86282 19.147L4.96582 7H18.9998L18.1328 19.142C18.0578 20.189 17.1868 21 16.1378 21V21Z" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 11V17" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4 7H20" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 7L15.987 4.298C15.694 3.517 14.948 3 14.114 3H9.886C9.052 3 8.306 3.517 8.013 4.298L7 7" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15.4298 11L14.9998 17" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8.57016 11L9.00016 17" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </i>
                    </Link>
                </div>
            </div>

            </>
        )
    }

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

    const closeIcon = () => (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
            fill="#533893"
          />
        </svg>
      );
    
      
  return (
    <>
    <div className="flex justify-start items-center">
        <div className="mr-4 div-30">
            <label>Tipo de solicitud<span className="text-red-600">*</span></label>
            <br />
            <Controller
                name="typeOfRequest"
                control={control}
                rules={{ required: 'Campo obligatorio.'}}
                render={({ field, fieldState }) => (
                    <>
                        <Dropdown
                            id={field.name}
                            value={requestType}
                            optionLabel="tso_description"
                            placeholder="Seleccionar"
                            showClear 
                            options={typeReques}
                            focusInputRef={field.ref}
                            onChange={(e) => field.onChange(()=>{
                                console.log(e.value);
                                setRequestType(e.value)
                                setValue("typeOfRequest", e.value);
                            })}
                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                        />
                        {getFormErrorMessage(field.name)}
                    </>
                )}
            />
        </div>

        <div className="mr-4 div-30">
            <label>Doc. Identidad</label>
            <Controller
                name="noDocument"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <span className="p-float-label">
                            <InputText 
                                id={field.name} 
                                value={entityDocuement} 
                                disabled
                                className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100 input-desabled')}
                                onChange={(e) => field.onChange(()=>{
                                    setEntityDocuement(e.target.value);
                                    setValue('noDocument',e.target.value);
                                })} />
                        </span>
                        {getFormErrorMessage(field.name)}
                    </>
                )}
            />
        </div>
        
        {arrayTypeDocumentNit.includes(typeDocmuent)?(
        <>
            <div className="div-30">
                <label>Tipo entidad<span className="text-red-600">*</span></label>
                <Controller
                    name="typeLegalEntity"
                    control={control}
                    rules={{ required: 'Campo obligatorio.'}}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                id={field.name}
                                value={legalentityType}
                                optionLabel="tej_nombre"
                                placeholder="Seleccionar"
                                showClear 
                                options={typelegalEntity}
                                focusInputRef={field.ref}
                                onChange={(e) => field.onChange(()=>{
                                    setLegalEntityType(e.value);
                                    setValue('typeLegalEntity',e.value)
                                })}
                                className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                            />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}
                />
            </div>
        </>):(<>
        </>)}
    </div>

    <Accordion activeIndex={2} style={{width:'61em'}}>
        <AccordionTab  header="Información del ciudadano">
            <div className="flex">
                {arrayTypeDocumentNit.includes(typeDocmuent)?(
                <>
                    <div className="mr-4">
                        <label>Razón socia<span className="text-red-600">*</span></label>
                        <Controller
                            name="businessName"
                            control={control}
                            rules={{
                                required: 'Campo obligatorio.',
                                maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value} 
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                </>):(<></>)}
                {arrayTypeDocumentNitAndAnonymus.includes(typeDocmuent)?(<></>):(
                <>
                    <div className="mr-4">
                        <label>Primer nombre<span className="text-red-600">*</span></label>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{
                                required: 'Campo obligatorio.',
                                maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value}
                                            keyfilter={'alpha'}
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="mr-4">
                        <label>Segundo nombre</label>
                        <Controller
                            name="secondName"
                            control={control}
                            rules={{
                                maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value}
                                            keyfilter={'alpha'} 
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="mr-4">
                        <label>Primer Apellido<span className="text-red-600">*</span></label>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{
                                required: 'Campo obligatorio.',
                                maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value} 
                                            keyfilter={'alpha'}
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="mr-4">
                        <label>Segundo Apellido</label>
                        <Controller
                            name="secondLastName"
                            control={control}
                            rules={{
                                maxLength: { value: 50, message: "Solo se permiten 50 caracteres" },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value}
                                            keyfilter={'alpha'} 
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                </>)}
            </div>
            <div className="flex">
                {arrayTypeDocumentNitAndAnonymus.includes(typeDocmuent)?(<></>):(
                <>
                    <div className="mr-4">
                        <label>Fecha de nacimiento<span className="text-red-600">*</span></label>
                        <br />
                        <Controller
                            name="brithdayDate"
                            control={control}
                            rules={{
                                required: 'Campo obligatorio.',
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <span className="p-input-icon-right">
                                    <Calendar 
                                        inputId={field.name} 
                                        value={birthday} 
                                        onChange={(e)=>field.onChange(handleDateChange(e.value))} 
                                        dateFormat="dd/mm/yy"
                                        placeholder='DD / MM / AAA'
                                        maxDate={maxDate}  
                                        className={classNames({ 'p-invalid': fieldState.error },'h-10')} 
                                    />
                                    <svg width="19" height="19" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                    d="M10.6667 1.3335V4.00016M5.33333 1.3335V4.00016M2 6.00016H14M12.6667 2.66683H3.33333C2.59667 2.66683 2 3.2635 2 4.00016V12.6668C2 13.4035 2.59667 14.0002 3.33333 14.0002H12.6667C13.4033 14.0002 14 13.4035 14 12.6668V4.00016C14 3.2635 13.4033 2.66683 12.6667 2.66683ZM4.67533 8.48616C4.58333 8.48616 4.50867 8.56083 4.50933 8.65283C4.50933 8.74483 4.584 8.8195 4.676 8.8195C4.768 8.8195 4.84267 8.74483 4.84267 8.65283C4.84267 8.56083 4.768 8.48616 4.67533 8.48616ZM8.00867 8.48616C7.91667 8.48616 7.842 8.56083 7.84267 8.65283C7.84267 8.74483 7.91733 8.8195 8.00933 8.8195C8.10133 8.8195 8.176 8.74483 8.176 8.65283C8.176 8.56083 8.10133 8.48616 8.00867 8.48616ZM11.342 8.48616C11.25 8.48616 11.1753 8.56083 11.176 8.65283C11.176 8.74483 11.2507 8.8195 11.3427 8.8195C11.4347 8.8195 11.5093 8.74483 11.5093 8.65283C11.5093 8.56083 11.4347 8.48616 11.342 8.48616ZM4.67533 11.1528C4.58333 11.1528 4.50867 11.2275 4.50933 11.3195C4.50933 11.4115 4.584 11.4862 4.676 11.4862C4.768 11.4862 4.84267 11.4115 4.84267 11.3195C4.84267 11.2275 4.768 11.1528 4.67533 11.1528ZM8.00867 11.1528C7.91667 11.1528 7.842 11.2275 7.84267 11.3195C7.84267 11.4115 7.91733 11.4862 8.00933 11.4862C8.10133 11.4862 8.176 11.4115 8.176 11.3195C8.176 11.2275 8.10133 11.1528 8.00867 11.1528Z"
                                    stroke="#533893"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    />
                                </svg>
                                </span>
                                <br />
                                {getFormErrorMessage(field.name)}
                            </>
                            )}
                        />
                    </div>
                </>)}
                {arrayTypeDocumentAnonimo.includes(typeDocmuent)?(<></>):(
                <>
                    <div className="mr-4">
                        <label>Número de contacto 1<span className="text-red-600">*</span></label>
                        <Controller
                            name="firtContact"
                            control={control}
                            rules={{
                                required: 'Campo obligatorio.',
                                maxLength: { value: 10, message: "Solo se permiten 10 caracteres" },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value}
                                            keyfilter={'num'} 
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="mr-4">
                        <label>Número de contacto 2</label>
                        <Controller
                            name="secondContact"
                            control={control}
                            rules={{
                                maxLength: { value: 10, message: "Solo se permiten 10 caracteres" },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label">
                                        <InputText 
                                            id={field.name} 
                                            value={field.value}
                                            keyfilter={'num'} 
                                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                </>)}
            </div>
            {arrayTypeDocumentAnonimo.includes(typeDocmuent)?(<></>):(
            <>
                <div className="flex">
                    <div className="mr-4 div-50">
                    <label>Correo electrónico<span className="text-red-600">*</span></label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Este campo es obligatorio",
                            maxLength: { value: 100, message: "Solo se permiten 100 caracteres" },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Correo electrónico no válido",
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <>
                                <span className="p-float-label">
                                    <InputText 
                                        id={field.name} 
                                        value={field.value} 
                                        className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100')}
                                        onChange={(e) => field.onChange(e.target.value)} />
                                </span>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                    </div>
                    <div className="mr-4 div-50">
                    <label>Dirección</label>
                    <Controller
                        name="address"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 300, message: "Solo se permiten 300 caracteres" },
                            }}
                        render={({ field, fieldState }) => (
                            <>
                                <span className="p-float-label">
                                    <InputText 
                                        id={field.name} 
                                        value={field.value} 
                                        className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100')}
                                        onChange={(e) => field.onChange(e.target.value)} />
                                </span>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                    </div>
                </div>
            </>)} 
            <div className="flex items-center">
                <div className="mr-4 div-25">
                    <label>País<span className="text-red-600">*</span></label>
                    <Controller
                        name="country"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={country}
                                    optionLabel="LGE_ELEMENTO_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={countrys}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(()=>{
                                        setCountry(e.value);
                                        setValue('country',e.value);
                                    })}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-25">
                    <label>Departamento<span className="text-red-600">*</span></label>
                    <Controller
                        name="departament"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={departamet}
                                    optionLabel="LGE_ELEMENTO_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={departamets}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(()=>{
                                        setDepartamet(e.value);
                                        setValue('departament',e.value);
                                    })}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-25">
                    <label>Municipio<span className="text-red-600">*</span></label>
                    <Controller
                        name="municipality"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={municipality}
                                    optionLabel="LGE_ELEMENTO_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={municipalitys}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(()=>{
                                        setMunicipality(e.value);
                                        setValue('municipality',e.value)
                                    })}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
            </div>
            <div className="flex justify-between items-center">
                {arrayTypeDocumentAnonimo.includes(typeDocmuent)?(<></>):(
                <>
                    <div className="mr-4 div-50">
                        <label>Seleccione el medio por el cual quiere recibir la respuesta</label>
                        <Controller
                            name="responseMediun"
                            control={control}
                            rules={{
                                required: 'Campo obligatorio.',
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={responsesMediun}
                                        optionLabel="MRE_DESCRIPCION"
                                        placeholder="Seleccionar"
                                        showClear 
                                        options={responsesMediuns}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(()=>{
                                            setResponsesMediun(e.value);
                                            setValue('responseMediun',e.value);
                                        })}
                                        className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                    />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                 </div>
                </>)} 
                <div>
                <Button
                    label="Actualizar"
                    className="rounded-full"
                />
                </div>
            </div>          
        </AccordionTab>
        <AccordionTab header="Información de la solicitud">
            <div className="flex">
                <div className="mr-4 div-50">
                    <label>Programa al que aplica la solicitud<span className="text-red-600">*</span></label>
                    <Controller
                        name="program"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={program}
                                    optionLabel="PRG_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={programs}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(()=>{
                                        setProgram(e.value)
                                        setValue('program',e.value);
                                        setValue('classification',e.value?.CLP_DESCRIPCION)
                                        setValue('dependence',e.value?.DEP_DESCRIPCION)
                                    })}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                </div>
                <div className="mr-4 div-50">
                    <label>Asunto de la solicitud<span className="text-red-600">*</span></label>
                    <Controller
                        name="subjectRerquest"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={subjectRequest}
                                    optionLabel="ASO_ASUNTO"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={subjectRequests}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(()=>{
                                        setSubjectRequest(e.value);
                                        setValue('subjectRerquest',e.value)
                                    })}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                </div>
            </div> 
            <div className="flex">
                 <div className="mr-4 div-50">
                    <label>Clasificación</label>
                    <Controller
                        name="classification"
                        control={control}
                        render={({ field, fieldState }) => (
                        <>
                            <InputText 
                                id={field.name} 
                                value={field.value}
                                disabled
                                className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100 input-desabled')}
                                onChange={(e) => field.onChange(e.target.value)} />
                            {getFormErrorMessage(field.name)}
                        </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-50">
                    <label>Dependencia </label>
                    <Controller
                        name="dependence"
                        control={control}
                        render={({ field, fieldState }) => (
                        <>
                            <InputText 
                            id={field.name} 
                            value={field.value}
                            disabled 
                            className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100 input-desabled')}
                            onChange={(e) => field.onChange(e.target.value)} />
                            {getFormErrorMessage(field.name)}
                        </>
                        )}
                    />
                 </div>
            </div>
            <div className="flex">
                <div className="mr-4 div-100">
                    <label>Descripción</label>
                    <br />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                        <>
                            <InputTextarea 
                                id={field.name} 
                                {...field} 
                                rows={4} 
                                cols={30}
                                disabled 
                                className={classNames({ 'p-invalid': fieldState.error },'div-100 input-desabled')} 
                            />
                            <div className="flex justify-between">
                                {getFormErrorMessage(field.name)}
                                <span className="font-label">Max 5000 caracteres</span>
                            </div>
                        </>
                        )}
                    />
                </div>
            </div>
            <div className="">
                <label className="font-label">Archivos o documentos que soportan la solicitud</label>
                <br />
                <label
                className="upload-label"
                style={{ display: "flex", alignItems: "center" }}
                >
                    <Link to={`https://storage.cloud.google.com/${nameUrl}`} target="_blank">
                        <span className="mr-2 text-red-600">{namePath}</span>
                    </Link>
                </label>
            </div>   
        </AccordionTab>
        <AccordionTab header="Documentos de apoyo interno">
        <div className="flex flex-row items-center justify-between mb-8 header-movil">
            <div className="col-1 col-100 seeker">
                    <div className="mr-2">
                        <Dialog 
                            visible={visibleDialog} 
                            style={{ width: '50vw' }} 
                            onHide={() => setVisibleDialog(false)}
                            closeIcon={closeIcon}
                        >
                            <UploadManagetComponen
                            filesSupportDocument={(e)=>{
                                let cont = 0;
                                const documents =  e.map((date)=>{
                                    cont = cont+1
                                    return{
                                        user:nameUser,
                                        visibleBeneficiary:false, 
                                        accion:date,
                                        id:cont
                                    }
                                })
                                
                                setTableData(documents)
                            }}
                            filesRequestPqrdf={(e)=>{}}
                            statusDialog={(e)=>{setVisibleDialog(e)}}
                            />
                        </Dialog>
                        <Button 
                            label="Adjuntar archivos"
                            className="flex flex-row-reverse w-52"
                            onClick={()=>setVisibleDialog(true)} 
                            text 
                            icon={<i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center">
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.99984 5.83334V11.1667" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10.6668 8.49999H5.3335" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    </i>
                                }
                        />
                    </div>
                <div>

                </div>
            </div>
            <div className="flex flex-row items-center tittle-header-movil">
                <div className=" mr-4 flex items-center total">
                    <div><label className="mr-2 text-base total">Total de resultados</label></div>
                    <div><span className="text-black flex items-center bold big">{tableData.length}</span></div>
                </div>
                <div className="flex items-center pagination-p">
                    <div><label className="mr-2 p-colorpicker">Registro por página</label></div>
                   <div>
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
        </div>
        <div className="overflow-hidden max-w-[calc(111vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] block md:block borderless reverse-striped">
            <DataTable
                value={tableData}
                paginator
                paginatorTemplate={paginatorTemplate()}
                rows={selectPage.page}
                stripedRows
                selectionMode="single"
                dataKey="id"
                scrollable
            >
                <Column 
                    style={{ textAlign: "center" }} 
                    className="!font-sans" field="user" 
                    header="Usuario ">
                </Column>
                <Column 
                    style={{ textAlign: "center" }}
                    className="!font-sans" 
                    field="visibleBeneficiary" 
                    header={<p style={{width:'112px'}}>Visible para beneficiario</p>}
                    body={suwitchBeneficiary}
                    >
                </Column>
                <Column
                    field="accion"
                    header="Acción"
                    className="!font-sans"
                    style={{ textAlign: "center"}}
                    body={accionesIcons}
                ></Column>
            </DataTable>
      </div>
        </AccordionTab>
        <AccordionTab header={`Respuesta PQRSDF ${filedNumber}`}>
            <div className="flex justify-between">
                <div className="mr-4 div-30">
                    <label>Tipo de respuesta</label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    optionLabel="name"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={cities}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-30">
                    <label>Enviar a<span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    optionLabel="name"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={cities}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-30">
                    <label>Responsable</label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    optionLabel="name"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={cities}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
            </div>
            <div className="flex">
                 <div className="mr-4 div-30">
                    <label>Factor</label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    optionLabel="name"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={cities}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
            </div>
            <div className="flex">
                 <div className="mr-4 div-100">
                    <label>Observación</label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <InputTextarea 
                                    id={field.name} 
                                    {...field} 
                                    rows={4} 
                                    cols={30} 
                                    className={classNames({ 'p-invalid': fieldState.error },'div-100')} 
                                />
                                <div className="flex justify-between">
                                    {getFormErrorMessage(field.name)}
                                    <span className="font-label">Max 5000 caracteres</span>
                                </div>
                            </>
                        )}
                    />
                 </div>
            </div>
            <div className="">
                <div className="col-1 col-100 seeker">
                    <div className="mr-2">
                        <Dialog 
                            visible={visibleDialog} 
                            style={{ width: '50vw' }} 
                            onHide={() => setVisibleDialog(false)}
                            closeIcon={closeIcon}
                        >
                            <UploadManagetComponen
                                
                            />
                        </Dialog>
                        <Button 
                            label="Adjuntar archivos"
                            className="flex flex-row-reverse w-52"
                            onClick={()=>setVisibleDialog(true)} 
                            text 
                            icon={<i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center">
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.99984 5.83334V11.1667" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10.6668 8.49999H5.3335" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    </i>
                                }
                        />
                    </div>
                </div>
            </div>
    </AccordionTab>
</Accordion>

    </>
  )
}
