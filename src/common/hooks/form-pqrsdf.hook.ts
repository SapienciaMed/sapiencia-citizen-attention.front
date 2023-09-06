import { useEffect, useState } from "react";
import { typeSolicituds } from "../apis/api-pqrsdf";
import { typeDocument } from "../apis/api-pqrsdf";
import { typeEntidadJuridica } from "../apis/api-pqrsdf"
import { responseMedium } from "../apis/api-pqrsdf";
import { programs } from "../apis/api-pqrsdf";
import { asuntoSolicitud } from "../apis/api-pqrsdf";
import { paises } from "../apis/api-pqrsdf";
import { departamentos } from "../apis/api-pqrsdf";

export const useGetTypeSolicitud = ( ) => {

    const [ solicitudes, setSolicitudes ] = useState([]);

    useEffect( ()=> {
        typeSolicituds()
            .then( options => { setSolicitudes( options ) });      
    }, [] )
  
    return { solicitudes }

};

export const useGetTypeDocuments = ( ) => {

    const [ docuements, setDocuement ] = useState([]);

    useEffect( ()=> {
        typeDocument()
            .then( options => { setDocuement( options ) });      
    }, [] )
    
    return { docuements }

};

export const useGetTipoEntidadJuridica = ( ) => {

    const [ entidadJuridica, setEntidadJuridica ] = useState([]);

    useEffect( ()=> {
        typeEntidadJuridica()
            .then( options => { setEntidadJuridica( options ) });      
    }, [] )
    
    return { entidadJuridica }

};

export const useGetResponseMedium = ( ) => {

    const [ medium, setmedium ] = useState([]);

    useEffect( ()=> {
        responseMedium()
            .then( options => { setmedium( options ) });      
    }, [] )
    
    return { medium }

};


export const useGetPrograms = ( ) => {

    const [ program, setProgram ] = useState([]);

    useEffect( ()=> {
        programs()
            .then( options => { setProgram( options ) });      
    }, [] )
    
    return { program }

};

export const useGetAsuntoSolicitud = ( ) => {

    const [ asuntos, setAsuntos ] = useState([]);

    useEffect( ()=> {
        asuntoSolicitud()
            .then( options => { setAsuntos( options ) });      
    }, [] )
    
    return { asuntos }

};

export const useGetPaises = ( ) => {

    const [ pais, setPais ] = useState([]);

    useEffect( ()=> {
        paises()
            .then( options => { setPais( options ) });      
    }, [] )
    
    return { pais }

};

export const useGetDepartamentos = ( ) => {

    const [ departamento, setDepartamento ] = useState([]);

    useEffect( ()=> {
        departamentos()
            .then( options => { setDepartamento( options ) });      
    }, [] )
    
    return { departamento }

};