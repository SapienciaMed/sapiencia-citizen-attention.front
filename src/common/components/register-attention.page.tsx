import React, { useEffect, useRef, useState } from "react";
import { Card } from 'primereact/card';



const RegisterAttention = () => {
    const parentForm = useRef(null);
    const [buttonWidth, setButtonWidth] = useState({
        width: 0,
        left: 0,
      });
    
    const handleResize = () => {
        if (parentForm.current?.offsetWidth) {
          let style = getComputedStyle(parentForm.current);
          let domReact = parentForm.current.getBoundingClientRect();
    
          setButtonWidth({
            width: parentForm?.current.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight),
            left: domReact.x - parseInt(style.marginLeft),
          });
        }
      };
      useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>

        <span className="text-3xl block md:hidden pb-5">Registro de atención</span>
        <div className="p-card p-4 rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
          <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
            <div className="p-card-body !py-6 md:!py-8 !px-6">
              <div className="p-card-title m-auto flex justify-end md:justify-between">
                <span className="text-3xl md:block hidden">Registro de atención</span>
                <div className="my-auto text-base flex flex-column items-center gap-x-2">
                  <span>Registro diario de atenciones</span>
                  <label htmlFor="">Numero</label>
                  <input type="text" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
            <div className="p-card-body !py-6 md:!py-8 !px-6">
              <div className="p-card-title m-auto flex justify-end md:justify-between">
                <p className="">Registro de atención</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
}

export default RegisterAttention;
