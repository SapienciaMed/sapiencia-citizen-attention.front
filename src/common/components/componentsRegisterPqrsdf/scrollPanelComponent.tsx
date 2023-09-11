
import { ScrollPanel } from 'primereact/scrollpanel';
        

export const ScrollPanelComponent = () => {
  return (
    <div className="card">
        <ScrollPanel style={{ width: '100%', height: '250px' }} className='scrollp custombar1 bg-scroll">'>
            <p className="m-4 !font-sans">
                En observancia de la Ley 1581 de 2012, reglamentada parcialmente por el Decreto 1377 
                de 2013 y la política de Protección y Tratamiento de datos personales adoptada por 
                SAPIENCIA, las finalidades de la información, que solicita, se entrega y/o recolecta 
                la Agencia de Educación Postsecundaria de Medellín - Sapiencia, será utilizada para:
            </p>
    
            <ol  className='list-decimal m-4 list-ol !font-sans'>
                <li>Realizar análisis, valoración y estadísticas que permitan generar políticas y/o normas en materia de educación superior.</li>
                <li>Cumplimiento de la ley de transparencia y el derecho al acceso a la información pública.</li>
                <li>La presentación de informes a los organismos de control.</li>
                <li>Para la entrega de información a entidades cuyo objeto social y/o misional incluya la recolección de datos estadísticos, históricos y científicos.</li>
                <li>Por solicitud de autoridad judicial.</li>
            </ol>

            <p className="m-4 !font-sans" >
                Para el caso de tratamiento de datos personales de menores de edad, de acuerdo a la 
                normatividad vigente, éstos solo pueden ser suministrados con la autorización expresa 
                de sus representantes legales, tutores o curadores.
            </p>

            <p className="m-4 !font-sans">
                Entiendo que  datos sensibles son aquellos que afectan la intimidad del titular o cuyo uso 
                indebido pueda generar discriminación (información étnica, racial, su orientación política,
                convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, 
                de derechos humanos, así como los relativos a la salud, vida sexual y datos biométricos).
            </p>

            <p className="m-4 !font-sans">Los datos sensibles que se recolectarán serán utilizados únicamente para las finalidades descritas por la Agencia.</p>

            <p className="m-4 !font-sans">
                Señor ciudadano, usted como titular de sus datos personales tiene derecho a conocer, actualizar y/o
                rectificar sus datos personales y podrá también en los casos que sea procedente, solicitar sean 
                suprimidos o revocar la autorización otorgada para su tratamiento.  
            </p>
            <p className="m-4 !font-sans">
                Si desea presentar una consulta, reclamo o petición de información relacionada con datos personales,
                puede diligenciar el formulario de PQRSDF, enviar un correo electrónico a info@sapiencia.gov.co o en 
                nuestra sede principal ubicada en Transversal 73 # 65 - 296 Sector El Volador, Medellín o en la línea telefónica 444 79 47.
            </p>
            <p className="m-4 !font-sans">
                Con la suscripción de este formulario, se entienden aceptadas las finalidades para el
                 tratamiento de datos personales y que conoce los mecanismos para su protección.
            </p>
        </ScrollPanel>
    </div>
  )
}
