
//const url = process.env.urlApiCitizenAttention;
const url = 'http://127.0.0.1:4207';

export const typeSolicituds = async () => {

    const resp = await fetch(`${url}/get-type-solicituds`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { TSO_CODIGO: number; TSO_DESCRIPTION: string; }) => ({
        id: data.TSO_CODIGO,
        description: data.TSO_DESCRIPTION
    }));
    
    return opciones
};

export const typeDocument = async () => {

    const resp = await fetch(`${url}/get-type-docuement`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { LGE_CODIGO: number; LGE_ELEMENTO_DESCRIPCION: string; }) => ({
        id: data.LGE_CODIGO,
        description: data.LGE_ELEMENTO_DESCRIPCION
    }));

    return opciones
};

export const typeEntidadJuridica = async () => {

    const resp = await fetch(`${url}/get-legal-entity`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { TEJ_CODIGO: number; TEJ_NOMBRE: string; }) => ({
        id: data.TEJ_CODIGO,
        description: data.TEJ_NOMBRE
    }));

    return opciones
};

export const responseMedium = async () => {

    const resp = await fetch(`${url}/get-response-medium`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { MRE_CODIGO: number; MRE_DESCRIPCION: string; }) => ({
        id: data.MRE_CODIGO,
        description: data.MRE_DESCRIPCION
    }));

    return opciones
};

export const programs = async () => {

    const resp = await fetch(`${url}/get-Programs`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { PRG_CODIGO: number; PRG_DESCRIPCION: string; }) => ({
        id: data.PRG_CODIGO,
        description: data.PRG_DESCRIPCION
    }));

    return opciones
};

export const asuntoSolicitud = async () => {

    const resp = await fetch(`${url}/get-solicitudes`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { ASO_CODIGO: number; ASO_ASUNTO: string; }) => ({
        id: data.ASO_CODIGO,
        description: data.ASO_ASUNTO
    }));

    return opciones
};

export const paises = async () => {

    const resp = await fetch(`${url}/get-paises`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { LGE_CODIGO: number;LGE_ELEMENTO_DESCRIPCION: string; }) => ({
        id: data.LGE_CODIGO,
        description: data.LGE_ELEMENTO_DESCRIPCION
    }));

    return opciones
};

export const departamentos = async () => {

    const resp = await fetch(`${url}/get-departamentos`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { LGE_ELEMENTO_CODIGO: string; LGE_ELEMENTO_DESCRIPCION: string; }) => ({
        id: data.LGE_ELEMENTO_CODIGO,
        description: data.LGE_ELEMENTO_DESCRIPCION
    }));

    return opciones
};

export const municipios = async (id:string) => {

    const resp = await fetch(`${url}/get-municipios/${id}`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { LGE_CODIGO: string; LGE_ELEMENTO_DESCRIPCION: string; }) => ({
        id: data.LGE_CODIGO,
        description: data.LGE_ELEMENTO_DESCRIPCION
    }));

    return opciones
};

export const objectoSolicitud = async () => {

    const resp = await fetch(`${url}/get-objecto-solicitud`);
    const  {data}  = await resp.json();
    
    const opciones = data.map( (data: { OBS_CODIGO: string; OBS_DESCRIPCION: string; OBS_TERMINO_DIAS_HABILES:string }) => ({
        id: data.OBS_CODIGO,
        description: data.OBS_DESCRIPCION,
        dias: data.OBS_TERMINO_DIAS_HABILES
    }));

    return opciones
};

export const listaParametros = async () => {

    const resp = await fetch(`${url}/get-listaParametros`);
    const  data  = await resp.json();
    
    const opciones = data[0]['LPA_VALOR'];

    return opciones
};