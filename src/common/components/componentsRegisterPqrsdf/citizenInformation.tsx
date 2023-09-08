import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { useGetTypeSolicitud } from '../../hooks/form-pqrsdf.hook';
import { useGetTypeDocuments } from '../../hooks/form-pqrsdf.hook';
import { useGetTipoEntidadJuridica } from '../../hooks/form-pqrsdf.hook';
import { useGetResponseMedium } from '../../hooks/form-pqrsdf.hook';
import { useGetPrograms } from '../../hooks/form-pqrsdf.hook';
import { useGetAsuntoSolicitud } from '../../hooks/form-pqrsdf.hook';
import { useGetPaises } from '../../hooks/form-pqrsdf.hook';
import { useGetDepartamentos } from '../../hooks/form-pqrsdf.hook';
import { useGetMunicipios } from '../../hooks/form-pqrsdf.hook'; 
import { useGetListaParametros } from '../../hooks/form-pqrsdf.hook'; 

import { CalendarComponent } from "./calendarComponent";
import { DropDownComponent } from "./dropDownComponent";
import { InputTextComponent } from "./inputTextComponent";
import { CnputTextareaComponent } from "./inputTextarea.component";
import { ScrollPanelComponent } from "./scrollPanelComponent";
import { TriStateCheckboxComponent } from "./triStateCheckboxComponent";
import { UploadComponent } from "./uploadComponent";
import { classNames } from 'primereact/utils';







export const CitizenInformation = () => {

  const optionDepartamento = useRef(null);
  const optionMunicipios = useRef(null);
  const showFieldPersons = useRef('');
  const showRazonSocial = useRef('none')

  const { solicitudes } = useGetTypeSolicitud();
  const { docuements } = useGetTypeDocuments();
  const { entidadJuridica } = useGetTipoEntidadJuridica();
  const { program } = useGetPrograms();
  const { asuntos } = useGetAsuntoSolicitud();
  const { pais } = useGetPaises();
  const { departamento } = useGetDepartamentos();
  const { medium } = useGetResponseMedium();
  const { municipio } = useGetMunicipios('5');
  const { parametros } = useGetListaParametros();
  
  const [ valueDocument, setValueDocument] = useState(null);
  const [ valuePais, setValuePais] = useState(null);
  const [ valueDepartamento, setValueDepartamento] = useState(null);
  

  const seleTipoDocument = ( document:{id:number, description:string} ) => {
    setValueDocument( document );
    
    showFieldPersons.current = document.description

    console.log( showFieldPersons.current  );
    
    
    return document;
  }

  const seletDataPais = ( pais:{id:number, description:string} )=>{

    setValuePais( pais );

    if( pais.id == 4 ){ optionDepartamento.current = departamento };
  
    return pais;
  };

  const seletDepartamentos = ( depart:{id:number, description:string} )=>{
    setValueDepartamento( depart );
    
    if( depart.id == 5){ optionMunicipios.current = municipio}

    return depart;
  };
  

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
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  options={ solicitudes }
                  placeholder='Seleccionar'
                  width='95%'

                />
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
                  <DropDownComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ 'p-invalid': fieldState.error })}
                    onChange={(e) => field.onChange( seleTipoDocument(e.value))}
                    focusInputRef={field.ref}
                    options={ docuements } 
                    placeholder='CC'
                    width='254px'
                />
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
                    className={classNames({ 'p-invalid': fieldState.error })}
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
                  <DropDownComponent
                    id={field.name}
                    value={field.value}
                    className={classNames({ 'p-invalid': fieldState.error })}
                    onChange={(e) => field.onChange(e.value)}
                    focusInputRef={field.ref}
                    options={ entidadJuridica }  
                    placeholder='Seleccionar'
                    width='95%'
                />
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
          <h2>Información del ciudadano</h2>
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
                      className={classNames({ 'p-invalid': fieldState.error })}
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
                        className={classNames({ 'p-invalid': fieldState.error })}
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
                        className={classNames({ 'p-invalid': fieldState.error })}
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
                        className={classNames({ 'p-invalid': fieldState.error })}
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
                        className={classNames({ 'p-invalid': fieldState.error })}
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
                          className={classNames({ 'p-invalid': fieldState.error })}
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
                          className={classNames({ 'p-invalid': fieldState.error })}
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
                            className={classNames({ 'p-invalid': fieldState.error })}
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
                rules={{ required: 'Requerido.' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextComponent
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error })}
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
                      className={classNames({ 'p-invalid': fieldState.error })}
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
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(seletDataPais(e.value))}
                  focusInputRef={field.ref}
                  options={ pais }
                  placeholder='Selecionar'
                  width="280px"
                />
              </>
            )}
          />
          {getFormErrorMessage('pais')}
        </div>

        <span className='split'></span>

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
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(seletDepartamentos(e.value))}
                  focusInputRef={field.ref}
                  options={ optionDepartamento.current}
                  placeholder='Selecionar'
                  width="280px"
                />
              </>
            )}
          />
          {getFormErrorMessage('departamento')}
        </div>

        <span className='split'></span>
        
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
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  options={ optionMunicipios.current }
                  placeholder='Selecionar'
                  width="280px"
                />
              </>
            )}
          />
          {getFormErrorMessage('municipio')}
        </div>
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
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  options={ medium }   
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
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  options={ program }  
                  placeholder='Seleccionar'
                  width=''
              />
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
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  options={ asuntos }  
                  placeholder='Seleccionar'
                  width=''
              />
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
            placeholder='Disabled'
            width=""
            disabled={true} 
          />
        </div>

        <div className='row-2'>
          <label>Dependencia</label>
          <InputTextComponent
            placeholder='Disabled'
            width=""
            disabled={true} 
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
        <label>Para conocer la Política de Tratamiento y Protección de datos personales de Sapiencia, dar click <a href={parametros.toString()} style={{color:'#533893'}} target="_blank">aquí</a> </label>
        <Controller
          name="politicaTratamiento"
          control={control}
          rules={{ required: 'Requerido.' }}
          render={({ field, fieldState }) => (
            <>
              <TriStateCheckboxComponent
                id={field.name}
                value={field.value} 
                onChange={field.onChange} 
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
