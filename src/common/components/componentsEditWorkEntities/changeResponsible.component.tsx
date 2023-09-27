import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}


export const ChangeResponsibleComponent = () => {

    const [visible, setVisible] = useState<boolean>(false);

    const [products, setProducts] = useState<Product[]>([]);

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
        control
      } = useForm({ defaultValues, mode:'all' });

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
      };

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
            <div>
                <div style={{marginBottom:'8px'}}>
                    <label className="text-xl">Buscar por</label>
                </div>
                <div className="flex flex-row flex-wrap ">
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
                         <br />
                         {getFormErrorMessage(field.name)}
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
                <div className="flex justify-end">
                    <Button
                    text
                    className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                    >Limpiar Campos</Button>
                    <Button className="rounded-full !h-10">Buscar</Button>
                </div>
            </div>
            <div>
                <Card>
                <DataTable value={products} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>
                </Card>
            </div>
          
            </Dialog>
        </>

    )
}
