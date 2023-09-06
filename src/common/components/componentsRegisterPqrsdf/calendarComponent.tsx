import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

interface Attributes {
    value: string;
    inputId:string;
    dateFormat:string;
    className:  string | undefined;
    onChange:(...event: any[]) => void;
}
    
export const CalendarComponent = ( props:Attributes ) => {

    const { value, inputId, className, onChange, dateFormat } = props

    return (
       
        <Calendar 
            inputId={ inputId }
            value={ value }
            className={ className } 
            onChange={ onChange }
            dateFormat={ dateFormat } 
            showIcon
        /> 
    
    )
}
