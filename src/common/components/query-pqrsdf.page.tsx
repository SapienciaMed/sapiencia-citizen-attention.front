import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EResponseCodes } from "../constants/api.enum";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { IPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook";
function QueryPqrsdfPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPqrsdf[]>();

  const pqrsdfService = usePqrsdfService();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ mode: "all" });

  const onSubmit = async () => {
    setLoading(true);
    try {
      let payload = getValues() as { filingNumber: number; identification: number };
      const response = await pqrsdfService.getPqrsdfByIdentificationAndFilingNumber(
        payload.identification,
        payload.filingNumber
      );

      if (response.operation.code === EResponseCodes.OK) {
        setData([response.data]);
        resetForm();
      }
    } catch (error) {
      console.error("Error al obtener la PQRSDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset({ identification: "", filingNumber: "" }, { keepValues: false, keepErrors: false });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <ConfirmDialog id="messages"></ConfirmDialog>
      <span className="text-3xl block md:hidden pb-5">Consultar PQRSDF</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 md:!py-8 !pr-6 !pl-6 md:!pr-16 md:!pl-7">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Consultar PQRSDF</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-6 w-full">
              <Controller
                name="identification"
                control={control}
                rules={{
                  required: "Campo obligatorio.",
                  maxLength: { value: 15, message: "No debe tener más de 15 caracteres." },
                }}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-y-1.5 md:max-w-2xs w-full">
                    <label htmlFor={field.name} className="text-base">
                      Identificationo de identidad <span className="text-red-600">*</span>
                    </label>
                    <InputText
                      keyfilter="int"
                      id={field.name}
                      value={field.value}
                      inputMode="tel"
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2")}
                      onChange={(e) => field.onChange(e.target.value)}
                      maxLength={15}
                    />
                    {getFormErrorMessage(field.name)}
                  </div>
                )}
              />
              <Controller
                name="filingNumber"
                control={control}
                rules={{
                  required: "Campo obligatorio.",
                  maxLength: { value: 12, message: "No debe tener más de 12 caracteres." },
                }}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-y-1.5 md:max-w-2xs w-full">
                    <label htmlFor={field.name} className="text-base">
                      No. Radicado PQRSDF <span className="text-red-600">*</span>
                    </label>
                    <InputText
                      keyfilter="alphanum"
                      id={field.name}
                      value={field.value}
                      inputMode="tel"
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2")}
                      onChange={(e) => field.onChange(e.target.value)}
                      maxLength={12}
                    />
                    {getFormErrorMessage(field.name)}
                  </div>
                )}
              />
              <div className="md:mt-8 flex w-full gap-x-3 justify-end">
                <Button
                  text
                  rounded
                  severity="secondary"
                  className="!py-2 !text-base !text-black"
                  label="Limpiar campos"
                  disabled={loading}
                  onClick={() => resetForm()}
                />
                <Button
                  label="Buscar"
                  rounded
                  className="!px-4 !py-2 !text-base"
                  type="submit"
                  // onClick={save}
                  disabled={!isValid}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryPqrsdfPage;
