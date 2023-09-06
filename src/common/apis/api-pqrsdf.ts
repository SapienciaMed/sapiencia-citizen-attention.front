interface Prueba {
    codigo: number;
    descripcion: string;
}

const url = 'http://127.0.0.1:4207/get-type-solicituds';

export const typeSolicituds = async () => {
    const resp = await fetch(url);
    const  {data}  = await resp.json();
    
    const opciones = data.map( data => ({
        id: data.TSO_CODIGO,
        description: data.TSO_DESCRIPTION
    }));


    return opciones
}