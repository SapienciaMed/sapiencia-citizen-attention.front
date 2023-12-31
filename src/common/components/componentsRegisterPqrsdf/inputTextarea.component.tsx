
import { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';


interface Attributes {
    value: string;
    id?:string;
    className?:  string | undefined;
    onChange?:(...event: any[]) => void;
}

        
export const CnputTextareaComponent = ( props:Attributes) => {
    
    const { id, className, onChange, value } = props;


    return (
        <>
        <div className='input-textarea'>
            <InputTextarea 
                value={value} 
                onChange={onChange } 
                rows={5} 
                cols={100}
                placeholder='Escribe aquí'
                style={{borderRadius:'8px'}}
                id={ id }
                className={ className } 
            />
            <p>Max 5000 caracteres</p>
        </div>


        </>
  )
}
