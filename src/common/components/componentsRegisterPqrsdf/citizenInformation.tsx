import { CalendarComponent } from "./calendarComponent"
import { DropDownComponent } from "./dropDownComponent"
import { InputTextComponent } from "./inputTextComponent"
import { CnputTextareaComponent } from "./inputTextarea.component"
import { ScrollPanelComponent } from "./scrollPanelComponent"
import { TriStateCheckboxComponent } from "./triStateCheckboxComponent"
import { UploadComponent } from "./uploadComponent"
import { ButtonComponent } from "../Form"

export const CitizenInformation = () => {



  return (
    <form className="form-container" >

      <div className="div-container">

        <div className='row-1'>
          <label>Tipo de solicitud<span className='required'>*</span></label>
          <DropDownComponent 
            placeholder='Seleccionar'
            width='243px'
          />
        </div>

        <div className='row-1'>
          <label>Tipo<span className='required'>*</span></label>
          <DropDownComponent 
            placeholder='CC'
            width='79px'
          />
        </div>

        <div className='row-1'>
          <label>No. documento<span className='required'>*</span></label>
          <InputTextComponent
            placeholder=''
            width="280px"
            keyfilter='int'
          />
        </div>

        <div className='row-1'>
          <label>Tipo entidad<span className='required'>*</span></label>
          <DropDownComponent 
            placeholder='Seleccionar'
            width='325px'
          />
        </div>

      </div>  

      <div className="div-container">

        <div style={{width:'100%'}}>
          <h2>Información del ciudadano</h2>
        </div>

        <div className='row-1'>
          <label>Primer nombre<span className='required'>*</span></label>
          <InputTextComponent
            placeholder=''
            width="230px"
          />
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
          <InputTextComponent
            placeholder=''
            width="230px"
          />
        </div>

        <div className='row-1'>
          <label>Segundo apellido<span className='required'>*</span></label>
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
          <InputTextComponent
            placeholder=''
            width="280px"
            keyfilter='int'
          />
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
          <InputTextComponent
            placeholder=''
            width="100%"
          />
        </div>

        <div className='row-2'>
          <label>Dirección<span className='required'>*</span></label>
          <InputTextComponent
            placeholder=''
            width="100%"
          />
        </div>
      </div>

      <div className="div-container">
        <div className='row-1'>
          <label>País<span className='required'>*</span></label>
          <InputTextComponent
            placeholder=''
            width="280px"
          />
        </div>

        <div className='row-1'>
          <label>Departamento<span className='required'>*</span></label>
          <InputTextComponent
            placeholder=''
            width="280px"
          />
        </div>
        
        <div className='row-1'>
          <label>Municipio<span className='required'>*</span></label>
          <InputTextComponent
            placeholder=''
            width="280px"
          />
        </div>
      </div>

      <div className="div-container">

        <div className='row-1'>
          <label>Seleccione el medio por el cual quiere recibir la respuesta<span className='required'>*</span></label>
          <DropDownComponent 
            placeholder='Seleccionar'
            width=''
          />
        </div>

      </div>

      <div className="div-container">

        <div className='row-2'>
          <label>Programa al que aplica la solicitud<span className='required'>*</span></label>
          <DropDownComponent 
            placeholder='Seleccionar'
            width=''
          />
        </div>

        <div className='row-2'>
          <label>Asunto de la solicitud<span className='required'>*</span></label>
          <DropDownComponent 
            placeholder='Seleccionar'
            width=''
          />
        </div>

      </div>

      <div className="div-container">
        <div className='row-1'>
          <label>Clasificación<span className='required'>*</span></label>
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
       <ButtonComponent value="Enviar solicitud"/>
      </div>
        
    </form>
  )
}
