
const url = 'http://127.0.0.1:4207';

export const typeSolicituds = async () => {

    const resp = await fetch(`${url}/get-type-solicituds`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { TSO_CODIGO: number; TSO_DESCRIPTION: string; }) => ({
        id: data.TSO_CODIGO,
        description: data.TSO_DESCRIPTION
    }));

    return opciones
}

export const typeDocument = async () => {

    const resp = await fetch(`${url}/get-type-docuement`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { LGE_CODIGO: number; LGE_ELEMENTO_CODIGO: string; }) => ({
        id: data.LGE_CODIGO,
        description: data.LGE_ELEMENTO_CODIGO
    }));

    return opciones
}

export const typeEntidadJuridica = async () => {

    const resp = await fetch(`${url}/get-legal-entity`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { TEJ_CODIGO: number; TEJ_NOMBRE: string; }) => ({
        id: data.TEJ_CODIGO,
        description: data.TEJ_NOMBRE
    }));

    return opciones
}

export const responseMedium = async () => {

    const resp = await fetch(`${url}/get-response-medium`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { MRE_CODIGO: number; MRE_DESCRIPCION: string; }) => ({
        id: data.MRE_CODIGO,
        description: data.MRE_DESCRIPCION
    }));

    return opciones
}