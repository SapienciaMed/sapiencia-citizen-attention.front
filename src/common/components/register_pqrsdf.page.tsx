import { Card } from 'primereact/card';
import { AccordionComponent } from './componentsRegisterPqrsdf/accordionComponent';
import '../../styles/register_pqrsdf.scss' 

const Register_pqrsdf = ()=> {
  return (
    
    <div className='container'>
        <Card className='card'>
            <Card 
                title='Registrar PQRSDF'
                subTitle='SAPIENCIA adoptó el manual de atención a PQRSDF por resolución 212 de 2016, en virtud de este se establece lo siguiente:' 
                className='card'
            >
                <AccordionComponent/>
            </Card>
        </Card>
    </div>

  )
}

export default Register_pqrsdf;