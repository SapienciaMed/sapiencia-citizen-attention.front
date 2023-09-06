import { useEffect, useState } from "react";
import { typeSolicituds } from "../apis/api-pqrsdf";
import { typeDocument } from "../apis/api-pqrsdf";
import { typeEntidadJuridica } from "../apis/api-pqrsdf"
import { responseMedium } from "../apis/api-pqrsdf";

export const useGetTypeSolicitud = ( ) => {

    const [ solicitudes, setSolicitudes ] = useState([]);

    useEffect( ()=> {
        typeSolicituds()
            .then( typos => { setSolicitudes( typos ) });      
    }, [] )
  
    return { solicitudes }

}

export const useGetTypeDocuments = ( ) => {

    const [ docuements, setDocuement ] = useState([]);

    useEffect( ()=> {
        typeDocument()
            .then( typos => { setDocuement( typos ) });      
    }, [] )
    
    return { docuements }

}

export const useGetTipoEntidadJuridica = ( ) => {

    const [ entidadJuridica, setEntidadJuridica ] = useState([]);

    useEffect( ()=> {
        typeEntidadJuridica()
            .then( typos => { setEntidadJuridica( typos ) });      
    }, [] )
    
    return { entidadJuridica }

}

export const useGetResponseMedium = ( ) => {

    const [ medium, setmedium ] = useState([]);

    useEffect( ()=> {
        responseMedium()
            .then( typos => { setmedium( typos ) });      
    }, [] )
    
    return { medium }

}