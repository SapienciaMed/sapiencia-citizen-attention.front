import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { TableManagePqrsdfComponent } from './genericComponent/tableManagePqrsdf.component';
import { usePqrsdfService } from '../hooks/PqrsdfService.hook';
import { useDaysParametrizationService } from '../hooks/daysParametrizationService.hook';
import { IrequestPqrsdf, IpqrsdfByReques } from '../interfaces/pqrsdf.interfaces';
import moment from 'moment-timezone';

import { IDaysParametrization } from '../interfaces/daysParametrization.interfaces';

import "../../styles/managePgrsdf-style.scss";

interface Detail {
 
  detailDate:string
}


const ManagePqrsdf = () => {

  const pqrsdfService = usePqrsdfService();
  const daysServices = useDaysParametrizationService()

  const [statusRequest, setStatusRequest] = useState<boolean>(true)
  const [pqrs, setPqrs] = useState<object[]>([]);

  const countDays = (initialDate: moment.MomentInput, daysParametrization:any[])=>{
    const diasFestivos = daysParametrization
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
    
    return diasTranscurridos    
  }

  const daysParametrization = async ()=>{
    const { data } = await daysServices.getDaysParametrizations();
    
    const days = [];
    
    const daysParametrization = await data.map((values:IDaysParametrization)=>{
      return{
        daysParametrization:values['daysParametrizationDetails']
      }
    })

    daysParametrization.forEach((values)=>{
      values.daysParametrization.forEach((value:Detail)=>{
        if(value){
          days.push(value.detailDate)
        }
      })
    })
    
    return days
  }

  const getPqrsdf = async (param:IrequestPqrsdf)=>{   
    
    const days = await daysParametrization()
    const resp = await pqrsdfService.getPqrsdfByRequest(param)
    const { data } = resp;
    
    const pqrsdfData = data.map((pqr:IpqrsdfByReques)=>{
      return{
        radicado: pqr['PQR_NRO_RADICADO'],
        identification: pqr['PER_NUMERO_DOCUMENTO'],
        names: `${pqr['PER_PRIMER_NOMBRE']} ${pqr['PER_SEGUNDO_NOMBRE']} ${pqr['PER_PRIMER_APELLIDO']} ${pqr['PER_SEGUNDO_APELLIDO']}`,
        program: pqr['PRG_DESCRIPCION'],
        asunto: pqr['ASO_ASUNTO'],
        fechaRadicado: moment(pqr['PQR_FECHA_CREACION']).format('YYYY-MM-DD') ,
        estado: pqr['LEP_ESTADO'],
        fechaProrroga: "10/20/2023",
        dias: countDays(pqr['PQR_FECHA_CREACION'],days),
        pqrsdfId:pqr['PQR_CODIGO'],
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
            <Card title={<p className='text-3xl block pb-5'>Gestionar PQRDSF</p>}  className='card-container'>
              <div className='flex flex-row justify-between mt-10 card-mobil'>
                <Card className='zise-card box1'>
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
                <Card className='zise-card box2'>
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
                <Card className='zise-card box3'>
                  <div className='box-mobil'>
                    <div className='flex justify-end'>
                      <div className='punto3 mb-4'></div>
                    </div>
                    <div>
                      <p className='text-xl'>Solicitudes con prórroga</p>
                    </div>
                  </div>
                </Card>
                <Card className='zise-card box4'>
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
              <div className='div-end mt-10 mb-10'>
                <button className='btn-t btn-1' id='btn-1' onClick={()=>focusBtn('btn-1')}>Solicitudes en trámite</button>
                <button className='btn-t btn-2' id='btn-2' onClick={()=>focusBtn('btn-2')}>Solicitudes cerradas</button>
              </div>
              <Card className='card-container mt-10'>
                <TableManagePqrsdfComponent 
                  statusReq={statusRequest}
                  dataPqrsdf={pqrs}
                />
              </Card>
            </Card>
        </div>
    </>
  )
}

export default ManagePqrsdf;