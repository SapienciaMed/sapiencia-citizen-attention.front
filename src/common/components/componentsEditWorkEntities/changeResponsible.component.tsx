import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface Data {
    numberDocument: string;
    name: string;
    email: string;
    numberContact1: string;
    selet: string;
}

interface PageNumber {
    page: number;
}


export const ChangeResponsibleComponent = () => {

    const [visible, setVisible] = useState<boolean>(false);
    const [rowClick, setRowClick] = useState(true);
    const [selectPage, setSelectPage] = useState<PageNumber>({page: 5});
    const pageNumber: PageNumber[] = [
        { page: 5 },
        { page: 10 },
        { page: 15 },
        { page: 20 },
    ]
    const [data, setData] = useState<Data[]>([{ 
                                                    numberDocument: 'string1',
                                                    name: 'string2',
                                                    email: 'string3',
                                                    numberContact1: 'string4',
                                                    selet: 'preuba'
                                                },{ 
                                                    numberDocument: 'string2',
                                                    name: 'string6',
                                                    email: 'string7',
                                                    numberContact1: 'string8',
                                                    selet: 'string9',
                                                },{ 
                                                    numberDocument: 'string1',
                                                    name: 'string2',
                                                    email: 'string3',
                                                    numberContact1: 'string4',
                                                    selet: 'preuba'
                                                },{ 
                                                    numberDocument: 'string2',
                                                    name: 'string6',
                                                    email: 'string7',
                                                    numberContact1: 'string8',
                                                    selet: 'string9',
                                                },{ 
                                                    numberDocument: 'string1',
                                                    name: 'string2',
                                                    email: 'string3',
                                                    numberContact1: 'string4',
                                                    selet: 'preuba'
                                                },{ 
                                                    numberDocument: 'string2',
                                                    name: 'string6',
                                                    email: 'string7',
                                                    numberContact1: 'string8',
                                                    selet: 'string9',
                                                }]);

    const getData = (data: DataTableSelection<Data[]>) =>{
        console.log(data);
        
    }

    console.log(selectPage);
    

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

      const onSubmit = async (data: any) => {
	
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
                        <div className="content-card-table mb-8">
                            <div className="col-1">
                                <label className="text-2xl">Resultados de búsqueda</label>
                            </div>
                            <div className="paginado col-1">
                                <div className="pl-8"><label className="mr-2 text-base">Total de resultados</label>{'3'}</div>
                                <div className="">
                                    <label className="mr-2 p-colorpicker">Registro por página</label>
                                    <Dropdown 
                                        value={selectPage} 
                                        onChange={(e: DropdownChangeEvent) => setSelectPage(e.value)} 
                                        options={pageNumber} 
                                        optionLabel="page"
                                     />
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                            <div className="overflow-hidden max-w-[calc(100vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] hidden md:block borderless reverse-striped">
                                <DataTable
                                    value={data}
                                    paginator 
                                    rows={selectPage.page} 
                                    showGridlines={false}
                                    stripedRows={true}
                                    selectionMode={rowClick ? undefined : 'radiobutton'}
                                    selectionAutoFocus
                                    onSelectionChange={(e) => getData(e.value)} dataKey="id"
                                    emptyMessage={<span className="!font-sans">No se encontraron resultados</span>}
                                >
                                    <Column style={{textAlign:'center'}} field="numberDocument" header="Doc. Identidad"></Column>
                                    <Column style={{textAlign:'center'}} field="name" header="Nombre y apellidos"></Column>
                                    <Column style={{textAlign:'center'}} field="email" header="Correo" ></Column>
                                    <Column style={{textAlign:'center'}} field="numberContact1" header="No. Contacto 1" ></Column>
                                    <Column 
                                        field="selet" 
                                        header="Seleccionar" 
                                        selectionMode="single"
                                        style={{textAlign:'center'}} 
                                        headerStyle={{display:'flex',justifyContent:'center'}} 
                                    ></Column>
                                </DataTable>
                            </div>
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
