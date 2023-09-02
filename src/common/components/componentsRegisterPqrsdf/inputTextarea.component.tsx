
import { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
        
export const CnputTextareaComponent = () => {
    
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
            />
            <p>Max 5000 caracteres</p>
        </div>


        </>
  )
}
