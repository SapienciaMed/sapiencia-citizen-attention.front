import { useEffect, useRef, useState, Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { fetchData } from '../../apis/fetchData';

import { CalendarComponent } from "./calendarComponent";
import { DropDownComponent } from "./dropDownComponent";
import { InputTextComponent } from "./inputTextComponent";
import { CnputTextareaComponent } from "./inputTextarea.component";
import { ScrollPanelComponent } from "./scrollPanelComponent";
import { TriStateCheckboxComponent } from "./triStateCheckboxComponent";
import { UploadComponent } from "./uploadComponent";
import { classNames } from 'primereact/utils';
import { forStatement } from '@babel/types';

const ApiDatatypoSolicitudes = fetchData("/get-type-solicituds");
const ApiDatatypoDocument = fetchData("/get-type-docuement");
const ApiDatalegalEntity = fetchData("/get-legal-entity");
const ApiDataResponseMedium = fetchData("/get-response-medium");
const ApiDataProgramas = fetchData("/get-Programs");
const ApiDataAsuntoSolicitud = fetchData("/get-solicitudes");
const ApiDataListaParametros = fetchData("/get-listaParametros");
const ApiDataPais = fetchData("/get-paises");
const ApiDataDepartamentos = fetchData("/get-departamentos");
const ApiDataMunicipios = fetchData("/get-municipios/",'5');


export const CitizenInformation = () => {
  
  const optionSolicitudes = ApiDatatypoSolicitudes.read();
  const optionTypeDocument = ApiDatatypoDocument.read();
  const optionLegalEntity = ApiDatalegalEntity.read();
  const optionResponseMedium = ApiDataResponseMedium.read();
  const optionPrograma = ApiDataProgramas.read();
  const optionAsuntoSolicitud = ApiDataAsuntoSolicitud.read();
  const linkPoliticaCondiciones = ApiDataListaParametros.read();
  const paises = ApiDataPais.read();
  const { LPA_VALOR } = linkPoliticaCondiciones[0];
  
  const defaultValues = {
    tipoDeSolicitud: '',
    tipo:'',
    tipoEntidad:'',
    medioRespuesta:'',
    programaSolicitud:'',
    asuntoSolicitud:'',
    noDocumento:'',
    primerNombre:'',
    segundoNombre:'',
    primerApellido:'',
    segundoApellido:'',
    noContacto1:'',
    noContacto2:'',
    correoElectronico:'',
    direccion:'',
    pais:'',
    departamento:'',
    municipio:'',
    fechaNacimento:'',
    politicaTratamiento: null,
    Descripción:'',
    RazónSocial:''
  };

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getFieldState,
    reset,
    resetField,
    watch
  } = useForm({ defaultValues, mode:'all' });
  
  
  const optionDepartamento = useRef(null);
  const optionMunicipios = useRef(null);
  const showFieldPersons = useRef('');
  const showDependecia = useRef('')
  const showClasificacion = useRef('')
  const showDeptoMupio = useRef(null)
  const showMupio = useRef(null)

  const [ valueTypeSolicitud, setValueTypeSolicitud] = useState(null);
  const [ valueDocument, setValueDocument] = useState(null);
  const [ valueTypeEntidad, setValueTypeEntidad] = useState(null);
  const [ valuePais, setValuePais] = useState(null);
  const [ valueDepartamento, setValueDepartamento] = useState(null);
  const [ valueMunicipio, setValueMunicipio] = useState(null);
  const [ valueMedioRespuesta, setValueMedioRespuesta] = useState(null);
  const [ valueAsunto, setValueAsunto] = useState(null);
  const [ statuscheckBox, setstatuscheckBox] = useState(null);
  const [ program, setprogram] = useState(null);

  const seleTipoSsolicitud = ( solicitud:{TSO_CODIGO:number, TSO_DESCRIPTION:string} ) => {
    setValueTypeSolicitud( solicitud );
    
    return solicitud;
  };

  const seleTipoDocument = ( document:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} ) => {
    setValueDocument( document );

    showFieldPersons.current = document==null?'':document.LGE_ELEMENTO_DESCRIPCION

    console.log(showFieldPersons.current);
    
    switch (showFieldPersons.current) {
      case 'Cedula de Ciudadania':
        resetField('RazónSocial');
        setValueTypeEntidad(null);
        break;
      case 'Cedula de Extranjeria':
        resetField('RazónSocial');
        setValueTypeEntidad(null);
        break;
      case 'Tarjeta de Identidad':
        resetField('RazónSocial');
        setValueTypeEntidad(null);
        break;
      case 'NIT':
        resetField('primerNombre');
        resetField('segundoNombre');
        resetField('primerApellido');
        resetField('segundoApellido');
        resetField('fechaNacimento');
        break;
      case 'Anónimo':
        resetField('tipoEntidad');
        resetField('noDocumento');
        resetField('primerNombre');
        resetField('segundoNombre');
        resetField('primerApellido');
        resetField('segundoApellido');
        resetField('fechaNacimento');
        setValueTypeEntidad(null);
        break;
    
      default:
        break;
    }
    
    return document;
  };

  const seleTipeEntidad = ( entidad:{TEJ_CODIGO:number, TEJ_NOMBRE:string} ) => {
    
    setValueTypeEntidad( entidad );
    
    return entidad;
  };

  const seletDataPais = ( pais:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} )=>{
    
    setValuePais( pais );

    showDeptoMupio.current = pais == null?'':pais.LGE_CODIGO;

    if(showDeptoMupio.current == 4){

      const departamentos = ApiDataDepartamentos.read();
      optionDepartamento.current = departamentos.data;
      
    }
      
    return pais;
  };

  const seletDepartamentos = ( depart:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} )=>{
    setValueDepartamento( depart );
    
    showMupio.current = depart == null?'':depart.LGE_CODIGO;

    if( showMupio.current == 204 ){

      const municipios = ApiDataMunicipios.read();
      optionMunicipios.current =  municipios.data;
      
    }
    
    return depart;
  };

  const seletMunicipios = ( municipio:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} ) => {
    
    setValueMunicipio( municipio );
    
    return municipio;
  };

  const selePrograma = ( programa :{CLP_CODIGO:number,CLP_DESCRIPCION:string; DEP_CODIGO:number,DEP_DESCRIPCION:string ; PRG_CODIGO:number,PRG_DESCRIPCION:string  })=>{
    setprogram( programa );
    
    showDependecia.current = programa == null?'': programa.DEP_DESCRIPCION;
    showClasificacion.current = programa == null?'': programa.CLP_DESCRIPCION;
    
    console.log( programa );
    
    return programa
  }

  const seletMedioRespuesta = ( respuesta:{MRE_CODIGO:number, MRE_DESCRIPCION:string} ) => {
    
    setValueMedioRespuesta( respuesta );
    
    return respuesta;
  };

  const seletSolicitud = ( respuesta:{ASO_CODIGO:number, ASO_ASUNTO:string} ) => {
    
    setValueAsunto( respuesta );
    
    return respuesta;
  };

  
  const checkBox = (dato:{status:boolean | null}) => {
    setstatuscheckBox( dato )

    const estado = dato ? true: null;
    
    return estado;
  }

  const onSubmit = (data) => {
    
    console.log( data );
    setValueTypeSolicitud(null);
    setValueDocument(null);
    setValueTypeEntidad(null);
    setValuePais(null);
    setValueDepartamento(null);
    setValueMunicipio(null);
    setValueMedioRespuesta(null);
    setValueAsunto(null);
    setstatuscheckBox(null);
    setprogram(null);
    showDependecia.current = '';
    showClasificacion.current = '';

    reset();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };
 
  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="form-container" 
    >
      <div className="div-container" style={{marginBottom:'0'}}>

        <div className='row-1 width-25'>
          <label className='font-label'>Tipo de solicitud<span className='required'>*</span></label>
          <Controller
            name="tipoDeSolicitud"
            control={control}
            rules={{ required: 'Campo obligatorio.'}}
            render={({ field, fieldState, }) => (
              <>
              <Suspense fallback={ <div>Cargando...</div>}>
                <DropDownComponent
                    id={field.value}
                    value={valueTypeSolicitud}
                    optionLabel= {'TSO_DESCRIPTION'}
                    className={classNames({ 'p-invalid': fieldState.error } ,'!h-10')}
                    onChange={(e) => field.onChange( seleTipoSsolicitud(e.value) )}
                    focusInputRef={field.ref}
                    options={ optionSolicitudes.data }
                    placeholder='Seleccionar'
                    width='100%'
                  />
              </Suspense>
              </>
            )}
          />
          {getFormErrorMessage('tipoDeSolicitud')}
        </div>
        
        <span className='split'></span>

        <div className='div-container width-50'>

          <div className='row-1 width-50'>
            <label className='font-label'>Tipo<span className='required'>*</span></label>
            <Controller
              name="tipo"
              control={control}
              rules={{ required: 'Campo obligatorio.'}}
              render={({ field, fieldState }) => (
                <>
                <Suspense fallback={ <div>Cargando...</div>}>
                  <DropDownComponent
                      id={field.name}
                      value={valueDocument}
                      optionLabel={'LGE_ELEMENTO_DESCRIPCION'}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange( seleTipoDocument(e.value))}
                      focusInputRef={field.ref}
                      options={ optionTypeDocument.data }
                      placeholder='Seleccionar'
                      width='100%'
                    />
                </Suspense>
                </>
              )}
            />
            {getFormErrorMessage('tipo')}
          </div>

          <span style={{width:'2%'}}></span>

          {showFieldPersons.current != 'Anónimo'?(
            <>
              <div className='row-1 width-50'>
                <label className='font-label'>No. documento<span className='required'>*</span></label>
                <Controller
                  name="noDocumento"
                  control={control}
                  rules={{ 
                    required: 'Campo obligatorio.',
                    maxLength: {value:15, message:'Solo se permiten 15 caracteres'},
                  }}
                  render={({ field, fieldState }) => (
                    <>
                    
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="100%"
                      />
                      {getFormErrorMessage('noDocumento')}
                      { /*noDocumento.length > 15?(<p className=''>Longitud 15 caracteres</p>):(<></>)*/}
                    </>
                  )}
                />
            </div>
            </>):(<></>)
          }
        </div>

        <span className='split'></span>

        { showFieldPersons.current == 'NIT' ?(

          <div className='row-1 width-25'>
            <label className='font-label'>Tipo entidad<span className='required'>*</span></label>
            <Controller
              name="tipoEntidad"
              control={control}
              rules={{ required: 'Campo obligatorio.' }}
              render={({ field, fieldState }) => (
                <>
                <Suspense fallback={ <div>Cargando...</div>}>
                  <DropDownComponent
                    id={field.name}
                    value={ valueTypeEntidad }
                    className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                    onChange={(e) => field.onChange(seleTipeEntidad(e.value))}
                    focusInputRef={field.ref}
                    optionLabel={'TEJ_NOMBRE'}
                    options={ optionLegalEntity.data }  
                    placeholder='Seleccionar'
                    width='100%'
                  />
                </Suspense>
                </>
              )}
            />
            {getFormErrorMessage('tipoEntidad')}
          </div>

          ):( <></>)

        }


      </div>  

      <div className="div-container">

        <div style={{width:'100%', marginBottom:'18px'}} >
          <h2 className='tittle-h2'>Información del ciudadano</h2>
        </div>
        
        {showFieldPersons.current == 'NIT' ?(
            <div className='row-1 width-50'>
              <label className='font-label'>Razón social<span className='required'>*</span></label>
              <Controller
                name="RazónSocial"
                control={control}
                rules={{ 
                  required: 'Campo obligatorio.',
                  maxLength: { value:200, message:'Solo se permiten 200 caracteres'} 
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder=''
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage('RazónSocial')}
            </div>
        
        ):(<></>)
        }
        
        {showFieldPersons.current != 'NIT' ?(
          
          <>
            {showFieldPersons.current != 'Anónimo' ?(
            <>

              <div className='row-1 width-25'>
                <label className='font-label'>Primer nombre<span className='required'>*</span></label>
                <Controller
                  name="primerNombre"
                  control={control}
                  rules={{ 
                    required: 'Campo obligatorio.',
                    maxLength: { value:50, message:'Solo se permiten 50 caracteres'}  
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="100%"
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('primerNombre')}
              </div>

              <span className='split'></span>

              <div className="div-container"></div>

              <div className='row-1 width-25' >
                <label className='font-label'>Segundo nombre</label>
                <Controller
                  name="segundoNombre"
                  control={control}
                  rules={{
                    maxLength: { value:50, message:'Solo se permiten 50 caracteres'} 
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="100%"
                    />
                    {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              <span className='split'></span>

              <div className='row-1 width-25'>
                <label className='font-label'>Primer apellido<span className='required'>*</span></label>
                <Controller
                  name="primerApellido"
                  control={control}
                  rules={{ 
                    required: 'Campo obligatorio.',
                    maxLength: { value:50, message:'Solo se permiten 50 caracteres'}  
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="100%"
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('primerApellido')}
              </div>

              <span className='split'></span>

              <div className='row-1 width-25' >
                <label className='font-label'>Segundo apellido</label>
                <Controller
                  name="segundoApellido"
                  control={control}
                  rules={{
                    maxLength: { value:50, message:'Solo se permiten  50 caracteres'} 
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="100%"
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('segundoApellido')}
              </div>

            </>
            ):(<></>)}

          </>
          ):(<></>)
        }
      </div>

      <div className="div-container">

        {showFieldPersons.current != 'NIT'?(
          <>
            {showFieldPersons.current != 'Anónimo'?(
              <>
                <div className='row-1 width-25'>
                  <label className='font-label'>Fecha de nacimiento<span className='required'>*</span></label>
                  <Controller
                    name="fechaNacimento"
                    control={control}
                    rules={{ required: 'Campo obligatorio.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <CalendarComponent
                          inputId={field.name} 
                          value={field.value} 
                          onChange={field.onChange} 
                          dateFormat="dd/mm/yy" 
                          className={classNames({ 'p-invalid ': fieldState.error },'!h-10 pi pi-spin pi-cog')}
                      
                        />
                        <span className="p-input-icon-right"></span>
                      </>
                    )}
                  />
                  {getFormErrorMessage('fechaNacimento')}
                </div>

                <span className='split'></span>
                
                <div className='row-1 width-25'>
                  <label className='font-label'>No. De contacto 1<span className='required'>*</span></label>
                  <Controller
                    name="noContacto1"
                    control={control}
                    rules={{ 
                      required: 'Campo obligatorio.',
                      maxLength: { value:10, message:'Solo se permiten 10 caracteres'}  
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder=''
                          width="100%"
                          keyfilter='int'
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage('noContacto1')}
                </div>

                <span className='split'></span>

                <div className='row-1 width-25'>
                  <label className='font-label'>No. De contacto 2</label>
                  <Controller
                    name="noContacto2"
                    control={control}
                    rules={{
                      maxLength: { value:10, message:'Solo se permiten 10 caracteres'} 
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder=''
                          width="100%"
                          keyfilter='int'
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

              </>
            ):(<></>)
            }
          </>
        ):(<></>)
        }
      </div>

      <div className="div-container">

        { showFieldPersons.current != 'Anónimo'?(
          <>
            <div className='row-1 width-50'>
              <label className='font-label'>Correo electrónico<span className='required'>*</span></label>
              <Controller
                name="correoElectronico"
                control={control}
                rules={{
                  required: "Este campo es obligatorio",
                  maxLength: { value:100, message:'Solo se permiten 100 caracteres'}, 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: "Correo electrónico no válido",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder=''
                      keyfilter='email'
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage('correoElectronico')}
            </div>

            <span className='split'></span>

            <div className='row-1 width-50'>
              <label className='font-label'>Dirección<span className='required'>*</span></label>
              <Controller
                name="direccion"
                control={control}
                rules={{ 
                  required: 'Campo obligatorio.',
                  maxLength: { value:300, message:'Solo se permiten 300 caracteres'}  
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder=''
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage('direccion')}
            </div>

          </>
          ):(<></>)
        }

      </div>

      <div className="div-container">
        <div className='row-1 width-25'>
          <label className='font-label'>País<span className='required'>*</span></label>
          <Controller
            name="pais"
            control={control}
            rules={{ required: 'Campo obligatorio.' }}
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={ valuePais }
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange(seletDataPais(e.value))}
                  focusInputRef={field.ref}
                  optionLabel='LGE_ELEMENTO_DESCRIPCION'
                  options={ paises.data }
                  placeholder='Selecionar'
                  width="100%"
                />
              </>
            )}
          />
          {getFormErrorMessage('pais')}
        </div>

        <span className='split'></span>

        { showDeptoMupio.current == 4?(
        <>
          <div className='row-1 width-25'>
            <label className='font-label'>Departamento<span className='required'>*</span></label>
            <Controller
              name="departamento"
              control={control}
              rules={{ required: 'Campo obligatorio.' }}
              render={({ field, fieldState }) => (
                <>
                  <DropDownComponent
                    id={field.name}
                    value={ valueDepartamento }
                    className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                    onChange={(e) => field.onChange(seletDepartamentos(e.value))}
                    focusInputRef={field.ref}
                    optionLabel='LGE_ELEMENTO_DESCRIPCION'
                    options={ optionDepartamento.current }
                    placeholder='Selecionar'
                    width="100%"
                  />
                </>
              )}
            />
            {getFormErrorMessage('departamento')}
        </div>
        </>):(<></>)
        }

        <span className='split'></span>
        
        { showDeptoMupio.current == 4?(
        <>
          { showMupio.current == 204?(
          <>
            <div className='row-1 width-25'>
              <label className='font-label'>Municipio<span className='required'>*</span></label>
              <Controller
                name="municipio"
                control={control}
                rules={{ required: 'Campo requerido.' }}
                render={({ field, fieldState }) => (
                  <>
                    <DropDownComponent
                      id={field.name}
                      value={valueMunicipio}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange(seletMunicipios(e.value))}
                      focusInputRef={field.ref}
                      optionLabel='LGE_ELEMENTO_DESCRIPCION'
                      options={ optionMunicipios.current }
                      placeholder='Selecionar'
                      width="100%"
                    />
                  </>
                )}
              />
              {getFormErrorMessage('municipio')}
        </div>
          </>):(<></>)
          }
        </>):(<></>)}

      </div>

      <div className="div-container">

        <div className='row-1 width-50'>
          <label className='font-label'>Seleccione el medio por el cual quiere recibir la respuesta<span className='required'>*</span></label>
          <Controller
            name="medioRespuesta"
            control={control}
            rules={{ required: 'Campo obligatorio.' }}
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={valueMedioRespuesta}
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange(seletMedioRespuesta(e.value))}
                  focusInputRef={field.ref}
                  optionLabel='MRE_DESCRIPCION'
                  options={ optionResponseMedium.data }   
                  placeholder='Seleccionar'
                  width='100%'
              />
              </>
            )}
          />
          {getFormErrorMessage('medioRespuesta')}
        </div>

      </div>

      <div className="div-container">

        <div className='row-1 width-50'>
          <label className='font-label'>Programa al que aplica la solicitud<span className='required'>*</span></label>
          <Controller
            name="programaSolicitud"
            control={control}
            rules={{ required: 'Campo obligatorio.' }}
            render={({ field, fieldState }) => (
              <>
              <Suspense fallback={ <div>Cargando...</div>}>
                <DropDownComponent
                  id={field.name}
                  value={program}
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange( selePrograma(e.value))}
                  focusInputRef={field.ref}
                  optionLabel='PRG_DESCRIPCION'
                  options={ optionPrograma.data }  
                  placeholder='Seleccionar'
                  width='100%'
                />
              </Suspense>
              </>
            )}
          />
          {getFormErrorMessage('programaSolicitud')}
        </div>

        <span className='split'></span>

        <div className='row-1 width-50'>
          <label className='font-label'>Asunto de la solicitud<span className='required'>*</span></label>
          <Controller
            name="asuntoSolicitud"
            control={control}
            rules={{ required: 'Campo obligatorio.' }}
            render={({ field, fieldState }) => (
              <>
              <Suspense fallback={ <div>Cargando...</div>}>
                <DropDownComponent
                  id={field.name}
                  value={valueAsunto}
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange(seletSolicitud(e.value))}
                  focusInputRef={field.ref}
                  optionLabel='ASO_ASUNTO'
                  options={ optionAsuntoSolicitud.data }  
                  placeholder='Seleccionar'
                  width='100%'
                />
              </Suspense>
              </>
            )}
          />
          {getFormErrorMessage('asuntoSolicitud')}
        </div>
      </div>

      <div className="div-container">
        <div className='row-1 width-50'>
          <label className='font-label'>Clasificación</label>
          <InputTextComponent
            placeholder={showClasificacion.current}
            width=""
            disabled={true} 
            className='mi-input !h-10'
          />
        </div>

        <span className='split'></span>

        <div className='row-1 width-50'>
          <label className='font-label'>Dependencia</label>
          <InputTextComponent
            placeholder={showDependecia.current }
            width=""
            disabled={true}
            className='mi-input !h-10' 
          />
        </div>
      </div>

      <div className="div_container width-100">
          <label className='font-label'>Descripción<span className='required'>*</span></label>
          <Controller
            name="Descripción"
            control={control}
            rules={{ 
              required: 'Campo obligatorio.',
              maxLength: { value:5000, message:'Solo se permiten 5000 caracteres'}  
            }}
            render={({ field, fieldState }) => (
              <>
                <CnputTextareaComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.target.value)}
                />  
              </>
            )}
          />
          <div className='alert-textarea'>
            {getFormErrorMessage('Descripción')}
            <span className='font-label'>Max 5000 caracteres</span>
          </div>
      </div>

      <div className="div-upload">
        <label className='font-label'>Archivos o documentos que soportan la solicitud</label>
        <UploadComponent/>
      </div>

      <div className="div_container" style={{marginBottom:'20px'}} >
        <label className='font-label'>Aviso de privacidad</label>
        <ScrollPanelComponent/>
      </div>

      <div className="div_container width-100" style={{marginBottom:'20px'}}>
        <label className='font-label'>Para conocer la Política de Tratamiento y Protección de datos personales de Sapiencia, dar click <a href={LPA_VALOR} style={{color:'#533893'}} target="_blank">aquí</a> </label>
        <Controller
          name="politicaTratamiento"
          control={control}
          rules={{ required: 'Campo obligatorio.' }}
          render={({ field, fieldState }) => (
            <>
              <TriStateCheckboxComponent
                id={field.name}
                value={field.value} 
                onChange={(e) => field.onChange(checkBox(e.value))} 
                className={classNames({ 'p-invalid': fieldState.error }, )} 
              />
              {getFormErrorMessage(field.name)}
                  
            </>
          )}
        />
      </div>

      <div>
      <Button
        disabled={ !isValid }
        rounded
        label="Enviar solicitud"
        className="!px-10 !text-sm btn-sumit"
     />
      </div>
        
    </form>
  )
}
