import { useEffect, useState } from "react";
import { typeSolicituds } from "../apis/api-pqrsdf";

export const useTypeSolicitudes = () => {

    const [ options, setOptions ] = useState([]);

    useEffect( ()=> {
        typeSolicituds()
            .then( typos => { setOptions( typos ) });      
    }, [] )
  
    return { options }

}