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
  const [idEntity, setIdEntity] = useState<string>('');
  const [typeEntity, setTypeEntity] = useState<string>('');
  const [nameEntity, setNameEntity] = useState<string>('');
  const [documenUser, setDocumenUser] = useState<string>('');
  const [nameUser, setNameUser] = useState<string>('');
  const [consta1, setConsta1] = useState<string>('');
  const [consta2, setConsta2] = useState<string>('');
  const [email, setEmail] = useState<string>('');

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
      setIdEntity(data.id.toString());
      setTypeEntity(data.workEntityType['tet_descripcion']);
      setNameEntity(data['name']);
      setDocumenUser(data.user['numberDocument']);
      setNameUser(`${data.user['names']} ${data.user['lastNames']}`)
      setConsta1(data.user['numberContact1']);
      setConsta2(data.user['numberContact2']);
      setEmail(data.user['email']);
      const status = data['status']? true : false;
      setChecked(status);

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
                    <InputText
                      value={idEntity}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setIdEntity(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Tipo entidad </label><br/>
                    <InputText
                      value={typeEntity}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setTypeEntity(e.target.value)}
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
                    <InputText
                      value={documenUser}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setDocumenUser(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Nombres y apellidos</label><br/>
                    <InputText
                      value={nameUser}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setNameUser(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>No. Contacto 1</label><br/>
                    <InputText
                      value={consta1}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setConsta1(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>No. Contacto 2</label><br/>
                    <InputText
                      value={consta2}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setConsta2(e.target.value)}
                    />
                  </div>

                </div>

                <div className="flex flex-wrap justify-between items-center mt-4">
                  <div className="flex flex-row items-center">
                    <div>
                    <label>Correo electrónico</label><br/>
                    <InputText
                      value={email}
                      className="h-10 input-desabled"
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
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
