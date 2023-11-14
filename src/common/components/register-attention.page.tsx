import React, { useEffect, useRef, useState, Suspense } from "react";
import { Card } from 'primereact/card';
import { Controller, useForm } from "react-hook-form";
import { DropDownComponent } from "./componentsRegisterPqrsdf/dropDownComponent";
import { classNames } from "primereact/utils";



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

  const defaultValues = {
      canalAtencion: "",
      elijaCanalAtencion: "",
      tipoDocumento: "",
      numeroDocumento: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      correoElectronico: "",
      noContacto1: "",
      noContacto2: "",
      strato: "",
      tipoSolicitud: "",
      dependencia: "",
      programa: "",
      temaSolicitud: null,
      comunasYCorregimientos: null,
      grupoValor: "",
      tipoUsuario: "",
      Observacion: "",
    };      

  const {
      control,
      formState: { errors, isValid, dirtyFields },
      handleSubmit,
      getFieldState,
      setValue,
      reset,
      resetField,
      getValues,
      watch,
      register,
    } = useForm({ defaultValues, mode: "all" });
  
  const [canalAtencion, setcanalAtencion] = useState(null);
  const [elijaCanalAtencion, setelijaCanalAtencion] = useState(null);

  const getFormErrorMessage = (name) => {
      return errors[name] ? (
        <small className="p-error">{errors[name].message}</small>
      ) : (
        <small className="p-error">&nbsp;</small>
      );
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
                {/* <div>
                <label htmlFor="">Numero</label>
                <input type="text" />

                </div> */}
              </div>
            </div>
          </div>
        </div>

        <Card className='zise-card box1 mt-4 md:rounded-4xl shadow-none border border-[#D9D9D9]'>
                <div className='box-mobil'>
                  <div>
                    <p className='text-sm'>BASE DE DATOS - CANAL TELEFÓNICO - PRESENCIAL - VIRTUAL
El objetivo de este formulario es recopilar cada una de las llamadas, visitas o atenciones virtuales que ingresan a La Agencia de Educación Postsecundaria de Medellín - Sapiencia.</p>
                    <div className="div-container flex m-auto width-50 div-movil-100 mt-4">
                      <div className="row-1 width-50">
                        <label className="font-label">
                          Canal de atención<span className="required">*</span>
                        </label>
                        <Controller
                          name="canalAtencion"
                          control={control}
                          rules={{ required: "Campo obligatorio." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Suspense fallback={<div>Cargando...</div>}>
                                <DropDownComponent
                                  id={field.name}
                                  value={canalAtencion}
                                  className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                                  onChange={(e) =>
                                    field.onChange(() => {
                                      // selectProgram(e.value);
                                      setValue("canalAtencion", e.value);
                                    })
                                  }
                                  focusInputRef={field.ref}
                                  // optionLabel="PRG_DESCRIPCION"
                                  // options={optionPrograma.data}
                                  placeholder="Seleccionar"
                                  width="100%"
                                />
                              </Suspense>
                            </>
                          )}
                        />
                        {getFormErrorMessage("canalAtencion")}
                      </div>

                      <div className="row-1 width-50">
                        <label className="font-label">
                          Elija ¿Cuál?<span className="required">*</span>
                        </label>
                        <Controller
                          name="elijaCanalAtencion"
                          control={control}
                          rules={{ required: "Campo obligatorio." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Suspense fallback={<div>Cargando...</div>}>
                                <DropDownComponent
                                  id={field.name}
                                  value={elijaCanalAtencion}
                                  className={classNames({ "p-invalid": fieldState.error }, "!h-10")}
                                  onChange={(e) =>
                                    field.onChange(() => {
                                      // selectRequestSubject(e.value);
                                      setValue("elijaCanalAtencion", e.value);
                                    })
                                  }
                                  focusInputRef={field.ref}
                                  // optionLabel="ASO_ASUNTO"
                                  // options={optionAsuntoSolicitud.data}
                                  placeholder="Seleccionar"
                                  width="100%"
                                />
                              </Suspense>
                            </>
                          )}
                        />
                        {getFormErrorMessage("elijaCanalAtencion")}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

      </div>
    </div>
  )
}

export default RegisterAttention;
