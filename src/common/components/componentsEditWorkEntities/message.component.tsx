import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react";

interface Props {
    headerMsg: string;
    msg:string;
    twoBtn: boolean;
    nameBtn1: string;
    nameBtn2?: string;
    onClickBt1?:(...event: any[]) => void;
    onClickBt2?:(...event: any[]) => void;  
}

export const MessageComponent = (props:Props) => {

    const [ visibleMsg, setVisibleMsg] = useState(false);

    const { headerMsg, msg, onClickBt1, onClickBt2, twoBtn, nameBtn1, nameBtn2 } = props

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
            <div className="flex justify-center mt-8">
              {twoBtn?(<>
                <Button
                  text
                  className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                  onClick={onClickBt2}
                  >{nameBtn2}</Button>
              </>):(<></>)}
                <Button 
                  onClick={onClickBt1} 
                  className="rounded-full !h-10">{nameBtn1}</Button>
            </div>
          </Dialog>
        </div>
    </>
  )
}
