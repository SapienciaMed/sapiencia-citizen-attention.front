import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useWorkEntityService } from "../../hooks/WorkEntityService.hook";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { IWorkEntityFilters } from "../../interfaces/workEntity.interfaces";
import { MessageComponent } from "./message.component"; 
import { ProgressSpinner } from 'primereact/progressspinner';

interface Data {
    numberDocument: string;
    name: string;
    email: string;
    numberContact1: string;
}

interface PageNumber {
    page: number;
}


export const ChangeResponsibleComponent = () => {

    const workEntityService = useWorkEntityService();

    const [visible, setVisible] = useState<boolean>(false);
    const [rowClick, setRowClick] = useState(true);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(false);
    const [selectPage, setSelectPage] = useState<PageNumber>({page: 5});
    const pageNumber: PageNumber[] = [
        { page: 5 },
        { page: 10 },
        { page: 15 },
        { page: 20 },
    ]
    const [data, setData] = useState<Data[]>([]);

    const getData = (data: DataTableSelection<Data[]>) =>{
        console.log('data table-> ', data);
        
    }
    


    useEffect(() => {
        //consumimos servicios
    }, []);

    const defaultValues = {
        entityDocument: '',
        name:'',
        lastName:'',
        email:''
      };

    const {
        formState: { errors, isValid },
        control,
        handleSubmit,
        getValues,
        reset
      } = useForm({ defaultValues, mode:'all' });

    const resetForm = ()=> {
        setLoad(false),
        setError(false),
        reset()
    }


    const onSubmit = async () => {
        setLoad(true)
        try {
            let payload = getValues() as IWorkEntityFilters;
            const { email, identification, lastNames, name} = payload;
            //if (email==='') { return }
            

            console.log('...',payload);
            
            const response = await workEntityService.getWorkEntityByFilters(payload);
            const { data, operation } = response;

            if(operation.code !== "OK"){
                setLoad(false),
                setError(true)
                console.log('->e ',response);
            }

            const usersData = data.array.map( data =>({
                numberDocument: data['user']['numberDocument'],
                name: `${data['user']['names']} ${data['user']['lastNames']}`,
                email: data['user']['email'],
                numberContact1: data['user']['numberContact1'],
            }))
            setLoad(false),
            setData(usersData)
            console.log('-> ',response);
        } catch (error) {
            
        }
      }

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
                style={{ width: '75vw' }} 
                onHide={() => setVisible(false)}
                className="dialog-movil" 
            >
                {error?(<>
                            <MessageComponent headerMsg="Error" msg="No se encontraron resultados para la búsqueda realizada"/>
                        </>):(<></>)}
                
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="form-container"
                >
                    <div>
                        <div style={{marginBottom:'8px'}}>
                            <label className="text-xl">Buscar por</label>
                        </div>
                        <div className="flex flex-row flex-wrap justify-between mb-4">
                            <div className="col-100">
                                <label>Documento de identidad</label><br/>
                                <Controller
                                    name="entityDocument"
                                    control={control}
                                    rules={{
                                       maxLength:{value:15, message:'Solo se permiten 15 caracteres'} 
                                    }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <InputText
                                        id={field.name}
                                        value={field.value}
                                        keyfilter='num'
                                        className={classNames({'p-invalid': fieldState.error},'!h-10 col-100')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <br/>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                                />
                            </div>

                            <span className='split'></span>

                            <div className="col-100">
                                <label>Nombres</label><br/>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        maxLength:{value:50, message:'Solo se permiten 50 caracteres'} 
                                    }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <InputText
                                        id={field.name}
                                        value={field.value}
                                        keyfilter='alpha'
                                        className={classNames({'p-invalid': fieldState.error},'!h-10 col-100')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <br/>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                                />
                            </div>

                            <span className='split'></span>

                            <div className="col-100">
                                <label>Apellidos</label><br/>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{
                                        maxLength:{value:50, message:'Solo se permiten 50 caracteres'} 
                                    }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <InputText
                                        id={field.name}
                                        value={field.value}
                                        keyfilter='alpha'
                                        className={classNames({'p-invalid': fieldState.error},'!h-10 col-100')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <br/>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                                />
                            </div>

                            <span className='split'></span>

                            <div className="col-100">
                                <label>Correo electrónico</label><br/>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        maxLength:{value:100, message:'Solo se permiten 100 caracteres'},
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                                            message: "Correo electrónico no válido",
                                          }, 
                                    }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <InputText
                                        id={field.name}
                                        value={field.value}
                                        keyfilter='email'
                                        className={classNames({'p-invalid': fieldState.error},'!h-10 col-100')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <br/>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mb-4 col-100 movil-5">
                            <Button
                                text
                                className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                                onClick={ resetForm }
                                type="button"
                            >
                                Limpiar Campos
                            </Button>
                            <Button 
                                className="rounded-full !h-10" 
                                type="submit"
                                disabled={load}
                            >
                                Buscar
                            </Button>
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
                                    onSelectionChange={(e) => getData(e.value)} dataKey="id"
                                    emptyMessage={<span className="!font-sans">{load?(<><ProgressSpinner/></>):(<></>)}</span>}
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
