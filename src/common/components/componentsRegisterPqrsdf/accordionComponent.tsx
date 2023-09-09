import { fetchData } from '../../apis/fetchData';
import { Accordion, AccordionTab } from 'primereact/accordion'

const ApiDataObjectoSocial = fetchData("/get-objecto-solicitud");

export const AccordionComponent = () => {

    const optionOjectoSocial = ApiDataObjectoSocial.read();
    const { data } = optionOjectoSocial
  
  return (
    <Accordion>
        <AccordionTab header="Derecho de Petición">
            <p className="m-0 ">
                Es el derecho que constitucionalmente tiene toda persona para presentar 
                peticiones respetuosas por motivos de interés general o particular y comprende 
                entre otras situaciones, el reconocimiento de un derecho, que se resuelva una 
                situación jurídica, que se preste un servicio, pedir información, requerir 
                documentos o formular consultas. Se considera como un instrumento que garantiza
                a los particulares obtener información de las autoridades, conocer la razón de 
                sus decisiones e inclusive contar con un sustento jurídico que les permita 
                auditar sus actos.
            </p>
        </AccordionTab>
        <AccordionTab header="Clases de Petición">
            <p className="m-0">
                <ul className='list-disc list-inside m-2 '>
                    <li className="m-4 ">
                        Petición de Información: Aquella que hace referencia a las actuaciones 
                        de la entidad, a la resolución de una inquietud o la entrega de 
                        información que no tengan carácter reservado.
                    </li>

                    <li className="m-4">
                        Petición de Documentos: Aquella que hace referencia a la expedición 
                        de copias o certificaciones que no tengan carácter reservado. 
                        En ningún caso el precio de las copias podrá exceder el valor de la
                        reproducción. Los costos de la expedición de las copias correrán por 
                        cuenta del interesado en obtenerlas.
                    </li>

                    <li className="m-4">
                        Consultas: Se refiere a las preguntas formuladas en relación con las
                        materias que le corresponden a la Agencia de Educación Postsecundaria
                        de Medellín-SAPIENCIA- para que rinda o emita algún concepto.
                    </li>
                    <p className='ml-4'>
                        No se debe confundir la petición de información con la consulta. 
                        Esta última está referida a un concepto técnico, que implica el 
                        análisis y fijación de una posición especializada, relacionado con 
                        temas de competencia de la entidad que requieren un estudio más 
                        profundo.
                    </p>
                </ul>
            </p>
        </AccordionTab>
        <AccordionTab header="Queja o reclamo">
            <p className="m-0">
                Manifestación de inconformidad de la ciudadanía por el inadecuado funcionamiento
                o ejercicio de la funciones propias de la entidad y/ o sus funcionarios, 
                las cuales, de acuerdo con el artículo 55 de la Ley 190 de 1995 reciben el 
                tratamiento de los derechos de petición en interés general o particular.
            </p>
        </AccordionTab>
        <AccordionTab header="Sugerencia">
            <p className="m-0">
                Propuesta o expresión formulada por un usuario con el fin de mejorar la
                prestación del servicio.
            </p>
        </AccordionTab>
        <AccordionTab header="Tiempos de respuesta">
            <p className="m-0">
            <table className='t-table'>
                    <tr>
                        <th className='td-table'>OBJETO</th>
                        <th className='td-table'>TÉRMINO DÍAS HÁBILES</th>
                    </tr>
                    {   data.map((data: { OBS_CODIGO: string; OBS_DESCRIPCION: string; OBS_TERMINO_DIAS_HABILES:string })=>(

                            <tr key={data.OBS_CODIGO}>
                            <td className='td-table'>{data.OBS_DESCRIPCION}</td>
                            <td className='td-table'>{ data.OBS_TERMINO_DIAS_HABILES}</td>
                            </tr>

                    ))
                        
                    }
                </table>
            </p>
        </AccordionTab>
    </Accordion>
  )
}

