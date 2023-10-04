import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useParams  } from "react-router-dom";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";  
import { ChangeResponsibleComponent } from "./componentsEditWorkEntities/changeResponsible.component";
import { AssignProgramComponent } from "./componentsEditWorkEntities/assignProgram.component"
import { IWorkEntity } from "../interfaces/workEntity.interfaces";
import { EResponseCodes } from "../constants/api.enum";

import '../../styles/workEntities-styles.scss'; 



interface User {
  email: string
  name: string
  numberContact1: string
  numberDocument: string
}



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
  const [workEntity, setWorkEntity] = useState<IWorkEntity>();
  const [nodes, setNodes] = useState<TreeNode[]>([{children:[{data:{name:'backup-1.zip'},key:'1-0'}],data:{name: "Cloud",size: "20kb", type: "Folder"}, key:'1'}]);

  const changedUser = (data:User)=> {
    setConsta1(data.numberContact1)
    setEmail(data.email)
    setNameUser(data.name)
    setDocumenUser(data.numberDocument)
  }
  
  const navigate = useNavigate();

  const WidthRef = useRef(null);
  const dataUser = useRef(null);
  WidthRef.current = document.getElementById('sidebar').offsetWidth;

  const getNameEntite = (name:string)=>{

    setNameEntity(name)

    return name
  }

  const { id } = useParams();

  const getUser = async ( id:string )=>{
    const responseUser = await  userEntity.getWorkEntityById(parseInt(id))
    return responseUser
  }


  useEffect(()=>{
    getUser(id).then(({data, operation})=> {
      
      if(operation.code != 'OK'){
        navigate(-1);
        return
      }
      
      dataUser.current = data;
      setIdEntity(data.id.toString());
      setTypeEntity(data.workEntityType['tet_descripcion']);
      //setNameEntity(data['name']);
      getNameEntite(data['name'])
      setDocumenUser(data.user['numberDocument']);
      setNameUser(`${data.user['names']} ${data.user['lastNames']}`)
      setConsta1(data.user['numberContact1']);
      setConsta2(data.user['numberContact2']);
      setEmail(data.user['email']);
      const status = data['status']? true : false;
      setChecked(status);
      
    })
  },[])

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
    etityName: 'Nombre entidad',
  };

  const {
    formState: { errors, isValid },
    handleSubmit,
    control
  } = useForm({ defaultValues, mode:'all',  });

  const onSubmit = async (data) => {
    
  }

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };
  

  return (

    <div className='container'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container" 
      >
        <Card className='card card-body'>
          <Card 
              title='Editar entidad de trabajo'
              className='card card-container-movil'
          >
              <Card title='Entidad' className="card card-movil">
                <div className="flex flex-row flex-wrap ">
                  <div className="col-100 idEntity">
                    <div className="col-50">
                      <label>Id Entidad</label><br/>
                      <InputText
                        value={idEntity}
                        className="h-10 input-desabled col-100"
                        disabled
                        onChange={(e) => setIdEntity(e.target.value)}
                      />
                    </div>
                  </div>

                  <span className='split'></span>

                  <div className="col-100">
                    <label>Tipo entidad </label><br/>
                    <InputText
                      value={typeEntity}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setTypeEntity(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>
                  <div className="col-100">
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
                          value={nameEntity}
                          className={classNames({'p-invalid': fieldState.error},'!h-10 col-100')}
                          onChange={(e) => field.onChange(getNameEntite(e.target.value))}
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

              <Card title='Usuario responsable' className="card card-movil">
                <div className="flex flex-row flex-wrap ">
                  <div className="col-100">
                    <label>Doc. Identidad</label><br/>
                    <InputText
                      value={documenUser}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setDocumenUser(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div className="col-100">
                    <label>Nombres y apellidos</label><br/>
                    <InputText
                      value={nameUser}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setNameUser(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div className="col-100">
                    <label>No. Contacto 1</label><br/>
                    <InputText
                      value={consta1}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setConsta1(e.target.value)}
                    />
                  </div>

                  <span className='split'></span>

                  <div className="col-100">
                    <label>No. Contacto 2</label><br/>
                    <InputText
                      value={consta2}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setConsta2(e.target.value)}
                    />
                  </div>

                </div>

                <div className="flex flex-wrap justify-between items-center mt-4 ">
                  <div className="flex flex-row items-center movil-2 col-100">
                    <div className="col-100">
                    <label>Correo electrónico</label><br/>
                    <InputText
                      value={email}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>

                    <span className='split'></span>
                
                    <div className="flex flex-col ml-3 movil-3 col-100">
                      <label>Estado</label>
                      <div className="flex flex-row mt-3 movil-4">
                        <span className="mr-4">Activo</span>
                        <InputSwitch checked={checked} onChange={(e: InputSwitchChangeEvent) => setChecked(e.value)} />
                        <span className="ml-4">Inactivo</span>
                      </div>
                    </div>
                  </div>

                  <div style={{marginTop:'22px'}} className="bt-movil-1 col-100">
                    <ChangeResponsibleComponent
                     dataUser={(e:User)=> changedUser(e)}
                    />
                  </div>
                </div>

              </Card>

              <Card className="card card-movil mt-6">

                <TreeTable value={nodes} tableStyle={{ minWidth: '50rem' }}>
                  <Column field="name" header="Resumen programas y asuntos seleccionados" expander></Column>
                </TreeTable>

                <div className="flex flex-grow justify-end pr-5 col-100 bt-movil-1" style={{paddingRight:'1.25rem'}}>
                    <AssignProgramComponent/>
                </div>
              </Card>
          </Card>
        </Card>
        <div className="buton-fixe " style={{width:(anchoDePantalla-WidthRef.current)}}>
          <div className="">
            <Button
              text
              rounded
              onClick={()=>navigate(-1)}
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
