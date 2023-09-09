
const url = process.env.urlApiCitizenAttention;
//const url = 'http://127.0.0.1:4207';




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




