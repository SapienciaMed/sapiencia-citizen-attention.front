import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { UploadComponent } from "../componentsRegisterPqrsdf/uploadComponent";

import { mastersTablesServices } from "../../hooks/masterTables.hook"
import { Countrys, Departament, IMunicipality, ItypeRFequest, tej_nombre } from "../../interfaces/mastersTables.interface";

interface MasterTable {

}

interface City {
    name: string;
    code: string;
}

export const ManagetPqrsdfComponent = () => {
    const mastetablesServices = mastersTablesServices()

    const [typeReques, setTypeRequest] = useState<ItypeRFequest[]>();
    const [typelegalEntity, setTypelegalEntity] = useState<tej_nombre[]>();
    const [countrys, setCountrys] = useState<Countrys[]>();
    const [departamets, setDepartamet] = useState<Departament[]>();
    const [municipalitys, setMunicipalitys] = useState<IMunicipality[]>();

    const getDataMasterTables = async() =>{
        const typeRequest = await mastetablesServices.getTypeRequest();
        const typeLegalEntity = await mastetablesServices.getTypeLegalentity();
        const coutry = await mastetablesServices.getCountrys();
        const departament = await mastetablesServices.getDepartament();
        const municipality = await mastetablesServices.getMunicipality();
        return {
            typeRequest,
            typeLegalEntity,
            coutry,
            departament,
            municipality
        }   
    }

    useEffect(()=>{
        getDataMasterTables().then(({typeRequest,typeLegalEntity,coutry,departament,municipality})=>{
            setTypeRequest(typeRequest.data);
            setTypelegalEntity(typeLegalEntity.data);
            setCountrys(coutry.data);
            setDepartamet(departament.data);
            setMunicipalitys(municipality.data);
        })
    },[])

    const cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const defaultValues = {
        typeOfRequest: "",
        noDocument: "",
        typeLegalEntity:'',
        nameCountry:'',
        nameDepartament:'',
        municipality:'',
        file:''
        //tipo: "",
        //medioRespuesta: "",
       // programaSolicitud: "",
       // asuntoSolicitud: "",
   
       // primerNombre: "",
       // segundoNombre: "",
       // primerApellido: "",
       // segundoApellido: "",
       // noContacto1: "",
       // noContacto2: "",
       // correoElectronico: "",
       // direccion: "",
       // pais: "",
       // departamento: "",
       // municipio: "",
       // fechaNacimento: null,
       // politicaTratamiento: null,
        //Descripcion: "",
        //RazonSocial: "",
        //archivo: "",
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
    <div className="flex justify-between items-center">
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
                            value={field.value}
                            optionLabel="tso_description"
                            placeholder="Seleccionar"
                            showClear 
                            options={typeReques}
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
            <label>Doc. Identidad</label>
            <Controller
                name="noDocument"
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
                                disabled
                                className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100 input-desabled')}
                                onChange={(e) => field.onChange(e.target.value)} />
                        </span>
                        {getFormErrorMessage(field.name)}
                    </>
                )}
            />
        </div>
    
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
                            value={field.value}
                            optionLabel="tej_nombre"
                            placeholder="Seleccionar"
                            showClear 
                            options={typelegalEntity}
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

    <Accordion style={{width:'61em'}}>
        <AccordionTab header="Información del ciudadano">
            <div className="flex">
                <div className="mr-4">
                    <label>Razón socia<span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
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
                 <div className="mr-4">
                    <label>Primer nombre<span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
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
                 <div className="mr-4">
                    <label>Segundo nombre</label>
                    <Controller
                        name="noDocument"
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
                 <div className="mr-4">
                    <label>Primer Apellido<span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
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
                 <div className="mr-4">
                    <label>Segundo Apellido</label>
                    <Controller
                        name="noDocument"
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
            </div>
            <div className="flex">
                 <div className="mr-4">
                    <label>Fecha de nacimiento<span className="text-red-600">*</span></label>
                    <br />
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <span className="p-input-icon-right">
                                    <Calendar 
                                        inputId={field.name} 
                                        value={field.value} 
                                        onChange={field.onChange} 
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
                 <div className="mr-4">
                    <label>Número de contacto 1</label>
                    <Controller
                        name="noDocument"
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
                 <div className="mr-4">
                    <label>Número de contacto 2<span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
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
            </div> 
            <div className="flex">
                 <div className="mr-4 div-50">
                    <label>Correo electrónico<span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
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
                        name="noDocument"
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
                                        className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100')}
                                        onChange={(e) => field.onChange(e.target.value)} />
                                </span>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
            </div>
            <div className="flex items-center">
                <div className="mr-4 div-25">
                    <label>País</label>
                    <Controller
                        name="nameCountry"
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
                                    optionLabel="LGE_ELEMENTO_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={countrys}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
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
                        name="nameDepartament"
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
                                    optionLabel="LGE_ELEMENTO_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={departamets}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center')}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-25">
                    <label>Municipio</label>
                    <Controller
                        name="municipality"
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
                                    optionLabel="LGE_ELEMENTO_DESCRIPCION"
                                    placeholder="Seleccionar"
                                    showClear 
                                    options={municipalitys}
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
            <div className="flex justify-between items-center">
                 <div className="mr-4 div-50">
                    <label>Seleccione el medio por el cual quiere recibir la respuesta</label>
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
                    <label>Programa al que aplica la solicitud</label>
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
                <div className="mr-4 div-50">
                    <label>Asunto de la solicitud<span className="text-red-600">*</span></label>
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
                 <div className="mr-4 div-50">
                    <label>Clasificación <span className="text-red-600">*</span></label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <InputText 
                                    id={field.name} 
                                    value={field.value} 
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100')}
                                    onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                 </div>
                 <div className="mr-4 div-50">
                    <label>Dependencia </label>
                    <Controller
                        name="noDocument"
                        control={control}
                        rules={{
                            required: 'Campo obligatorio.',
                            maxLength: { value: 200, message: "Solo se permiten 200 caracteres" },
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <InputText 
                                id={field.name} 
                                value={field.value} 
                                className={classNames({ 'p-invalid': fieldState.error },'h-10 flex items-center div-100')}
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
