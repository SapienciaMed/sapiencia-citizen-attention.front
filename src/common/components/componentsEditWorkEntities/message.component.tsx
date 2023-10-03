import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react";

interface Props {
    headerMsg: string
    msg:string, 
}

export const MessageComponent = (props:Props) => {

    const [ visibleMsg, setVisibleMsg] = useState(null);

    const { headerMsg, msg } = props

    useEffect(()=>{
        setVisibleMsg(true)
    },[])

  return (
    <>
        <div className=" flex justify-content-center">
          <Dialog
            header={`!${headerMsg}¡`}
            className="p-dialog-titlebar-icon"
            visible={visibleMsg}
            onHide={() => setVisibleMsg(false)}
            pt={{
              root: { className: "text-center" },
              header: { style: { color: "#5e3893", fontSize:'1.8rem' }, className:'text-3xl' },
              closeButton: { style: { color: "#5e3893", display: "none" } },
            }}
          >
            <p className="m-0 textMsg">{msg}</p>
            <Button className='mt-8' style={{backgroundColor:'533893'}} onClick={() => setVisibleMsg(false) }  rounded>Cerrar</Button>
          </Dialog>
        </div>
    </>
  )
}
