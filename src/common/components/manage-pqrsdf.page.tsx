import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { TableManagePqrsdfComponent } from './genericComponent/tableManagePqrsdf.component';

import "../../styles/managePgrsdf-style.scss";


const ManagePqrsdf = () => {

  const [statusRequest, setStatusRequest] = useState<boolean>(true)

  function focusBtn(id:string) {
    const btn1 = document.getElementById("btn-1");
    const btn2 = document.getElementById("btn-2");

    switch (id) {
      case 'btn-1':
        btn1.style.color = '#533893';
        btn1.style.borderBottom = 'solid 2px #533893'
        btn2.style.color = '#6C757D';
        btn2.style.borderBottom = '0'
        setStatusRequest(true)
        break;
      
      case 'btn-2':
        btn2.style.color = '#533893';
        btn2.style.borderBottom = 'solid 2px #533893'
        btn1.style.color = '#6C757D';
        btn1.style.borderBottom = '0'
        setStatusRequest(false)
        break;
      default:
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
            <Card title="Gestionar PQRDSF"  className='card-container'>
              <div className='flex flex-row justify-between mt-10'>
                <Card className='zise-card box1'>
                  <div className='flex justify-end'>
                    <div className='punto1 mb-4'></div>
                  </div>
                  <p className='text-xl mb-4'>Solicitudes pendientes</p>
                  <p className='text-sm'>por respuesta del área de permanencia</p>
                </Card>
                <Card className='zise-card box2'>
                  <div className='flex justify-end'>
                    <div className='punto2 mb-4'></div>
                  </div>
                  <p className='text-xl mb-4'>Solicitudes con respuesta</p>
                  <p className='text-sm'>por parte del área de permanencia</p>
                </Card>
                <Card className='zise-card box3'>
                  <div className='flex justify-end'>
                    <div className='punto3 mb-4'></div>
                  </div>
                  <p className='text-xl'>Solicitudes con prórroga</p>
                </Card>
                <Card className='zise-card box4'>
                  <div className='flex justify-end'>
                    <div className='punto4 mb-4'></div>
                  </div>              
                  <p className='text-xl'>Solicitudes cerradas con petición de reapertura</p>
                </Card>
              </div>
              <div className='div-end mt-10 mb-10'>
                <button className='btn-t btn-1' id='btn-1' onClick={()=>focusBtn('btn-1')}>Solicitudes en trámite</button>
                <button className='btn-t btn-2' id='btn-2' onClick={()=>focusBtn('btn-2')}>Solicitudes cerradas</button>
              </div>
              <Card className='card-container mt-10'>
                <TableManagePqrsdfComponent statusReq={statusRequest}/>
              </Card>
            </Card>
        </div>
    </>
  )
}

export default ManagePqrsdf;
