import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Column, ColumnEvent } from "primereact/column"
import { DataTable, DataTableRowEvent, DataTableSelectionChangeEvent } from "primereact/datatable";
import { AppContext } from "../../contexts/app.context"; 
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { usePqrsdfService } from "../../hooks/PqrsdfService.hook";
import "../../../styles/table-movil-style.scss"
import { IpqrsdfByReques, IrequestReopen } from "../../interfaces/pqrsdf.interfaces";
import { date } from "yup";



interface Ipqrsdf {
    radicado?: string;
    identification?: string;
    names?: string;
    lastName?: string;
    program?: string;
    asunto?: string;
    fechaRadicado?:string;
    estado?: string;
    fechaProrroga?: string;
    dias?: string;
    pqrsdfId?:string;
    sbrEstado?: number
}

interface PageNumber {
    page: number;
  }

interface Props {
    statusReq: boolean;
    dataPqrsdf: Ipqrsdf[];
    getPqrsdfClose?: ()=>void
}

export const TableManagePqrsdfComponent = (props:Props) => {
    const { authorization } = useContext(AppContext);
    const pqrsdfService = usePqrsdfService();

    const { statusReq, dataPqrsdf,  getPqrsdfClose } = props;
    
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectPage, setSelectPage] = useState<PageNumber>({ page: 5 });
    const pageNumber: PageNumber[] = [{ page: 5 }, { page: 10 }, { page: 15 }, { page: 20 }];
    const [visible, setVisible] = useState<boolean>(false);
    const [iDdpqrsdf, setIDdpqrsdf] = useState<number>();
    const [nRadicado, setnRadicado] = useState<number>();
    const [tittle, setTittle] = useState<string>();

    useEffect(() => {
      
      setCustomers(getCustomers(dataPqrsdf));
      
      initFilters();
  }, []);

  useEffect(() => {
      if(statusReq){
        setTittle('Prórroga')
      }else{
        setTittle('Cierre')
      }
}, [statusReq]);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);

        return d;
    });
  };

  const defaultValues = {
    justification: "",
  };

  const {
    formState: { errors, isValid },
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues, mode: "all" });

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

    const initFilters = () => {
      setFilters({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          names: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          program: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          asunto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          estado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          radicado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]  },
          identification: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          fechaRadicado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          dias: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      });
      setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
};
  
    const accionesIcons = (pqrsdf:DataTableSelectionChangeEvent<Ipqrsdf[]>) => {      
       
        
        return (
            <>
                <div className="flex justify-center">
                    {statusReq?(
                    <>
                        <div className=''>
                            <Link to={''}>
                                <Tooltip target=".custom-target-icon" style={{borderRadius:'1px'}} />
                                <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                                    data-pr-tooltip="Gestionar"
                                    data-pr-position="right"
                                >
                                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5133 14.2083H1.375C0.896667 14.2083 0.5 13.8117 0.5 13.3333C0.5 12.855 0.896667 12.4583 1.375 12.4583H11.5133L9.50667 10.4517C9.16833 10.1133 9.16833 9.55332 9.50667 9.21499C9.845 8.87666 10.405 8.87666 10.7433 9.21499L14.2433 12.715C14.325 12.7967 14.3833 12.89 14.43 12.995C14.5233 13.205 14.5233 13.45 14.43 13.66C14.3833 13.765 14.325 13.8583 14.2433 13.94L10.7433 17.44C10.5683 17.615 10.3467 17.6967 10.125 17.6967C9.90333 17.6967 9.68167 17.615 9.50667 17.44C9.16833 17.1017 9.16833 16.5417 9.50667 16.2033L11.5133 14.1967V14.2083ZM21.5 8.08332V18C21.5 19.7733 20.065 21.2083 18.2917 21.2083H9.54167C7.76833 21.2083 6.33333 19.7733 6.33333 18V16.8333C6.33333 16.355 6.73 15.9583 7.20833 15.9583C7.68667 15.9583 8.08333 16.355 8.08333 16.8333V18C8.08333 18.805 8.73667 19.4583 9.54167 19.4583H18.2917C19.0967 19.4583 19.75 18.805 19.75 18V8.95832H14.2083C13.73 8.95832 13.3333 8.56166 13.3333 8.08332V2.54166H9.54167C8.73667 2.54166 8.08333 3.19499 8.08333 3.99999V9.83332C8.08333 10.3117 7.68667 10.7083 7.20833 10.7083C6.73 10.7083 6.33333 10.3117 6.33333 9.83332V3.99999C6.33333 2.22666 7.76833 0.791656 9.54167 0.791656H14.2083C14.4417 0.791656 14.6633 0.88499 14.8267 1.04832L21.2433 7.46499C21.4067 7.62832 21.5 7.84999 21.5 8.08332ZM15.0833 7.20832H18.5133L15.0833 3.77832V7.20832Z" fill="black"/>
                                  </svg>
                                </i>

                            </Link>
                        </div>
                    </>):(
                    <>
                        <div className="mr-4">
                            <Link to={''}>
                                <Tooltip target=".custom-target-icon" style={{borderRadius:'1px'}} />
                                <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                                    data-pr-tooltip="Ver detalle"
                                    data-pr-position="right"
                                >
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.13575 13.498C0.95475 13.193 0.95475 12.807 1.13575 12.502C3.04075 9.279 6.52075 6.5 10.0007 6.5C13.4807 6.5 16.9597 9.279 18.8647 12.501C19.0457 12.807 19.0457 13.194 18.8647 13.5C16.9597 16.721 13.4807 19.5 10.0007 19.5C6.52075 19.5 3.04075 16.721 1.13575 13.498Z" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12.1215 10.879C13.2935 12.051 13.2935 13.95 12.1215 15.122C10.9495 16.294 9.05051 16.294 7.87851 15.122C6.70651 13.95 6.70651 12.051 7.87851 10.879C9.05051 9.707 10.9505 9.707 12.1215 10.879" stroke="#058CC1" stroke-width="1.4286" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10.001 1V3.5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M3.00098 3L4.68098 5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M17.0008 3L15.3208 5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </i>

                            </Link>
                        </div>
                        <div>
                        {authorization?.allowedActions &&
                        authorization?.allowedActions?.findIndex((i) => i == "SOLICITAR_REABRIR") >= 0 && (
                            <Link to={''} onClick={()=>managetPqrsdf(pqrsdf.pqrsdfId,pqrsdf.radicado)}>
                                <Tooltip target=".custom-target-icon" style={{borderRadius:'1px'}} />
                                <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center"
                                    data-pr-tooltip="Solicitar reabrir"
                                    data-pr-position="right"
                                >
                                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.95836 16.5833H0.208355V3.75001C0.202187 3.33384 0.278254 2.92054 0.432192 2.53383C0.58613 2.14712 0.814911 1.79461 1.10541 1.49652C1.3959 1.19844 1.7424 0.960649 2.12501 0.796793C2.50762 0.632937 2.91882 0.546241 3.33502 0.541679H6.14669C6.27379 0.538941 6.4 0.563569 6.51675 0.613893C6.63351 0.664217 6.73807 0.73906 6.82335 0.833346L9.93835 4.60168H15.6667C16.0888 4.60002 16.507 4.68291 16.8966 4.84546C17.2862 5.00801 17.6393 5.24694 17.935 5.54814C18.2308 5.84934 18.4632 6.20672 18.6187 6.5992C18.7741 6.99168 18.8494 7.41131 18.84 7.83335V8.41668H17.09V7.83335C17.0947 7.64351 17.0613 7.45465 16.9919 7.2779C16.9225 7.10116 16.8184 6.94009 16.6857 6.80419C16.5531 6.6683 16.3946 6.56031 16.2196 6.48661C16.0446 6.4129 15.8566 6.37495 15.6667 6.37501H9.51835C9.39115 6.37474 9.26558 6.34636 9.15061 6.29191C9.03565 6.23745 8.93415 6.15827 8.85335 6.06001L5.73835 2.29168H3.33502C2.95954 2.30388 2.60411 2.46403 2.34623 2.73721C2.08834 3.01039 1.94892 3.37445 1.95836 3.75001V16.5833Z" fill="black"/>
                                        <path d="M16.9732 17.4583H1.08321C0.933409 17.4571 0.786359 17.4179 0.655789 17.3445C0.525219 17.271 0.415387 17.1657 0.336546 17.0383C0.261896 16.9067 0.222656 16.758 0.222656 16.6067C0.222656 16.4554 0.261896 16.3066 0.336546 16.175L4.27988 8.59167C4.35678 8.4513 4.46979 8.33403 4.60722 8.25198C4.74465 8.16994 4.9015 8.1261 5.06155 8.125H20.9165C21.0663 8.12623 21.2134 8.16539 21.344 8.23884C21.4745 8.31229 21.5844 8.41762 21.6632 8.545C21.7379 8.67662 21.7771 8.82535 21.7771 8.97667C21.7771 9.12798 21.7379 9.27671 21.6632 9.40833L17.7199 16.9917C17.6459 17.127 17.5384 17.241 17.4076 17.3228C17.2769 17.4045 17.1273 17.4512 16.9732 17.4583ZM2.51821 15.7083H16.4482L19.4815 9.875H5.55155L2.51821 15.7083Z" fill="black"/>
                                    </svg>
                                </i>

                            </Link>
                        )}
                        </div>
                    </>)}
                </div>
            </>
        );
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
                disabled={options.disabled}
                style={{ opacity: "1.4" }}
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
                disabled={options.disabled}
                style={{ opacity: "1.4" }}
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
                style={{ backgroundColor: "#533893", borderRadius: "4px", color: "white" }}
                className={options.className}
                onClick={options.onClick}
              >
                {options.page + 1}
              </Button>
            );
          },
        };
    };
    
    const createReopen = async (justification:IrequestReopen)=>{
      const resp = await pqrsdfService.createRequestReopen(justification);
      return resp;
    }

    const managetPqrsdf = (id:number,radicado:number)=>{
      setVisible(true);
      setIDdpqrsdf(id);
      setnRadicado(radicado);
    }
    
    const onSubmit = async (data:{justification:string}) => {
    
      const  justification:IrequestReopen = { justification: [ {
        srb_justificacion:data['justification'],
        sbr_estado: true
        },
        {
          pqrsdfId: iDdpqrsdf,
          radicado: nRadicado
        }]};

        const resp = await createReopen(justification);
        if(resp.data){
          setVisible(false);
          getPqrsdfClose()
        }
        
     reset()
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
         <div className="flex flex-row items-center justify-between mb-8 header-movil">
            <div className="col-1 col-100 seeker">
                <span className="p-input-icon-left">
                  <i className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge flex justify-center">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.77024 15.3C6.28094 15.3 4.8251 14.8584 3.58679 14.031C2.34849 13.2036 1.38335 12.0275 0.813425 10.6516C0.243497 9.27568 0.0943779 7.76165 0.384925 6.30097C0.675471 4.84029 1.39263 3.49858 2.44572 2.44549C3.49881 1.3924 4.84053 0.675235 6.30121 0.384688C7.76188 0.0941414 9.27592 0.24326 10.6518 0.813188C12.0278 1.38312 13.2038 2.34826 14.0312 3.58656C14.8586 4.82486 15.3002 6.28071 15.3002 7.77C15.3002 8.75885 15.1055 9.73803 14.727 10.6516C14.3486 11.5652 13.794 12.3953 13.0948 13.0945C12.3955 13.7937 11.5654 14.3484 10.6518 14.7268C9.73826 15.1052 8.75909 15.3 7.77024 15.3ZM7.77024 1.75C6.58355 1.75 5.42351 2.1019 4.43682 2.76118C3.45012 3.42047 2.68109 4.35754 2.22696 5.4539C1.77283 6.55026 1.65401 7.75666 1.88553 8.92054C2.11704 10.0844 2.68848 11.1535 3.5276 11.9926C4.36671 12.8318 5.43581 13.4032 6.5997 13.6347C7.76358 13.8662 8.96998 13.7474 10.0663 13.2933C11.1627 12.8392 12.0998 12.0701 12.7591 11.0834C13.4183 10.0967 13.7702 8.93669 13.7702 7.75C13.7702 6.1587 13.1381 4.63258 12.0129 3.50736C10.8877 2.38214 9.36154 1.75 7.77024 1.75Z" fill="#596471"/>
                      <path d="M17.0005 17.75C16.9019 17.7505 16.8043 17.7312 16.7133 17.6935C16.6222 17.6557 16.5397 17.6001 16.4705 17.53L12.3405 13.4C12.208 13.2578 12.1358 13.0698 12.1393 12.8755C12.1427 12.6812 12.2214 12.4958 12.3588 12.3584C12.4962 12.221 12.6816 12.1422 12.8759 12.1388C13.0702 12.1354 13.2583 12.2075 13.4005 12.34L17.5305 16.47C17.6709 16.6106 17.7498 16.8012 17.7498 17C17.7498 17.1987 17.6709 17.3894 17.5305 17.53C17.4612 17.6001 17.3787 17.6557 17.2876 17.6935C17.1966 17.7312 17.099 17.7505 17.0005 17.75Z" fill="#596471"/>
                      </svg>

                  </i>
                  <InputText
                      className="h-10" 
                      placeholder="Buscar"
                      value={globalFilterValue} onChange={onGlobalFilterChange} 
                  />
                </span>
       
            </div>
            <div className="flex flex-row items-center tittle-header-movil">
                <div className=" mr-4 flex items-center total">
                    <div><label className="mr-2 text-base total">Total de resultados</label></div>
                    <div><span className="text-black flex items-center bold big">{dataPqrsdf.length}</span></div>
                </div>
                <div className="flex items-center pagination-p">
                    <div><label className="mr-2 p-colorpicker">Registro por página</label></div>
                   <div>
                      <Dropdown
                          value={selectPage}
                          onChange={(e: DropdownChangeEvent) => setSelectPage(e.value)}
                          options={pageNumber}
                          optionLabel="page"
                          className="h-10"
                      />
                   </div>
                </div>
            </div>
        </div>

        <div className="overflow-hidden max-w-[calc(111vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] block md:block borderless reverse-striped">
            <DataTable
                value={dataPqrsdf}
                paginator
                paginatorTemplate={paginatorTemplate()}
                rows={selectPage.page}
                stripedRows
                selectionMode="single"
                dataKey="id"
                scrollable
                filters={filters}
                globalFilterFields={['names','program','asunto','estado','radicado', 'identification','fechaRadicado','dias']}
                rowClassName={(rowData) => rowData.sbrEstado === 1?'color-row':''}
            >
                <Column style={{ textAlign: "center" }} field="radicado" header="Radicado"></Column>
                <Column style={{ textAlign: "center" }} headerStyle={{ width: '3rem' }} body={(data, options) => 'CC'}></Column>
                <Column style={{ textAlign: "center" }} field={"identification"} header={<p style={{width:'112px'}}>Doc. Identidad</p>}></Column>
                <Column style={{ textAlign: "center" }} field="names" header={<p style={{width:'146px'}}>Nombre y apellidos</p>}></Column>
                <Column
                    style={{ textAlign: "center", justifyContent: "center" }}
                    field="program"
                    header="Programa"
                ></Column>
                <Column style={{ textAlign: "center" }} field="asunto" header="Asunto"></Column>
                <Column style={{ textAlign: "center" }} field="fechaRadicado" header={<p style={{width:'124px'}}>Fecha Radicado</p>}></Column>
                <Column style={{ textAlign: "center" }} field="estado" header="Estado"></Column>
                <Column style={{ textAlign: "center"}} field="fechaProrroga" header={<p style={{width:'124px'}}>Fecha {tittle}</p>}></Column>
                <Column style={{ textAlign: "center"}} field="dias" header="Días"></Column>
                <Column
                    field="accion"
                    header="Acción"
                    body={accionesIcons}
                    style={{ textAlign: "center"}}
                ></Column>
            </DataTable>
      </div>
      <Dialog
         header={<h1>Solicitud de reabrir PQRSDF</h1>}
         headerStyle={{ color: "black", display: "flex", flexDirection: "row" }}
         visible={visible}
         style={{ width: "42em" }}
         onHide={() => setVisible(false)}
         className="dialog-movil"
         closeIcon={closeIcon}
      >
        <Card className="card-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="justification"
              control={control}
              rules={{
                required: 'Campo obligatorio',
                maxLength:{ value: 1000, message: "Solo se permiten 1000 caracteres"}
              }}
              render={({field, fieldState }) =>(
                <>
                  <p className="text-xl">Justificación<span className="text-red-600">*</span></p>
                  <InputTextarea
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error },'text-mobil')}   
                    rows={4} 
                    cols={60}
                    placeholder="Escribe aquí" 
                    />
                </>
              )}
            />
            <div className="flex flex-row justify-between">
              {getFormErrorMessage('justification')}
              <span className="font-label">Max 1000 caracteres</span>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                text
                className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                label="Cancelar"
                onClick={()=>setVisible(false)}
              ></Button>
              <Button 
                className="rounded-full !h-10" 
                label="Enviar"
                disabled={!isValid}
                >
              </Button>
            </div>
          </form>
        </Card>
      </Dialog>
    </>
  )
}
