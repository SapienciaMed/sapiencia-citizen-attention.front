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
  
 
  
  
  const optionDepartamento = useRef(null);
  const optionMunicipios = useRef(null);
  const showFieldPersons = useRef('');
  const showDependecia = useRef('')
  const showClasificacion = useRef('')
  const showDeptoMupio = useRef(null)
  const showMupio = useRef(null)

  const [ valueDocument, setValueDocument] = useState(null);
  const [ valuePais, setValuePais] = useState(null);
  const [ valueDepartamento, setValueDepartamento] = useState(null);
  const [ statuscheckBox, setstatuscheckBox] = useState(null);
  const [ program, setprogram] = useState(null);


  const seleTipoDocument = ( document:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} ) => {
    setValueDocument( document );
    console.log(document);
    
    showFieldPersons.current = document.LGE_ELEMENTO_DESCRIPCION

    return document;
  };

  const seletDataPais = ( pais:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} )=>{
    
    setValuePais( pais );

    showDeptoMupio.current = pais.LGE_CODIGO;

    if(pais.LGE_CODIGO == 4){

      const departamentos = ApiDataDepartamentos.read();
      optionDepartamento.current = departamentos.data;
      
    }
      
    return pais;
  };

  const seletDepartamentos = ( depart:{LGE_CODIGO:number, LGE_ELEMENTO_DESCRIPCION:string} )=>{
    setValueDepartamento( depart );
    
    showMupio.current = depart.LGE_CODIGO;

    if( depart.LGE_CODIGO == 204 ){

      const municipios = ApiDataMunicipios.read();
      optionMunicipios.current =  municipios.data;
      
    }
    
    return depart;
  };

  const selePrograma = ( programa :{CLP_CODIGO:number,CLP_DESCRIPCION:string; DEP_CODIGO:number,DEP_DESCRIPCION:string ; PRG_CODIGO:number,PRG_DESCRIPCION:string  })=>{
    setprogram( programa );
    
    showDependecia.current = programa.DEP_DESCRIPCION
    showClasificacion.current = programa.CLP_DESCRIPCION
    
   
    console.log( programa );
    
    return programa
  }

  
  const checkBox = (dato:{status:boolean | null}) => {
    setstatuscheckBox( dato )

    const estado = dato ? true: null;
    
    return estado;
  }

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
    reset,
  } = useForm({ defaultValues });
 
  const onSubmit = (data) => {
    data;
    
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
      <div className="div-container">

        <div className='row-1'>
          <label>Tipo de solicitud<span className='required'>*</span></label>
          <Controller
            name="tipoDeSolicitud"
            control={control}
            rules={{ required: 'Requerido.' }}
            render={({ field, fieldState, }) => (
              <>
              <Suspense fallback={ <div>Cargando...</div>}>
                <DropDownComponent
                    id={field.value}
                    value={field.value}
                    optionLabel= {'TSO_DESCRIPTION'}
                    className={classNames({ 'p-invalid': fieldState.error } ,'!h-10')}
                    onChange={(e) => field.onChange(e.value)}
                    focusInputRef={field.ref}
                    options={ optionSolicitudes.data  }
                    placeholder='Seleccionar'
                    width='95%'
                  />
              </Suspense>
              </>
            )}
          />
          {getFormErrorMessage('tipoDeSolicitud')}
        </div>

        <div className='div-container'>

          <div className='row-1'>
            <label>Tipo<span className='required'>*</span></label>
            <Controller
              name="tipo"
              control={control}
              rules={{ required: 'Requerido.'}}
              render={({ field, fieldState }) => (
                <>
                <Suspense fallback={ <div>Cargando...</div>}>
                  <DropDownComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange( seleTipoDocument(e.value))}
                      focusInputRef={field.ref}
                      optionLabel={'LGE_ELEMENTO_DESCRIPCION'}
                      options={ optionTypeDocument.data }
                      placeholder='Seleccionar'
                      width='254px'
                    />
                </Suspense>
                </>
              )}
            />
            {getFormErrorMessage('tipo')}
          </div>
          <span className='split'></span>
          <div className='row-1'>
            <label>No. documento<span className='required'>*</span></label>
            <Controller
              name="noDocumento"
              control={control}
              rules={{ required: 'Requerido.' }}
              render={({ field, fieldState }) => (
                <>
                  <InputTextComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder=''
                    width="280px"
                  />
                </>
              )}
            />
            {getFormErrorMessage('noDocumento')}
          </div>

        </div>

        <span className='split'></span>

        { showFieldPersons.current == 'NIT' ?(

          <div className='row-1'>
            <label>Tipo entidad<span className='required'>*</span></label>
            <Controller
              name="tipoEntidad"
              control={control}
              rules={{ required: 'Requerido.' }}
              render={({ field, fieldState }) => (
                <>
                <Suspense fallback={ <div>Cargando...</div>}>
                  <DropDownComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                    onChange={(e) => field.onChange(e.value)}
                    focusInputRef={field.ref}
                    optionLabel={'TEJ_NOMBRE'}
                    options={ optionLegalEntity.data }  
                    placeholder='Seleccionar'
                    width='95%'
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

        <div style={{width:'100%'}}>
          <h2 className='tittle-h2'>Información del ciudadano</h2>
        </div>
        
        {showFieldPersons.current == 'NIT' ?(
            <div className='row-1'>
              <label>Razón social<span className='required'>*</span></label>
              <Controller
                name="RazónSocial"
                control={control}
                rules={{ required: 'Requerido.' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder=''
                      width="50%"
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

              <div className='row-1'>
                <label>Primer nombre<span className='required'>*</span></label>
                <Controller
                  name="primerNombre"
                  control={control}
                  rules={{ required: 'Requerido.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="95%"
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('primerNombre')}
              </div>

              <div className='row-1' >
                <label>Segundo nombre</label>
                <Controller
                  name="segundoNombre"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="95%"
                    />
                    {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              <div className='row-1'>
                <label>Primer apellido<span className='required'>*</span></label>
                <Controller
                  name="primerApellido"
                  control={control}
                  rules={{ required: 'Requerido.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="95%"
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('primerApellido')}
              </div>

              <div className='row-1' >
                <label>Segundo apellido</label>
                <Controller
                  name="segundoApellido"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextComponent
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder=''
                        width="95%"
                      />
                    </>
                  )}
                />
              </div>

            </>
            ):(<></>)}

          </>
          ):(<></>)
        }
      </div>

      <div className="container-2">

        {showFieldPersons.current != 'NIT'?(
          <>
            {showFieldPersons.current != 'Anónimo'?(
              <>
                <div className='row-1'>
                  <label>Fecha de nacimiento<span className='required'>*</span></label>
                  <Controller
                    name="fechaNacimento"
                    control={control}
                    rules={{ required: 'Requerido.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <CalendarComponent
                          inputId={field.name} 
                          value={field.value} 
                          onChange={field.onChange} 
                          dateFormat="dd/mm/yy" 
                          className={classNames({ 'p-invalid ': fieldState.error },'!h-10')}
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage('fechaNacimento')}
                </div>

                <div className='row-1'>
                  <label>No. De contacto 1<span className='required'>*</span></label>
                  <Controller
                    name="noContacto1"
                    control={control}
                    rules={{ required: 'Requerido.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextComponent
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder=''
                          width="95%"
                          keyfilter='int'
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage('noContacto1')}
                </div>

                  <div className='row-1'>
                    <label>No. De contacto 2</label>
                    <Controller
                      name="noContacto2"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextComponent
                            id={field.name}
                            value={field.value}
                            className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder=''
                            width="95%"
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
            <div className='row-2'>
              <label>Correo electrónico<span className='required'>*</span></label>
              <Controller
                name="correoElectronico"
                control={control}
                rules={{}}
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

            <div className='row-2'>
              <label>Dirección<span className='required'>*</span></label>
              <Controller
                name="direccion"
                control={control}
                rules={{ required: 'Requerido.' }}
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

      <div className="container-2">
        <div className='row-1'>
          <label>País<span className='required'>*</span></label>
          <Controller
            name="pais"
            control={control}
            rules={{ required: 'Campo requerido.' }}
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={ field.value }
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange(seletDataPais(e.value))}
                  focusInputRef={field.ref}
                  optionLabel='LGE_ELEMENTO_DESCRIPCION'
                  options={ paises.data }
                  placeholder='Selecionar'
                  width="280px"
                />
              </>
            )}
          />
          {getFormErrorMessage('pais')}
        </div>

        <span className='split'></span>
        { showDeptoMupio.current == 4?(
        <>
          <div className='row-1'>
            <label>Departamento<span className='required'>*</span></label>
            <Controller
              name="departamento"
              control={control}
              rules={{ required: 'Campo requerido.' }}
              render={({ field, fieldState }) => (
                <>
                  <DropDownComponent
                    id={field.name}
                    value={ field.value }
                    className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                    onChange={(e) => field.onChange(seletDepartamentos(e.value))}
                    focusInputRef={field.ref}
                    optionLabel='LGE_ELEMENTO_DESCRIPCION'
                    options={ optionDepartamento.current}
                    placeholder='Selecionar'
                    width="280px"
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
            <div className='row-1'>
              <label>Municipio<span className='required'>*</span></label>
              <Controller
                name="municipio"
                control={control}
                rules={{ required: 'Campo requerido.' }}
                render={({ field, fieldState }) => (
                  <>
                    <DropDownComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                      onChange={(e) => field.onChange(e.value)}
                      focusInputRef={field.ref}
                      optionLabel='LGE_ELEMENTO_DESCRIPCION'
                      options={ optionMunicipios.current }
                      placeholder='Selecionar'
                      width="280px"
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

        <div className='row-1'>
          <label>Seleccione el medio por el cual quiere recibir la respuesta<span className='required'>*</span></label>
          <Controller
            name="medioRespuesta"
            control={control}
            rules={{ required: 'Requerido.' }}
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  optionLabel='MRE_DESCRIPCION'
                  options={ optionResponseMedium.data }   
                  placeholder='Seleccionar'
                  width='50%'
              />
              </>
            )}
          />
          {getFormErrorMessage('medioRespuesta')}
        </div>

      </div>

      <div className="div-container">

        <div className='row-2'>
          <label>Programa al que aplica la solicitud<span className='required'>*</span></label>
          <Controller
            name="programaSolicitud"
            control={control}
            rules={{ required: 'Requerido.' }}
            render={({ field, fieldState }) => (
              <>
              <Suspense fallback={ <div>Cargando...</div>}>
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange( selePrograma(e.value))}
                  focusInputRef={field.ref}
                  optionLabel='PRG_DESCRIPCION'
                  options={ optionPrograma.data }  
                  placeholder='Seleccionar'
                  width=''
                />
              </Suspense>
              </>
            )}
          />
          {getFormErrorMessage('programaSolicitud')}
        </div>

        <div className='row-2'>
          <label>Asunto de la solicitud<span className='required'>*</span></label>
          <Controller
            name="asuntoSolicitud"
            control={control}
            rules={{ required: 'Requerido.' }}
            render={({ field, fieldState }) => (
              <>
              <Suspense fallback={ <div>Cargando...</div>}>
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error }, '!h-10')}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  optionLabel='ASO_ASUNTO'
                  options={ optionAsuntoSolicitud.data }  
                  placeholder='Seleccionar'
                  width=''
                />
              </Suspense>
              </>
            )}
          />
          {getFormErrorMessage('asuntoSolicitud')}
        </div>

      </div>

      <div className="div-container">
        <div className='row-2'>
          <label>Clasificación</label>
          <InputTextComponent
            placeholder={showClasificacion.current}
            width=""
            disabled={true} 
            className='mi-input !h-10'
          />
        </div>

        <div className='row-2'>
          <label>Dependencia</label>
          <InputTextComponent
            placeholder={showDependecia.current }
            width=""
            disabled={true}
            className='mi-input !h-10' 
          />
        </div>
      </div>

      <div className="div_container">
          <label>Descripción<span className='required'>*</span></label>
          <Controller
            name="Descripción"
            control={control}
            rules={{ required: 'Requerido.' }}
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
      </div>

      <div className="div-upload">
        <label>Archivos o documentos que soportan la solicitud</label>
        <UploadComponent/>
      </div>

      <div className="div_container" style={{marginBottom:'20px'}} >
        <label>Aviso de privacidad</label>
        <ScrollPanelComponent/>
      </div>

      <div className="div_container" style={{marginBottom:'20px'}}>
        <label>Para conocer la Política de Tratamiento y Protección de datos personales de Sapiencia, dar click <a href={LPA_VALOR} style={{color:'#533893'}} target="_blank">aquí</a> </label>
        <Controller
          name="politicaTratamiento"
          control={control}
          rules={{ required: 'Requerido.' }}
          render={({ field, fieldState }) => (
            <>
              <TriStateCheckboxComponent
                id={field.name}
                value={field.value} 
                onChange={(e) => field.onChange(checkBox(e.value))} 
                className={classNames({ 'p-invalid': fieldState.error })} 
              />
              {getFormErrorMessage(field.name)}
                  
            </>
          )}
        />
      </div>

      <div>
      <Button
        disabled={!isValid}
        rounded
        label="Enviar solicitud"
        className="!px-10 !text-sm btn-sumit"
     />
      </div>
        
    </form>
  )
}
