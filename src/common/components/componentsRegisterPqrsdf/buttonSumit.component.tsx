import { Button } from 'primereact/button';

interface Butonsumit {
    label: string;
}

export const ButtonSumitComponent = ( props:Butonsumit ) => {

    const { label } = props

    return (
        <Button 
            label={label}
            className='button-sumit'
            type='submit' 
        />
    )
}
