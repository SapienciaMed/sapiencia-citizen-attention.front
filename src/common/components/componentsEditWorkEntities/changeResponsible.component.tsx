import { useRef, useState } from "react";
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
    names:''
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
        names:'',
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
    if(watch('names').length>0 || watch('identification').length>0 || watch('lastName').length>0 || watch('email').length>0  ){
        statusButon = false
    }
    
    const onSubmit = async ( filter:Payload) => {
        
        setLoad(true)
        try {

            const { email, identification, lastNames, names} = filter;
      
            const payload:IWorkEntityFilters = {
                email,
                lastNames,
                names,
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

    const paginatorTemplate = (prev = "Anterior", next = "Siguiente") => {
        return {
          layout: "PrevPageLink PageLinks NextPageLink",
          PrevPageLink: (options) => {
            return (
              <Button
                type="button"
                className={classNames(options.className, "!rounded-lg")}
                onClick={options.onClick}
                disabled={options.disabled }
              >
                <span className="p-3 text-black">{prev}</span>
              </Button>
            );
          },
          NextPageLink: (options) => {
            return (
              <Button
                className={classNames(options.className, "!rounded-lg")}
                onClick={options.onClick}
                disabled={options.disabled }
              >
                <span className="p-3 text-black">{next}</span>
              </Button>
            );
          },
          PageLinks: (options) => {
            
            if (
              (options.view.startPage === options.page && options.view.startPage !== 0) ||
              (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
            ) {
              const className = classNames(options.className, { "p-disabled": true });
    
              return (
                <span className={className} style={{ userSelect: "none" }}>
                  ...
                </span>
              );
            }
    
            return (
              <Button 
                style={{backgroundColor:'#533893', borderRadius:'4px', color:'white' }}
                className={options.className} 
                onClick={options.onClick}
                >
                {options.page + 1}
              </Button>
            );
          },
        };
      };

      const closeIcon = () => (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
            fill="#533893"
          />
        </svg>
      );
      
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
                headerStyle={{color:'black', display:'flex', flexDirection:'row'}}
                headerClassName="prueba"
                visible={visible} 
                style={{ width: '60em'}} 
                onHide={() => setVisible(false)}
                className="dialog-movil"
                closeIcon={closeIcon} 
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
                                    name="names"
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
                                label="Limpiar Campos"
                            >  
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
                                    <div className="pl-8"><label className="mr-2 text-base ">Total de resultados</label> <span className="text-black bold big">{data.length}</span></div>
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
                                        paginatorTemplate={paginatorTemplate()}
                                        scrollable
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
