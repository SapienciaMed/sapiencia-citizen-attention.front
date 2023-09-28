import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useParams  } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";  
import { ChangeResponsibleComponent } from "./componentsEditWorkEntities/changeResponsible.component";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook"; 

import '../../styles/workEntities-styles.scss'; 





const EditWorkEntitiesPage = () => {

  const userEntity =  useWorkEntityService();

  const [anchoDePantalla, setAnchoDePantalla] = useState(window.innerWidth);
  const [checked, setChecked] = useState<boolean>(false);
  const WidthRef = useRef(null);
  const dataUser = useRef(null);
  WidthRef.current = document.getElementById('sidebar').offsetWidth;

  const { id } = useParams();

  const getUser = async ( id:string )=>{
    const responseUser = await  userEntity.getWorkEntityById(parseInt(id))
    return responseUser
  }

  useEffect(()=>{
    getUser(id).then(({data, operation})=> {
      
      if(operation.code != 'OK'){
        return
      }
      dataUser.current = data;
      console.log(dataUser.current );
      
    })
  },[])

  try {

   
  } catch (error) {
    
  }
  useEffect(()=>{

  },[])

  useEffect(() => {
    const handleResize = () => {
      setAnchoDePantalla(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const defaultValues = {
    etityName: '',
    IdEntity:'',
    TypeEntity:'',
    DocumentEntity:'',
    name:'',
    noContact1:'',
    noContact2:'',
    email:''
  };

  const {
    formState: { errors, isValid },
    handleSubmit,
    control
  } = useForm({ defaultValues, mode:'all' });

  const onSubmit = async (data) => {
	
  }

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (

    <div className='container !py-5 !px-5 md:!px-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container" 
      >
        <Card className='card card-body card-h'>
          <Card 
              title='Editar entidad de trabajo'
              className='card'
          >
            

              <Card title='Entidad' className="card">
                <div className="flex flex-row flex-wrap ">
                  <div>
                    <label>Id Entidad</label><br/>
                    <Controller
                      name="IdEntity"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Tipo entidad </label><br/>
                    <Controller
                      name="TypeEntity"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Nombre entidad<span style={{color:'red'}}>*</span></label><br/>
                    <Controller
                      name="etityName"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames({'p-invalid': fieldState.error},'!h-10')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                         <br />
                         {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                  </div>
                </div>
              </Card>

              <br />

              <Card title='Usuario responsable' className="card">
                <div className="flex flex-row flex-wrap ">
                  <div>
                    <label>Doc. Identidad</label><br/>
                    <Controller
                      name="DocumentEntity"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Nombres y apellidos</label><br/>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>No. Contacto 1</label><br/>
                    <Controller
                      name="noContact1"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>No. Contacto 2</label><br/>
                    <Controller
                      name="noContact2"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                  </div>

                </div>

                <div className="flex flex-wrap justify-between items-center mt-4">
                  <div className="flex flex-row items-center">
                    <div>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Campo obligatorio.',
                        maxLength: {value:100, message:'Solo se permiten 100 caracteres'}
                      }}
                      render={({ field, fieldState }) => (
                        <>
                         <InputText
                          id={field.name}
                          value={field.value}
                          disabled
                          className={classNames({'p-invalid': fieldState.error},'!h-10 input-desabled')}
                          onChange={(e) => field.onChange(e.target.value)}
                         />
                        </>
                      )}
                    />
                    </div>

                    <span className='split'></span>

                    <div className="flex flex-row" style={{paddingTop:'24px'}}>
                      <span className="mr-4">Activo</span>
                      <InputSwitch checked={checked} onChange={(e: InputSwitchChangeEvent) => setChecked(e.value)} />
                      <span className="ml-4">Inactivo</span>
                    </div>
                  </div>

                  <div style={{marginTop:'22px'}}>
                    <ChangeResponsibleComponent/>
                  </div>
                </div>

              </Card>
              <div className="flex flex-grow justify-end pr-5" style={{paddingRight:'1.25rem'}}>
                <Button 
                  className="rounded-full !h-10 mt-10" 
                  >
                    Asignar programas
                  </Button>
              </div>
            
          </Card>
        </Card>
        <div className="buton-fixe " style={{width:(anchoDePantalla-WidthRef.current)}}>
          <div className="">
            <Button
              text
              rounded
              severity="secondary"
              className="!px-8 !py-2 !text-base !text-black mr-4 !h-10"
              label="Cancelar"
            />
            <Button className="rounded-full !h-10">Guardar</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditWorkEntitiesPage;
