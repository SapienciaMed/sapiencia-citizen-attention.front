import { useState } from 'react';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

export const TriStateCheckboxComponent = () => {

    const [value, setValue] = useState(null);

  return (

    <div>
        <TriStateCheckbox value={value} onChange={(e) => setValue(e.value)} style={{ marginRight:'6px'}} />
        <label>{String(value)}</label>
    </div>

  )
}
