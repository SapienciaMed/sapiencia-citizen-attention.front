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
        <>
        <span className="p-input-icon-right">
            <Calendar 
                inputId={ inputId }
                value={ value }
                className={ className } 
                onChange={ onChange }
                dateFormat={ dateFormat } 
                style={{width:'100%'}}
                maxDate={maxDate}
                placeholder='DD / MM / AAA'  
            />
                  <svg width="19" height="19" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.6667 1.3335V4.00016M5.33333 1.3335V4.00016M2 6.00016H14M12.6667 2.66683H3.33333C2.59667 2.66683 2 3.2635 2 4.00016V12.6668C2 13.4035 2.59667 14.0002 3.33333 14.0002H12.6667C13.4033 14.0002 14 13.4035 14 12.6668V4.00016C14 3.2635 13.4033 2.66683 12.6667 2.66683ZM4.67533 8.48616C4.58333 8.48616 4.50867 8.56083 4.50933 8.65283C4.50933 8.74483 4.584 8.8195 4.676 8.8195C4.768 8.8195 4.84267 8.74483 4.84267 8.65283C4.84267 8.56083 4.768 8.48616 4.67533 8.48616ZM8.00867 8.48616C7.91667 8.48616 7.842 8.56083 7.84267 8.65283C7.84267 8.74483 7.91733 8.8195 8.00933 8.8195C8.10133 8.8195 8.176 8.74483 8.176 8.65283C8.176 8.56083 8.10133 8.48616 8.00867 8.48616ZM11.342 8.48616C11.25 8.48616 11.1753 8.56083 11.176 8.65283C11.176 8.74483 11.2507 8.8195 11.3427 8.8195C11.4347 8.8195 11.5093 8.74483 11.5093 8.65283C11.5093 8.56083 11.4347 8.48616 11.342 8.48616ZM4.67533 11.1528C4.58333 11.1528 4.50867 11.2275 4.50933 11.3195C4.50933 11.4115 4.584 11.4862 4.676 11.4862C4.768 11.4862 4.84267 11.4115 4.84267 11.3195C4.84267 11.2275 4.768 11.1528 4.67533 11.1528ZM8.00867 11.1528C7.91667 11.1528 7.842 11.2275 7.84267 11.3195C7.84267 11.4115 7.91733 11.4862 8.00933 11.4862C8.10133 11.4862 8.176 11.4115 8.176 11.3195C8.176 11.2275 8.10133 11.1528 8.00867 11.1528Z"
              stroke="#533893"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        </>
    )
}
