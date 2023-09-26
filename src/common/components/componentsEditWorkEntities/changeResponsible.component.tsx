import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";


interface Props {
    show:boolean;
}

export const ChangeResponsibleComponent = () => {

    

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <Button 
                      className="rounded-full !h-10"
                      style={{padding:'1.25rem'}}
                      onClick={() => setVisible(true)} 
                    >
                        Cambiar responsable
            </Button>
            <Dialog 
                header="Cambiar responsable"
                headerClassName="text-2xl" 
                visible={visible} 
                style={{ width: '70vw' }} 
                onHide={() => setVisible(false)} 
            >
            <div style={{marginBottom:'8px'}}>
                <label className="text-xl">Buscar por</label>
            </div>
            <div className="flex flex-row flex-wrap ">
                  <div>
                    <label>Documento de identidad</label><br/>
                    <InputText
                      className="!h-10"
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Nombres</label><br/>
                    <InputText
                      className="!h-10"
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Apellidos</label><br/>
                    <InputText
                      className="!h-10"
                      />
                  </div>

                  <span className='split'></span>

                  <div>
                    <label>Correo electrónico</label><br/>
                    <InputText
                      className="!h-10"
                      />
                  </div>

                </div>
            </Dialog>
        </>

    )
}
