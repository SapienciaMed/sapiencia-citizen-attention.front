import { Button } from 'primereact/button';

interface Butonsumit {
    label: string;
    disabled: boolean;

}

export const ButtonSumitComponent = ( props:Butonsumit ) => {

    const { label, disabled } = props

    return (
        <Button 
            label={label}
            className='button-sumit'
            type='submit'
            disabled={ disabled }
        />
    )
}
