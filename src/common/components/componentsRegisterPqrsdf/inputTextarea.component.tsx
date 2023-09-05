
import { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

interface Attributes {
    id?:string;
    className?:  string | undefined;
}
        
export const CnputTextareaComponent = ( props:Attributes) => {
    
    const { id, className } = props;

    const [value, setValue] = useState('');

    return (
        <>
        <div className='input-textarea'>
            <InputTextarea 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
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
