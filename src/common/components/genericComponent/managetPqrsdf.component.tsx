import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import moment from 'moment-timezone';
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { toLocaleDate } from "../../utils/helpers";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { UploadComponent } from "../componentsRegisterPqrsdf/uploadComponent";

import { mastersTablesServices } from "../../hooks/masterTables.hook";
import { usePqrsdfService } from "../../hooks/PqrsdfService.hook";
import { Countrys, IMResponseMedium, 
         Departament, IMunicipality, 
         ItypeRFequest, IlegalEntityType, 
         IProgram, 
         ISubjectRequest} from "../../interfaces/mastersTables.interface";


interface City {
    name: string;
    code: string;
}

export const ManagetPqrsdfComponent = () => {

    const mastetablesServices = mastersTablesServices();
    const pqrsdfService = usePqrsdfService();
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
    
    const getInfoPqrsdf = async (id:number)=>{
        const infoPqrsdf = pqrsdfService.getPqrsdfById(id);
        return infoPqrsdf
    }

    const getDataMasterTables = async() =>{
        const typeRequest = await mastetablesServices.getTypeRequest();
        const typeLegalEntity = await mastetablesServices.getTypeLegalentity();
        const ArrayCountry = await mastetablesServices.getCountrys();
        const arrayDepartament = await mastetablesServices.getDepartament();
        const arrayMunicipality = await mastetablesServices.getMunicipality();
        const arrayResposeMediun = await mastetablesServices.getResponseMediun();
        const arrayPrograms = await mastetablesServices.getProgram();
        const arraySubjectRequest = await mastetablesServices.getSbjectRequest();
        return {
            typeRequest,
            typeLegalEntity,
            ArrayCountry,
            arrayDepartament,
            arrayMunicipality,
            arrayResposeMediun,
            arrayPrograms,
            arraySubjectRequest
        }   
    };

    useEffect(()=>{
        getDataMasterTables().then(({
            typeRequest, typeLegalEntity,
            ArrayCountry, arrayDepartament,
            arrayMunicipality, arrayResposeMediun,
            arrayPrograms, arraySubjectRequest})=>{
            setTypeRequest(typeRequest.data);
            setTypelegalEntity(typeLegalEntity.data);
            setCountrys(ArrayCountry.data);
            setDepartamets(arrayDepartament.data);
            setMunicipalitys(arrayMunicipality.data);
            setResponsesMediuns(arrayResposeMediun.data);        
            setPrograms(arrayPrograms.data);
            setSubjectRequests(arraySubjectRequest.data)
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

            setValue('description','sdasdsadsad')
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

    <Accordion activeIndex={1} style={{width:'61em'}}>
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
                htmlFor="modal"
                onClick={() => {}}
                >
                    <span className="mr-2 text-red-600">Ver adjunto</span>
                
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.00008 5.83331V11.1666"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                        </path>
                        <path
                            d="M10.6666 8.50002H5.33325"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                        </path>
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                        </path>
                    </svg>
                </label>
                <Button label="Show" style={{ display: "none" }} name="modal" id="modal" onClick={() => {}} />
                <Dialog
                header="Si tienes más de un documento, se deben unir en un solo archivo para ser cargados"
                className="text-center div-modal movil"
                visible={false}
                onHide={() => {}}
                pt={{
                    root: { style: { width: "35em" } },
                }}
                >
                    <Controller
                        name="file"
                        control={control}
                        render={({ field, fieldState }) => (
                        <>
                            <UploadComponent
                            id={field.name}
                            dataArchivo={(e: File) => field.onChange(e)}
                            showModal={(e: boolean) => field.onChange(e)}
                            />
                        </>
                        )}
                    />
                    <Button
                        className="mt-8"
                        style={{ backgroundColor: "533893" }}
                        onClick={() => {}}
                        label="Cancelar"
                        rounded
                    />
                </Dialog>
            </div>   
        </AccordionTab>
        <AccordionTab header="Documentos de apoyo interno">
        <div className="overflow-hidden max-w-[calc(111vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] block md:block borderless reverse-striped">
            <DataTable
                value={[]}
                paginator
                stripedRows
                selectionMode="single"
                dataKey="id"
                scrollable
                globalFilterFields={['names','program','asunto','estado','radicado', 'identification','fechaRadicado','dias']}
            >
                <Column 
                    style={{ textAlign: "center" }} 
                    className="!font-sans" field="user" 
                    header="Usuario "></Column>
                <Column 
                    style={{ textAlign: "center" }}
                    className="!font-sans" 
                    field="visibleBeneficiary" 
                    header={<p style={{width:'112px'}}>Visible para beneficiario</p>}>
                </Column>
                <Column
                    field="accion"
                    header="Acción"
                    className="!font-sans"
                    style={{ textAlign: "center"}}
                ></Column>
            </DataTable>
      </div>
        </AccordionTab>
        <AccordionTab header="Respuesta PQRSDF XXXXXXXXXXXX:">
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
            <div className="">
                <label
                className="upload-label"
                style={{ display: "flex", alignItems: "center" }}
                htmlFor="modal"
                onClick={() => {}}
                >
                    <span className="mr-2 text-red-600">Adjuntar archivo</span>
                
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.00008 5.83331V11.1666"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                        </path>
                        <path
                            d="M10.6666 8.50002H5.33325"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                        </path>
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z"
                            stroke="#533893"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                        </path>
                    </svg>
                </label>
                <Button label="Show" style={{ display: "none" }} name="modal" id="modal" onClick={() => {}} />
                <Dialog
                header="Si tienes más de un documento, se deben unir en un solo archivo para ser cargados"
                className="text-center div-modal movil"
                visible={false}
                onHide={() => {}}
                pt={{
                    root: { style: { width: "35em" } },
                }}
                >
                    <Controller
                        name="file"
                        control={control}
                        render={({ field, fieldState }) => (
                        <>
                            <UploadComponent
                            id={field.name}
                            dataArchivo={(e: File) => field.onChange(e)}
                            showModal={(e: boolean) => field.onChange(e)}
                            />
                        </>
                        )}
                    />
                    <Button
                        className="mt-8"
                        style={{ backgroundColor: "533893" }}
                        onClick={() => {}}
                        label="Cancelar"
                        rounded
                    />
                </Dialog>
            </div> 
            </div>
    </AccordionTab>
</Accordion>

    </>
  )
}
