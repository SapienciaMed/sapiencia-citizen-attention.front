import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
    
export const CalendarComponent = () => {

    const [date, setDate] = useState(null);

    return (
       
        <Calendar 
            value={date} 
            onChange={(e) => setDate(e.value)} 
            showIcon
        /> 
    
    )
}
