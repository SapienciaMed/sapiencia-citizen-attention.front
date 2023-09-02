import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

interface Attributes {
  placeholder: string;
  width: string;
}

const styles = {
  height:'41px',
  borderRadius:'8px', 
  display:'flex', 
  alignItems:'center',
  width:''
}


export const DropDownComponent = ( props:Attributes ) => {

  const { placeholder, width } = props;
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
    value={data} 
    onChange={seletData} 
    options={cities} 
    optionLabel="name" 
    placeholder={placeholder}
    style={ styles }
  />
  )
}
