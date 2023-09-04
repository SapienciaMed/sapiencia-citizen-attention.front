import { useState } from 'react';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

interface Value {
  value?: boolean | undefined | null;
} 

export const TriStateCheckboxComponent = () => {
  
    const [value, setValue] = useState(null);  
    
    const handleChange = (e:Value)=> {
      setValue( e.value = true );
      
      if ( value ) {
        setValue(null)
        
      }
    }

  return (

    <div>
        <TriStateCheckbox 
          value={value}
          onChange={handleChange} 
          style={{ marginRight:'6px'}}
        />
        <label>Acepto</label>
    </div>

  )
}
