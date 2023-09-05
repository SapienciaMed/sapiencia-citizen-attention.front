import { RefCallBack } from 'react-hook-form';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

interface Attributes {
  value: null | boolean | undefined ;
  id:string;
  className:  string | undefined;
  onChange:(...event: any[]) => void;
}



export const TriStateCheckboxComponent = ( props: Attributes ) => {
  
  const { id, value, onChange, className } = props;


  return (

    <div>
        <TriStateCheckbox 
          id={ id }
          value={ value }
          onChange={ onChange }
          className={ className }
        />
        <label style={{ marginLeft:'4px'}}>Acepto</label>
    </div>

  )
}
