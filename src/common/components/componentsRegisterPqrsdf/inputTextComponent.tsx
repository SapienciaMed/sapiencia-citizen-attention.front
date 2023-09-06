import { RefCallBack } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";


interface Attributes {
    placeholder: string;
    disabled ? : boolean;
    keyfilter ? : KeyFilterType;
    width: string;
    value?: string;
    id?:string;
    className?:  string | undefined;
    onChange?:(...event: any[]) => void;
}

const styles = {
    height:'41px',
    borderRadius:'8px', 
    display:'flex', 
    alignItems:'center',
    width:''
}
  


export const InputTextComponent = ( props:Attributes ) => {
    
    const { 
        placeholder, 
        width, disabled, 
        keyfilter, 
        value, 
        id, 
        className,
        onChange
      } = props;

    styles.width = width;

    return (

    <InputText 
        keyfilter={ keyfilter } 
        placeholder={ placeholder }
        style={ styles }
        disabled={disabled}
        value={ value }
        id={ id }
        className={ className }
        onChange={ onChange } 
    />

  )
}
