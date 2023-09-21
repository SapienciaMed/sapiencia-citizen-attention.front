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

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

  const onSubmit = async () => {
    setLoading(true);
    try {
      let payload = getValues() as { filingNumber: number; identification: number };
      const response = await pqrsdfService.getPqrsdfByIdentificationAndFilingNumber(
        payload?.identification,
        payload?.filingNumber
      );

      if (response.operation.code === EResponseCodes.OK) {
        setData([response.data]);
        resetForm(false);
        setShowTable(true);
      } else {
        confirmDialog({
          id: "messages",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Lo sentimos</div>
              <div className="flex items-center justify-center w-full mt-6 pt-0.5">No se encontraron resultados</div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          footer: (options) => (
            <div className="flex items-center justify-center gap-2 pb-2">
              <Button
                label="Aceptar"
                rounded
                className="!px-4 !py-2 !text-base !mr-0"
                disabled={loading}
                onClick={(e) => {
                  options.accept();
                }}
              />
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error al obtener la PQRSDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (clearResults: boolean = true) => {
    reset({ identification: "", filingNumber: "" }, { keepValues: false, keepErrors: false });
    if (clearResults) {
      setData([]);
      setShowTable(false);
    }
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
    return rowData?.answer && rowData?.answerDate ? "Cerrada" : "Abierta";
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
                  className="!py-2 !text-base !font-sans !text-black"
                  disabled={loading}
                  onClick={() => resetForm()}
                >
                  Limpiar campos
                </Button>
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
                <div className="overflow-auto max-w-[calc(100vw-4.6rem)] md:max-w-[calc(100vw-25.1rem)] hidden md:block borderless reverse-striped">
                  <DataTable
                    value={data}
                    showGridlines={false}
                    stripedRows={true}
                    emptyMessage={<span className="!font-sans">No se encontraron resultados</span>}
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
                    <div className="w-1/2 text-sm !font-sans text-right">{data[0]?.filingNumber}</div>
                    <div className="w-1/2 text-sm mt-4">Fecha radicado</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">
                      {dateBodyTemplate(data[0], { field: "createdAt" })}
                    </div>
                    <div className="w-1/2 text-sm mt-4">Programa</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0]?.dependency}</div>
                    <div className="w-1/2 text-sm mt-4">Clasificación</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0]?.clasification}</div>
                    <div className="w-1/2 text-sm mt-4">Asunto</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">
                      {data[0]?.requestSubject?.aso_asunto}
                    </div>
                    <div className="w-1/2 text-sm mt-4">Estado</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{statusTemplate(data[0])}</div>
                    <div className="w-1/2 text-sm mt-4">Fecha respuesta</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">
                      {dateBodyTemplate(data[0], { field: "answerDate" })}
                    </div>
                    <div className="w-1/2 text-sm mt-4">Respuesta</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right">{data[0]?.answer}</div>
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
