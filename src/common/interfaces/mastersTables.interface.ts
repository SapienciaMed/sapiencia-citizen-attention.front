export interface ItypeDocument {
    LGE_CODIGO: number;
    LGE_ELEMENTO_DESCRIPCION: string;
}

export interface IChannelAttetion {
    cna_codigo: number,
    cna_canal: string
}

export interface IChannelAttetionDetail {
    cad_codigo: number,
    cad_nombre: string
}

export interface ItypeRFequest {
    TSO_CODIGO : number;
    TSO_DESCRIPTION : string;
    TSO_ACTIVO : boolean;
    TSO_ORDEN :number;
}

export interface tej_nombre {
    tej_codigo: number,
    tej_nombre: string
}

export interface Countrys {
    LGE_CODIGO: number,
    LGE_ELEMENTO_DESCRIPCION: string
}

export interface Departament {
    LGE_CODIGO: number;
    LGE_ELEMENTO_CODIGO: string;
    LGE_ELEMENTO_DESCRIPCION: string
}

export interface IMunicipality {
    LGE_CODIGO: number;
    LGE_ELEMENTO_CODIGO: string;
    LGE_ELEMENTO_DESCRIPCION: string
}