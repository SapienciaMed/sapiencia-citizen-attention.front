import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import React, { useRef, useState } from "react";
import { EResponseCodes } from "../constants/api.enum";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
function QueryPqrsdfPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identification, setDocument] = useState<number | null>(null);
  const [filingNumber, setFilingNumber] = useState<number | null>(null);
  const [identificationError, setDocumentError] = useState<string | null>(null);
  const [filingNumberError, setFilingNumberError] = useState<string | null>(null);

  const validateDocument = (value) => {
    if (value?.toString().length == 0) {
      setDocumentError("El campo es obligatorio.");
    } else {
      if (value?.toString().length < 4) {
        setDocumentError("Debe tener 4 caracteres.");
      } else {
        setDocumentError(null);
      }
    }
  };

  const validateFilingNumber = (value) => {
    if (value?.toString().length == 0) {
      setFilingNumberError("El campo es obligatorio.");
    } else {
      if (value?.toString().length < 4) {
        setFilingNumberError("Debe tener 4 caracteres.");
      } else {
        setFilingNumberError(null);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <ConfirmDialog id="messages"></ConfirmDialog>
      <span className="text-3xl block md:hidden pb-5">Consultar PQRSDF</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 md:!py-8 !px-6">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Consultar PQRSDF</span>
          </div>
          <div className="p-card-content">
            <div className="flex flex-wrap gap-x-6 w-full">
              <div className="flex flex-col gap-y-1.5 md:max-w-2xs w-full">
                <label htmlFor="identification" className="text-base">
                  Documento de identidad <span className="text-red-600">*</span>
                </label>
                <InputText
                  keyfilter="int"
                  id="identification"
                  inputMode="tel"
                  onBlur={(e) => validateDocument(e.target.value)}
                  className={(identificationError ? "p-invalid" : "") + " w-full py-2"}
                  value={identification ? identification?.toString() : null}
                  onChange={(e) => setDocument(e.target.value ? parseInt(e.target.value) : null)}
                  maxLength={4}
                />
              </div>
              <div className="flex flex-col gap-y-1.5 md:max-w-2xs w-full">
                <label htmlFor="filingNumber" className="text-base">
                  No. Radicado PQRSDF <span className="text-red-600">*</span>
                </label>
                <InputText
                  keyfilter="int"
                  id="filingNumber"
                  inputMode="tel"
                  onBlur={(e) => validateFilingNumber(e.target.value)}
                  className={(filingNumberError ? "p-invalid" : "") + " w-full py-2"}
                  value={filingNumber ? filingNumber?.toString() : null}
                  onChange={(e) => setFilingNumber(e.target.value ? parseInt(e.target.value) : null)}
                  maxLength={4}
                />
              </div>
              <div className="mt-auto mb-0 flex w-full gap-x-7">
                <Button
                  text
                  rounded
                  severity="secondary"
                  className="!px-8 !py-2 !text-base !text-black !border !border-primary"
                  label="Cancelar"
                  disabled={loading}
                  onClick={() => {
                    // resetForm();
                  }}
                />
                <Button
                  label="Guardar"
                  rounded
                  className="!px-8 !py-2 !text-base"
                  // onClick={save}
                  disabled={!filingNumber.toString().length || !identification.toString().length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryPqrsdfPage;
