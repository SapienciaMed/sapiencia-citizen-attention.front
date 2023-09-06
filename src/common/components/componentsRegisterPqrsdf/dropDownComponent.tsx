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
  options?:object[]
}


const styles = {
  height:'41px',
  borderRadius:'8px', 
  display:'flex', 
  alignItems:'center',
  width:''
}


export const DropDownComponent = ( props:Attributes ) => {

  const { width, placeholder,id,className,focusInputRef, value, onChange, options } = props;
  styles.width = width;  

  return (
    <Dropdown  
    value={value}
    onChange={onChange}
    options={ options } 
    optionLabel="description" 
    style={ styles }
    placeholder={ placeholder }
    id={ id }
    className={ className }
    focusInputRef={focusInputRef}
  />
  )
}
