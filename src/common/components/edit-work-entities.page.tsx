import { FormEvent, useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";  
import { ChangeResponsibleComponent } from "./componentsEditWorkEntities/changeResponsible.component";  

import '../../styles/workEntities-styles.scss'; 




const EditWorkEntitiesPage = () => {

  const [anchoDePantalla, setAnchoDePantalla] = useState(window.innerWidth);
  const [checked, setChecked] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const WidthRef = useRef(null);
  WidthRef.current = document.getElementById('sidebar').offsetWidth;

  const defaultValues = {
  };

  const {
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ defaultValues, mode:'all' });

  const onSubmit = async (data) => {
	
  }



  useEffect(() => {

    const handleResize = () => {
      setAnchoDePantalla(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (

    <div className='container !py-5 !px-5 md:!px-11'>
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
                      className="!h-10 input-desabled"
                      disabled
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Tipo entidad </label><br/>
                    <InputText
                      className="!h-10 input-desabled"
                      disabled
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Nombre entidad</label><br/>
                    <InputText
                      className="!h-10"
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
                      className="!h-10 input-desabled"
                      disabled
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Nombres y apellidos</label><br/>
                    <InputText
                      className="!h-10 input-desabled"
                      disabled
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>No. Contacto 1</label><br/>
                    <InputText
                      className="!h-10 input-desabled"
                      disabled
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>No. Contacto 2</label><br/>
                    <InputText
                      className="!h-10 input-desabled"
                      disabled
                      />
                  </div>

                </div>

                <div className="flex flex-wrap justify-between items-center mt-4">
                  <div className="flex flex-row items-center">
                    <div>
                      <label>Correo electrónico</label><br/>
                      <InputText
                        className="!h-10 input-desabled"
                        disabled
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
