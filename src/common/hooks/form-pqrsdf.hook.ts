import { useEffect, useState } from "react";

import { paises } from "../apis/api-pqrsdf";
import { departamentos } from "../apis/api-pqrsdf";
import { municipios } from "../apis/api-pqrsdf";



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

export const useGetMunicipios = ( id:string ) => {

    const [ municipio, setDepartamento ] = useState([]);

    useEffect( ()=> {
        municipios( id )
            .then( options => { setDepartamento( options ) });      
    }, [] )
    
    return { municipio }

};
