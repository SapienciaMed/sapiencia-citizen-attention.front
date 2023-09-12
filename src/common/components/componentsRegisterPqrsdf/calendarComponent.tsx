import { Calendar } from 'primereact/calendar';

interface Attributes {
    value: string;
    inputId:string;
    dateFormat:string;
    className:  string | undefined;
    onChange:(...event: any[]) => void;
}
    
export const CalendarComponent = ( props:Attributes ) => {

    const { value, inputId, className, onChange, dateFormat } = props

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let nextMonth = month === 11 ? 0 : month ;
    let nextYear = nextMonth === 0 ? year + 1 : year;

    let maxDate = new Date();

    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);

    return (
        <Calendar 
            inputId={ inputId }
            value={ value }
            className={ className } 
            onChange={ onChange }
            dateFormat={ dateFormat } 
            style={{width:'100%'}}
            showIcon
            maxDate={maxDate}
        />
    )
}
