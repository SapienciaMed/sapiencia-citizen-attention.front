import { useForm, Controller } from 'react-hook-form';
import { CalendarComponent } from "./calendarComponent";
import { DropDownComponent } from "./dropDownComponent";
import { InputTextComponent } from "./inputTextComponent";
import { CnputTextareaComponent } from "./inputTextarea.component";
import { ScrollPanelComponent } from "./scrollPanelComponent";
import { TriStateCheckboxComponent } from "./triStateCheckboxComponent";
import { UploadComponent } from "./uploadComponent";
import { ButtonSumitComponent } from "./buttonSumit.component";
import { classNames } from 'primereact/utils';

export const CitizenInformation = () => {

  const defaultValues = {
    tipoDeSolicitud: '',
    tipo:'',
    tipoEntidad:'',
    medioRespuesta:'',
    programaSolicitud:'',
    asuntoSolicitud:'',
    noDocumento:'',
    primerNombre:'',
    primerApellido:'',
    noContacto1:'',
    correoElectronico:'',
    direccion:'',
    pais:'',
    departamento:'',
    municipio:''  
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    data;

    console.log('data -> ',data);
    

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
            render={({ field, fieldState }) => (
              <>
                <DropDownComponent
                  id={field.name}
                  value={field.value}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref}
                  placeholder='Seleccionar'
                  width='243px'

                />
              </>
            )}
          />
          {getFormErrorMessage('tipoDeSolicitud')}
        </div>

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
                  onChange={(e) => field.onChange(e.value)}
                  focusInputRef={field.ref} 
                  placeholder='CC'
                  width='79px'
              />
              </>
            )}
          />
          {getFormErrorMessage('tipo')}
        </div>

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
                  keyfilter='int'
                />
              </>
            )}
          />
          {getFormErrorMessage('noDocumento')}
        </div>

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
                  placeholder='Seleccionar'
                  width='325px'
              />
              </>
            )}
          />
          {getFormErrorMessage('tipoEntidad')}
        </div>

      </div>  

      <div className="div-container">

        <div style={{width:'100%'}}>
          <h2>Información del ciudadano</h2>
        </div>

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
                  width="230px"
                />
              </>
            )}
          />
          {getFormErrorMessage('primerNombre')}
        </div>

        <div className='row-1'>
          <label>Segundo nombre</label>
          <InputTextComponent
            placeholder=''
            width="230px"
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
                  width="230px"
                />
              </>
            )}
          />
          {getFormErrorMessage('primerApellido')}
        </div>

        <div className='row-1'>
          <label>Segundo apellido</label>
          <InputTextComponent
            placeholder=''
            width="230px"
          />
        </div>

      </div>

      <div className="div-container">
        <div className='row-1'>
          <label>Fecha de nacimiento<span className='required'>*</span></label>
          <CalendarComponent/>
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
                  width="280px"
                  keyfilter='int'
                />
              </>
            )}
          />
          {getFormErrorMessage('noContacto1')}
        </div>

        <div className='row-1'>
          <label>No. De contacto 2</label>
          <InputTextComponent
            placeholder=''
            width="280px"
            keyfilter='int'
          />
        </div>
      </div>

      <div className="div-container">
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
      </div>

      <div className="div-container">
        <div className='row-1'>
          <label>País<span className='required'>*</span></label>
          <Controller
            name="pais"
            control={control}
            rules={{ required: 'Campo requerido.' }}
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
          {getFormErrorMessage('pais')}
        </div>

        <div className='row-1'>
          <label>Departamento<span className='required'>*</span></label>
          <Controller
            name="departamento"
            control={control}
            rules={{ required: 'Campo requerido.' }}
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
          {getFormErrorMessage('departamento')}
        </div>
        
        <div className='row-1'>
          <label>Municipio<span className='required'>*</span></label>
          <Controller
            name="municipio"
            control={control}
            rules={{ required: 'Campo requerido.' }}
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
                  placeholder='Seleccionar'
                  width=''
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
        <div className='row-1'>
          <label>Clasificación</label>
          <InputTextComponent
            placeholder='Disabled'
            width="280px"
            disabled={true} 
          />
        </div>

        <div className='row-1'>
          <label>Dependencia</label>
          <InputTextComponent
            placeholder='Disabled'
            width="280px"
            disabled={true} 
          />
        </div>
      </div>

      <div className="div_container">
          <label>Descripción<span className='required'>*</span></label>
          <CnputTextareaComponent/>
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
        <label>Para conocer la Política de Tratamiento y Protección de datos personales de Sapiencia, dar click <a href="" style={{color:'#533893'}}>aquí</a> </label>
        <TriStateCheckboxComponent/>
      </div>

      <div>
       <ButtonSumitComponent 
          label="Enviar solicitud"
        />
      </div>
        
    </form>
  )
}
