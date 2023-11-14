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

export interface IlegalEntityType {
    tej_codigo?: number;
    tej_nombre?: string;
}

export interface Countrys {
    LGE_CODIGO: number,
    LGE_ELEMENTO_DESCRIPCION: string
}

export interface Departament {
    LGE_CODIGO: number;
    LGE_ELEMENTO_CODIGO: string;
    LGE_ELEMENTO_DESCRIPCION: string ;
}

export interface IMunicipality {
    LGE_CODIGO: number;
    LGE_ELEMENTO_CODIGO: string;
    LGE_ELEMENTO_DESCRIPCION: string;
}

export interface IMResponseMedium {
    MRE_CODIGO:number;
    MRE_DESCRIPCION:string;
}

export interface IProgram {
    PRG_CODIGO: number;
    PRG_DESCRIPCION: string;
    CLP_CODIGO: number;
    CLP_DESCRIPCION: string;
    DEP_CODIGO: number;
    DEP_DESCRIPCION: string;
}


export interface ISubjectRequest {
    ASO_CODIGO: number;
    ASO_ASUNTO: string;
}

