import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";

interface Product {
    udDocument: string;
    fullName: string;
    email: string;
    contact: string;
    selet: string;
}


export const ChangeResponsibleComponent = () => {

    const [visible, setVisible] = useState<boolean>(false);
    const [rowClick, setRowClick] = useState(true);

    const [products, setProducts] = useState<Product[]>([]);
    
    const data:Product[] = [{ 
        udDocument: 'string1',
        fullName: 'string2',
        email: 'string3',
        contact: 'string4',
        selet: 'string5',
    },{ 
        udDocument: 'string1',
        fullName: 'string2',
        email: 'string3',
        contact: 'string4',
        selet: 'string5',
    }]

    useEffect(() => {
        //consumimos servicios
    }, []);

    const defaultValues = {
        etityDocument: '',
        name:'',
        lastName:'',
        email:''
      };

    const {
        formState: { errors, isValid },
        control,
        handleSubmit
      } = useForm({ defaultValues, mode:'all' });

      const onSubmit = async (data) => {
	
      }


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
                style={{ width: '75vw' }} 
                onHide={() => setVisible(false)} 
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="form-container"
                >
                    <div>
                        <div style={{marginBottom:'8px'}}>
                            <label className="text-xl">Buscar por</label>
                        </div>
                        <div className="flex flex-row flex-wrap justify-between mb-4">
                            <div>
                                <label>Documento de identidad</label><br/>
                                <Controller
                                name="etityDocument"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                    <InputText
                                    id={field.name}
                                    value={field.value}
                                    className={classNames({'p-invalid': fieldState.error},'!h-10')}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    </>
                                )}
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
                    <div className="flex justify-end mb-4">
                        <Button
                        text
                        className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                        >Limpiar Campos</Button>
                        <Button className="rounded-full !h-10">Buscar</Button>
                    </div>
                </div>
            </form>
            <div>
                <Card className="card">
                    <div className="">
                        <div>
                            <label htmlFor="input-rowclick">Resultados de búsqueda</label>
                        </div>
                        <div>

                        </div>
                    </div>
                    <DataTable value={data} stripedRows paginator>
                        <Column field="udDocument" header="Doc. Identidad"></Column>
                        <Column field="fullName" header="Nombre y apellidos"></Column>
                        <Column field="email" header="Correo"></Column>
                        <Column field="contact" header="No. Contacto 1"></Column>
                        <Column field="selet" header="Seleccionar"></Column>
                    </DataTable>
                    <div className="flex justify-center mt-8">
                        <Button
                        text
                        className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                        >Cancelar</Button>
                        <Button className="rounded-full !h-10">Cambiar</Button>
                    </div>
                </Card>
            </div>
          
            </Dialog>
        </>

    )
}
