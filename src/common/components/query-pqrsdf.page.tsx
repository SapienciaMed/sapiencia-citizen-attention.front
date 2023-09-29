import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EResponseCodes } from "../constants/api.enum";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook";
import { IPqrsdf } from "../interfaces/pqrsdf.interfaces";
import { Tooltip } from "primereact/tooltip";
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
        setShowTable(true);
      } else {
        setData([]);
        setShowTable(false);
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

  const resetForm = () => {
    reset({ identification: "", filingNumber: "" }, { keepValues: false, keepErrors: false });
    setData([]);
    setShowTable(false);
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
      <span>
        <Tooltip target=".tooltip-see-attached-dt" />
        <a
          href={rowData?.file?.name}
          target="_blank"
          className="hover:text-primary flex mx-auto items-center justify-center tooltip-see-attached-dt"
          data-pr-tooltip="Ver adjunto" data-pr-position="right"
        >
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.80246 22.0608C6.01067 22.0678 4.2831 21.394 2.96912 20.1758C2.32922 19.5841 1.81863 18.8665 1.46942 18.068C1.12021 17.2695 0.939941 16.4073 0.939941 15.5358C0.939941 14.6643 1.12021 13.8022 1.46942 13.0037C1.81863 12.2052 2.32922 11.4875 2.96912 10.8958L12.1041 2.26832C13.0436 1.41073 14.2698 0.935272 15.5418 0.935272C16.8139 0.935272 18.04 1.41073 18.9795 2.26832C19.4694 2.72306 19.8621 3.27222 20.1342 3.88274C20.4062 4.49326 20.5519 5.15252 20.5625 5.82082C20.5658 6.39837 20.4493 6.97033 20.2206 7.50065C19.9918 8.03097 19.6557 8.50814 19.2333 8.90207L10.0862 17.5417C9.53426 18.0538 8.80914 18.3384 8.05621 18.3384C7.30327 18.3384 6.57816 18.0538 6.02621 17.5417C5.75233 17.2893 5.53373 16.9829 5.38421 16.6418C5.23468 16.3008 5.15749 15.9324 5.15749 15.56C5.15749 15.1876 5.23468 14.8192 5.38421 14.4781C5.53373 14.137 5.75233 13.8307 6.02621 13.5783L14.4845 5.6154C14.6545 5.44569 14.8848 5.35037 15.125 5.35037C15.3651 5.35037 15.5955 5.44569 15.7654 5.6154C15.9351 5.78532 16.0304 6.01566 16.0304 6.25582C16.0304 6.49598 15.9351 6.72631 15.7654 6.89623L7.30704 14.8592C7.21217 14.9419 7.13613 15.0441 7.08402 15.1587C7.03192 15.2734 7.00496 15.3978 7.00496 15.5237C7.00496 15.6497 7.03192 15.7741 7.08402 15.8887C7.13613 16.0034 7.21217 16.1055 7.30704 16.1883C7.52591 16.3755 7.80445 16.4784 8.09246 16.4784C8.38047 16.4784 8.65901 16.3755 8.87787 16.1883L18.025 7.5729C18.2577 7.34482 18.4419 7.07203 18.5665 6.77094C18.6911 6.46984 18.7535 6.14666 18.75 5.82082C18.74 5.40084 18.6448 4.98726 18.4704 4.6051C18.2959 4.22294 18.0457 3.88016 17.735 3.59749C17.1385 3.04461 16.3551 2.73743 15.5418 2.73743C14.7285 2.73743 13.9452 3.04461 13.3487 3.59749L4.24996 12.2129C3.78918 12.6351 3.42126 13.1486 3.16956 13.7206C2.91785 14.2927 2.78787 14.9108 2.78787 15.5358C2.78787 16.1608 2.91785 16.7789 3.16956 17.351C3.42126 17.923 3.78918 18.4365 4.24996 18.8587C5.23416 19.7761 6.52954 20.2861 7.87496 20.2861C9.22037 20.2861 10.5158 19.7761 11.5 18.8587L20.5504 10.2917C20.6337 10.2062 20.7333 10.1382 20.8433 10.0918C20.9533 10.0454 21.0714 10.0215 21.1908 10.0215C21.3102 10.0215 21.4283 10.0454 21.5383 10.0918C21.6483 10.1382 21.7479 10.2062 21.8312 10.2917C22.0009 10.4616 22.0962 10.6919 22.0962 10.9321C22.0962 11.1722 22.0009 11.4026 21.8312 11.5725L12.7083 20.1758C11.3767 21.4124 9.61944 22.0876 7.80246 22.0608Z"
              fill="#533893"
            />
          </svg>
        </a>
      </span>
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
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
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
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
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
                  type="button"
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
                      header="Acción"
                      body={fileBodyTemplate}
                    ></Column>
                  </DataTable>
                </div>
                <div className="p-5 p-card md:hidden block relative rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
                  <div className="flex flex-wrap pb-5 items-start justify-between">
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
                    <div className="w-1/2 text-sm mt-4">Acción</div>
                    <div className="w-1/2 text-sm mt-4 !font-sans text-right flex items-end justify-end">
                      <Tooltip target=".tooltip-see-attached" />
                      <a
                        href={data[0]?.file?.name}
                        target="_blank"
                        className="flex tooltip-see-attached"
                        data-pr-tooltip="Ver adjunto"
                        data-pr-position="left"
                      >
                        <svg
                          className="mx-auto"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.82244 16.1475C4.52493 16.1525 3.27393 15.6646 2.32244 14.7825C1.85906 14.354 1.48932 13.8343 1.23644 13.2561C0.983567 12.6779 0.853027 12.0536 0.853027 11.4225C0.853027 10.7914 0.983567 10.1671 1.23644 9.58885C1.48932 9.01062 1.85906 8.49094 2.32244 8.06248L8.93744 1.81498C9.61777 1.19397 10.5057 0.84967 11.4268 0.84967C12.348 0.84967 13.2358 1.19397 13.9162 1.81498C14.2709 2.14428 14.5553 2.54195 14.7523 2.98405C14.9493 3.42615 15.0548 3.90354 15.0624 4.38748C15.0648 4.8057 14.9805 5.21989 14.8149 5.60391C14.6492 5.98793 14.4058 6.33347 14.0999 6.61873L7.47619 12.875C7.0765 13.2458 6.55142 13.4519 6.00619 13.4519C5.46096 13.4519 4.93587 13.2458 4.53619 12.875C4.33786 12.6922 4.17956 12.4704 4.07129 12.2234C3.96301 11.9764 3.90711 11.7097 3.90711 11.44C3.90711 11.1703 3.96301 10.9036 4.07129 10.6566C4.17956 10.4096 4.33786 10.1877 4.53619 10.005L10.6612 4.23873C10.7842 4.11584 10.951 4.04681 11.1249 4.04681C11.2988 4.04681 11.4656 4.11584 11.5887 4.23873C11.7116 4.36178 11.7806 4.52857 11.7806 4.70248C11.7806 4.87639 11.7116 5.04318 11.5887 5.16623L5.46369 10.9325C5.39499 10.9924 5.33992 11.0664 5.30219 11.1494C5.26446 11.2324 5.24494 11.3225 5.24494 11.4137C5.24494 11.5049 5.26446 11.595 5.30219 11.678C5.33992 11.7611 5.39499 11.835 5.46369 11.895C5.62218 12.0305 5.82388 12.105 6.03244 12.105C6.24099 12.105 6.44269 12.0305 6.60119 11.895L13.2249 5.65623C13.3935 5.49107 13.5268 5.29353 13.6171 5.0755C13.7073 4.85746 13.7525 4.62343 13.7499 4.38748C13.7427 4.08336 13.6738 3.78387 13.5475 3.50713C13.4211 3.2304 13.24 2.98217 13.0149 2.77748C12.583 2.37712 12.0158 2.15468 11.4268 2.15468C10.8379 2.15468 10.2706 2.37712 9.83869 2.77748L3.24994 9.01623C2.91627 9.32199 2.64984 9.6938 2.46758 10.108C2.28531 10.5223 2.19119 10.9699 2.19119 11.4225C2.19119 11.875 2.28531 12.3227 2.46758 12.7369C2.64984 13.1512 2.91627 13.523 3.24994 13.8287C3.96263 14.493 4.90067 14.8624 5.87494 14.8624C6.8492 14.8624 7.78724 14.493 8.49994 13.8287L15.0537 7.62498C15.114 7.56307 15.1861 7.51386 15.2658 7.48026C15.3454 7.44667 15.431 7.42936 15.5174 7.42936C15.6039 7.42936 15.6894 7.44667 15.7691 7.48026C15.8487 7.51386 15.9209 7.56307 15.9812 7.62498C16.1041 7.74803 16.1731 7.91482 16.1731 8.08873C16.1731 8.26264 16.1041 8.42943 15.9812 8.55248L9.37494 14.7825C8.41069 15.6779 7.13818 16.1669 5.82244 16.1475Z"
                            fill="#533893"
                          />
                        </svg>
                      </a>
                    </div>
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
