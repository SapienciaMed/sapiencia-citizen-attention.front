import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";

interface Attributes {
    placeholder: string;
    disabled ? : boolean;
    keyfilter ? : KeyFilterType;
    width: string;
}

const styles = {
    height:'41px',
    borderRadius:'8px', 
    display:'flex', 
    alignItems:'center',
    width:''
}
  


export const InputTextComponent = ( props:Attributes ) => {
    
    const { placeholder, width, disabled, keyfilter } = props;
    styles.width = width;

    return (

    <InputText 
        keyfilter={ keyfilter } 
        placeholder={ placeholder }
        style={ styles }
        disabled={disabled} 
    />

  )
}
