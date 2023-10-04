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



interface PageNumber {
    page: number;
}

interface Payload { 
    email:'', 
    identification:'', 
    lastNames:'', 
    name:''
}

interface User {
    email: string
    name: string
    numberContact1: string
    numberDocument: string
}

interface Props {
    dataUser: (data: User) => void;
}


export const ChangeResponsibleComponent = (props:Props) => {

    const { dataUser } = props
    const workEntityService = useWorkEntityService();

    const [visible, setVisible] = useState<boolean>(false);
    const [rowClick, setRowClick] = useState(true);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(false);
    const [cancelar, setCancelar] = useState(false);
    const [changeUser, setChangeUser] = useState(false);
    const [changeBtn, setChangeBtn] = useState(true);
    const [selectPage, setSelectPage] = useState<PageNumber>({page: 5});
    const dataTable = useRef(null)

    const pageNumber: PageNumber[] = [
        { page: 5 },
        { page: 10 },
        { page: 15 },
        { page: 20 },
    ]
    const [data, setData] = useState([]);

    const getData = (data: DataTableSelection<[]>) =>{
        dataTable.current = data
        setChangeBtn(false)
    }
    

    const defaultValues = {
        identification: '',
        name:'',
        lastName:'',
        email:''
      };

    const {
        formState: { errors, isValid },
        control,
        handleSubmit,
        watch,
        reset
      } = useForm({ defaultValues, mode:'all' });

    const resetForm = ()=> {
        setLoad(false),
        setError(false),
        setData([]),
        reset()
    }

    const cancelarChanges = ()=> { 
        setCancelar(false)
        setLoad(false),
        setError(false),
        setData([]),
        reset()
        setVisible(false)
    }

    const userChanges = () =>{
        dataUser(dataTable.current)
        setChangeUser(false)
        setData([])
        reset()
        setVisible(false)
    }

    let statusButon = true
    if(watch('name').length>0 || watch('identification').length>0 || watch('lastName').length>0 || watch('email').length>0  ){
        statusButon = false
    }
    
    const onSubmit = async ( filter:Payload) => {
        
        setLoad(true)
        try {

            const { email, identification, lastNames, name} = filter;
            //if (email==='') { return }

            
            const payload:IWorkEntityFilters = {
                email,
                lastNames,
                name,
                identification: parseInt(identification)
            }
            
            const response = await workEntityService.getWorkEntityByFilters(payload);
            const { data, operation } = response;

            if(operation.code !== "OK"){
                setLoad(false),
                setError(true)
            }

            const usersData = data.array.map( data =>({
                numberDocument: data['user']['numberDocument'],
                name: `${data['user']['names']} ${data['user']['lastNames']}`,
                email: data['user']['email'],
                numberContact1: data['user']['numberContact1'],
            }))
            setLoad(false),
            setData(usersData)
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
                            <MessageComponent 
                                twoBtn={false}
                                nameBtn1="Cerrar"
                                onClickBt1={resetForm} 
                                headerMsg="Error" 
                                msg="No se encontraron resultados para la búsqueda realizada"/>
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
                                    name="identification"
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
                                disabled={load || statusButon}
                            >
                                Buscar
                            </Button>
                        </div>
                    </div>
                </form>
                <div>
                {data.length > 0?(
                    <>
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

                                {cancelar?(<><MessageComponent
                                                twoBtn={true}
                                                nameBtn1="Continuar"
                                                nameBtn2="Cancelar"
                                                onClickBt2={() =>setCancelar(false)}
                                                onClickBt1={ cancelarChanges }
                                                headerMsg="Cancelar cambios" 
                                                msg="Desea cancelar la acción, no se guardarán los datos"/></>):(<></>)}
                                
                                {changeUser?(<><MessageComponent
                                                twoBtn={false}
                                                nameBtn1="Cerrar"
                                                onClickBt1={ userChanges }
                                                headerMsg="Cambio realizado" 
                                                msg={`El usuario ha sido asociado a la Entidad,\n recuerde Guardar para que  \n  se haga efectivo el cambio`}/></>):(<></>)}
                           
                            <div className="flex justify-center mt-8">
                                <Button
                                text
                                className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                                onClick={ () =>setCancelar(true)}
                                >Cancelar</Button>
                                <Button 
                                    className="rounded-full !h-10"
                                    onClick={()=> setChangeUser(true)}
                                    disabled={changeBtn}
                                >Cambiar</Button>
                            </div>
                        </Card>
                    </>):(<></>)}
                </div>
            </Dialog>
        </>

    )
}
