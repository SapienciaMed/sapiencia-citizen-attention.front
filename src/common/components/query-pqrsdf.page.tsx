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
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
function QueryPqrsdfPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPqrsdf[]>([]);
  const [showTable, setShowTable] = useState(false);

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
      setShowTable(true);
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

  const dateBodyTemplate = (rowData, field) => {
    if (!rowData?.[field.field]) {
      return rowData?.[field.field];
    } else {
      let date = typeof rowData?.[field.field] == "string" ? new Date(rowData?.[field.field]) : rowData?.[field.field];
      return date?.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const fileBodyTemplate = (rowData) => {
    return (
      <a href={rowData?.file?.name} className="hover:text-primary">
        {rowData?.file?.name.split("/").pop()}
      </a>
    );
  };

  const statusTemplate = (rowData: IPqrsdf) => {
    return rowData.answer && rowData.answerDate ? "Cerrada" : "Abierta";
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
                      Documento de identidad <span className="text-red-600">*</span>
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
                  disabled={!isValid || loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      {showTable && (
        <div className="relative pb-16 md:pb-28 z-0">
          <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
            <div className="p-card-body !pt-3 !px-3 md:!pt-8 md:!pb-3 md:!px-6">
              <div className="p-card-title justify-between flex">
                <span className="text-xl md:text-3xl">Resultados de búsqueda</span>
                <span></span>
              </div>
              <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
                <div className="overflow-auto max-w-[calc(100vw-4.6rem)] md:max-w-[calc(100vw-25.1rem)] hidden md:block">
                  <DataTable
                    value={data}
                    emptyMessage="No se encontraron resultados"
                    tableStyle={{ minWidth: "22.625rem", marginBottom: "6.063rem" }}
                  >
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="filingNumber"
                      field="filingNumber"
                      header="No. PQRSDF"
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="createdAt"
                      field="createdAt"
                      header="Fecha radicado"
                      dataType="date"
                      body={dateBodyTemplate}
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="dependency"
                      field="dependency"
                      header="Programa"
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="clasification"
                      field="clasification"
                      header="Clasificación"
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="requestSubject"
                      field="requestSubject.aso_asunto"
                      header="Asunto"
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="status"
                      header="Estado"
                      body={statusTemplate}
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="answerDate"
                      field="answerDate"
                      header="Fecha respuesta"
                      dataType="date"
                      body={dateBodyTemplate}
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="answer"
                      field="answer"
                      header="Respuesta"
                    ></Column>
                    <Column
                      bodyClassName="text-base !font-sans text-center"
                      headerClassName="text-base font-medium !text-black text-center"
                      key="file"
                      field="file.name"
                      header="Ver adjunto"
                      body={fileBodyTemplate}
                    ></Column>
                  </DataTable>
                </div>
                <div className="p-5 p-card md:hidden block relative rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
                  <div className="flex flex-wrap pb-5">
                    <div className="w-1/2 text-sm">No. PQRSDF</div>
                    <div className="w-1/2 text-sm !font-sans text-right">{data[0].filingNumber}</div>
                    <div className="w-1/2 text-sm mt-4">Fecha radicado</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{dateBodyTemplate(data[0], { field: "createdAt" })}</div>
                    <div className="w-1/2 text-sm mt-4">Programa</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0].dependency}</div>
                    <div className="w-1/2 text-sm mt-4">Clasificación</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0].clasification}</div>
                    <div className="w-1/2 text-sm mt-4">Asunto</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0].requestSubject.aso_asunto}</div>
                    <div className="w-1/2 text-sm mt-4">Estado</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{statusTemplate(data[0])}</div>
                    <div className="w-1/2 text-sm mt-4">Fecha respuesta</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{dateBodyTemplate(data[0], { field: "answerDate" })}</div>
                    <div className="w-1/2 text-sm mt-4">Respuesta</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0].answer}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryPqrsdfPage;
