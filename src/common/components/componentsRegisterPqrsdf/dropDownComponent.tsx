import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { RefCallBack } from 'react-hook-form';

interface Attributes {
  placeholder: string;
  width: string;
  value: string;
  id:string;
  className:  string | undefined;
  focusInputRef: RefCallBack;
  onChange:(...event: any[]) => void;
}


const styles = {
  height:'41px',
  borderRadius:'8px', 
  display:'flex', 
  alignItems:'center',
  width:''
}


export const DropDownComponent = ( props:Attributes ) => {

  const { width, placeholder,id,className,focusInputRef, value, onChange } = props;
  styles.width = width;  

    const [ data, setData] = useState(null);

    const seletData = ( datos )=>{
        setData( datos.value )
        
    }

    const cities = [
        { name: 'New York' },
        { name: 'Rome' },
    ];
  return (
    <Dropdown  
    value={value}
    onChange={onChange}
    options={cities} 
    optionLabel="name" 
    style={ styles }
    placeholder={ placeholder }
    id={ id }
    className={ className }
    focusInputRef={focusInputRef}
  />
  )
}
