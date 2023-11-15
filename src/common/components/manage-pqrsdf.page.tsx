import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { usePqrsdfService } from '../hooks/PqrsdfService.hook';
import { useDaysParametrizationService } from '../hooks/daysParametrizationService.hook';
import { IDaysParametrization } from '../interfaces/daysParametrization.interfaces';
import { IrequestPqrsdf, IpqrsdfByReques } from '../interfaces/pqrsdf.interfaces';
import moment from 'moment-timezone';
import { ManagetPqrsdfComponent } from './genericComponent/managetPqrsdf.component';
import { TableManagePqrsdfComponent } from './genericComponent/tableManagePqrsdf.component';

import "../../styles/managePgrsdf-style.scss";
import useBreadCrumb from "../../common/hooks/bread-crumb.hook";


interface Detail {
  detailDate?:string;
  dayTypeId?:number;
}


const ManagePqrsdf = () => {

  const pqrsdfService = usePqrsdfService();
  const daysServices = useDaysParametrizationService()

  const [statusRequest, setStatusRequest] = useState<boolean>(true)
  const [pqrs, setPqrs] = useState<object[]>([]);
  const [getPqrsdfId, setGetPqrsdfId] = useState<number>();
  const [getManagetStatus, setManagetStatus] = useState<boolean>(false);  

  useBreadCrumb({
    isPrimaryPage: false,
    name: "Gestionar PQRDSF",
    url: "atencion-ciudadana/gestionar-pqrsdf",
  });

  let weekends = []
  const countDays = (initialDate: moment.MomentInput, holidays:string[])=>{
    const diasFestivos = holidays
    const Dateformt = moment(initialDate).format('YYYY-MM-DD')
    const fechaInicial = moment(Dateformt);
    const fechaActual = moment();
    let diasTranscurridos = 0;

    while (fechaInicial.isBefore(fechaActual)) {
      // Verifica si el día de la semana no es sábado (6) ni domingo (0)
      if (  fechaInicial.day() !== 6 && 
            fechaInicial.day() !== 0 &&
            !diasFestivos.some((festivo) => moment(festivo).isSame(fechaInicial, 'day'))
          ) {
        diasTranscurridos++;
        
      } 

      fechaInicial.add(1, 'days');
    }

    weekends = compareDatesInRange(holidays,initialDate)
    
    weekends.forEach((dates)=>{
      const Dateformt = moment(dates).format('YYYY-MM-DD')
      let days = moment(Dateformt);
      
      if (  days.day() == 6 || days.day() == 0 ) {
        diasTranscurridos++;
      } 
      
    })
    
    return diasTranscurridos-1    
  }

  function compareDatesInRange(datesArray, startDate) {
    // Convierte las fechas en objetos Moment
    const momentStartDate = moment(startDate);
    const momentEndDate = moment();
  
    // Filtra las fechas en el rango especificado
    const datesInRange = datesArray.filter((date) => {
      const momentDate = moment(date);
      return momentDate.isBetween(momentStartDate, momentEndDate, null, "[]");
    });
  
    return datesInRange;
  }



  function countDaysCalendar(fechaInicial: moment.MomentInput) {
    const fechaInicialMoment = moment(fechaInicial, 'YYYY-MM-DD');
  
    const fechaActualMoment = moment();
  
    const diasTranscurridos = fechaActualMoment.diff(fechaInicialMoment, 'days');
  
    return diasTranscurridos;
  }


  const daysParametrization = async ()=>{
    const { data } = await daysServices.getDaysParametrizations();
    
    const workingDays = [];
 
    const daysParametrization = await data.map((values:IDaysParametrization)=>{
      return{
        daysParametrization:values['daysParametrizationDetails']
      }
    })

    daysParametrization.forEach((values)=>{      
      values.daysParametrization.forEach((value:Detail)=>{
        if(value){
         
          workingDays.push(value.detailDate)
          
  
        }
      })
    })
    
    return workingDays
  }

  const getPqrsdf = async (param:IrequestPqrsdf)=>{   
    
    const workingDays = await daysParametrization();

    const resp = await pqrsdfService.getPqrsdfByRequest(param)
    const { data } = resp;
    
    const pqrsdfData = data.map((pqr:IpqrsdfByReques)=>{
      return{
        radicado: pqr['PQR_NRO_RADICADO'],
        identification: pqr['PER_NUMERO_DOCUMENTO'],
        names: `${pqr['PER_PRIMER_NOMBRE']} ${pqr['PER_SEGUNDO_NOMBRE']} ${pqr['PER_PRIMER_APELLIDO']} ${pqr['PER_SEGUNDO_APELLIDO']}`,
        program: pqr['PRG_DESCRIPCION'],
        asunto: pqr['ASO_ASUNTO'],
        fechaRadicado: moment(pqr['PQR_FECHA_CREACION']).format('DD-MM-YYYY') ,
        estado: pqr['LEP_ESTADO'],
        fechaProrroga: "10/20/2023",
        dias: pqr['OBS_TIPO_DIAS'] === 'Calendario'?countDaysCalendar(pqr['PQR_FECHA_CREACION']): countDays(pqr['PQR_FECHA_CREACION'],workingDays),
        pqrsdfId:pqr['PQR_CODIGO'],
        sbrEstado:pqr['SBR_ESTADO']
      }
    });

    setPqrs(pqrsdfData);

  }

  function focusBtn(id:string) {
    const btn1 = document.getElementById("btn-1");
    const btn2 = document.getElementById("btn-2");
    

    switch (id) {
      case 'btn-1':
        getPqrsdf({typeReques:2})
        btn1.style.color = '#533893';
        btn1.style.borderBottom = 'solid 2px #533893'
        btn2.style.color = '#6C757D';
        btn2.style.borderBottom = '0'
        setStatusRequest(true)
        break;
      
      case 'btn-2':
        getPqrsdf({typeReques:3})
        btn2.style.color = '#533893';
        btn2.style.borderBottom = 'solid 2px #533893'
        btn1.style.color = '#6C757D';
        btn1.style.borderBottom = '0'
        setStatusRequest(false)
        break;
      default:
        getPqrsdf({typeReques:2})
        btn1.style.color = '#533893';
        btn1.style.borderBottom = 'solid 2px #533893'
        btn2.style.color = '#6C757D';
        btn2.style.borderBottom = '0'
        break;
    }
  }

  useEffect(()=>{
    focusBtn('btn-1')
  },[])

  return (
    <>
        <div className='container-div' >
            <Card title={<p className='text-3xl block pb-5'>Gestionar PQRDSF</p>}  className='card-container card-top'>
              {/*getManagetStatus*/false?(<></>):( 
                <div className='flex flex-row justify-between mt-10 card-mobil'>
                <Card className='zise-card box1 shadow-none'>
                  <div className='box-mobil'>
                    <div className='flex justify-end'>
                      <div className='punto1 mb-4'></div>
                    </div>
                    <div>
                      <p className='text-xl mb-4 box-text'>Solicitudes pendientes</p>
                      <p className='text-sm'>por respuesta del área de permanencia</p>
                    </div>
                  </div>
                </Card>
                <Card className='zise-card box2 shadow-none'>
                  <div className='box-mobil'>
                    <div className='flex justify-end'>
                      <div className='punto2 mb-4'></div>
                    </div>
                      <div>
                        <p className='text-xl mb-4 box-text'>Solicitudes con respuesta</p>
                        <p className='text-sm'>por parte del área de permanencia</p>
                      </div>
                  </div>
                </Card>
                <Card className='zise-card box3 shadow-none'>
                  <div className='box-mobil'>
                    <div className='flex justify-end'>
                      <div className='punto3 mb-4'></div>
                    </div>
                    <div>
                      <p className='text-xl'>Solicitudes con prórroga</p>
                    </div>
                  </div>
                </Card>
                <Card className='zise-card box4 shadow-none'>
                  <div className='box-mobil'>
                    <div className='flex justify-end'>
                      <div className='punto4 mb-4'></div>
                    </div>              
                    <div>
                      <p className='text-xl'>Solicitudes cerradas con petición de reapertura</p>
                    </div>
                  </div>
                </Card>
              </div>
              )}
              <div className='div-end mt-10 mb-10'>
                <button className='btn-t btn-1' id='btn-1' onClick={()=>focusBtn('btn-1')}>Solicitudes en trámite</button>
                <button className='btn-t btn-2' id='btn-2' onClick={()=>focusBtn('btn-2')}>Solicitudes cerradas</button>
              </div>
              { /*getManagetStatus*/false?(  
                <ManagetPqrsdfComponent/>      
              ):(
                <Card className='card-container mt-10 card-bottom'>
                <TableManagePqrsdfComponent 
                  statusReq={statusRequest}
                  dataPqrsdf={pqrs}
                  getPqrsdfClose={()=>getPqrsdf({typeReques:3})}
                  managetPqr={(e)=>{
                    setGetPqrsdfId(e.pqrsdfId),
                    setManagetStatus(e.managetStatus)
                  }}
                />
                </Card>
              )}

            </Card>
        </div>
    </>
  )
}

export default ManagePqrsdf;
