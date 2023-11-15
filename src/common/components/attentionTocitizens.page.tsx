import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useEffect, useReducer, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "../../styles/attentionCitizens-styles.scss";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook"
import { TableGenericComponent } from "./genericComponent/table.component";
import { mastersTablesServices } from "../hooks/masterTables.hook";

import { IPersonFilters } from "../interfaces/person.interfaces";
import { ItypeDocument } from "../interfaces/mastersTables.interface";
import { MessageComponent } from "./componentsEditWorkEntities/message.component";
import { useNavigate } from "react-router-dom";
import useBreadCrumb from "../../common/hooks/bread-crumb.hook";

interface User {
  identification: string;
  names: string;
  lastName: string;
  email: string;
  noContact1: string;
  noContact2: string;
  userId: string;
}

interface Payload {
  email: "";
  identification: "";
  lastNames: "";
  names: "";
  contactNumber: "";
  documentTypeId?;
}

const AttentionTocitizens = () => {
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState<object[]>([]);
  const [selectDocumentType, setSelectDocumentType] = useState(null);
  const [documentType, setDocumentType] = useState<ItypeDocument[]>([]);
  const [loadbuton, setLoadbuton] = useState(false);

  const navigate = useNavigate();
  const statusButton = useRef(true)

  const pqrsdfService = usePqrsdfService();
  const masterTablesServices = mastersTablesServices();

  const defaultValues = {
    typeDocument: "",
    identification: "",
    names: "",
    lastNames: "",
    email: "",
    noContact: "",
  };

  const {
    formState: { errors, isValid },
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm({ defaultValues, mode: "all" });
  
  useBreadCrumb({
    isPrimaryPage: false,
    name: "Radicar PQRDSF",
    url: "atencion-ciudadana/atencion-ciudadania-radicar-pqrsdf",
  });  

  const resetForm = () => {
    setLoad(false), 
    reset();
    setLoadbuton(false)
    setUser([]);
    setSelectDocumentType(null)
    statusButton.current = true;
  };
  
 useEffect(()=>{
  if (
    watch("names").length > 0 ||
    watch("identification").length > 0 ||
    watch("lastNames").length > 0 ||
    watch("email").length > 0 ||
    selectDocumentType !== null ||
    watch("noContact").length > 0
  ) {
    setLoadbuton(false)
  }else{
    setLoadbuton(true)
    setUser([]); 
  } 

 },[ watch("names"), watch("identification"),watch("lastNames"),watch("email"),selectDocumentType,watch("noContact")])



  const getDocumentType = async ()=>{
    const docuementsTypes = await masterTablesServices.getDocuemntType()
    return docuementsTypes
  }

  useEffect(()=>{
    getDocumentType().then(({data})=>{ setDocumentType(data) });
  },[])

  const onSubmit = async (filter: Payload) => {
    setLoadbuton(true)
    try {
      const { email, identification, lastNames, names, documentTypeId, contactNumber } = filter;

      const payload: IPersonFilters = {
        email,
        surname: lastNames,
        name: names,
        identification,
        documentTypeId: selectDocumentType,
        contactNumber,
      };

      const response = await pqrsdfService.getPeopleByFilters(payload)
      const { data, operation } = response;
      const { array } = data;
      
      if (operation.code !== "OK") {
        setLoad(true);
        return;
      }
  
      const usersData = array.map((user) => {
        return {
          identification: `${user['identification']}`,
          names: `${user['firstName']} ${user['firstSurname']}`,
          lastName: user['secondName'],
          email: user['email'],
          noContact1: user['firstContactNumber'],
          noContact2: user['secondContactNumber'],
          userId: user['id'],
        };
      })
      setLoad(false);
      
      setUser(usersData);
    } catch (error) {}
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <>
      <div className="p-8 flex justify-center">
        <Card className="card-container">
          <Card title="Radicar PQRDSF" className="card-container-body mb-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: "8px" }}>
                <label className="text-xl">Buscar por</label>
              </div>

              <div className="flex flex-row container-movil">
                <div className="flex flex-row mr-4 col-1 col-100">
                  <div className="mr-2 col-100">
                    <label className="font-label">Tipo</label>
                    <br />
                    <Controller
                      name="typeDocument"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={selectDocumentType}
                            options={documentType}
                            onChange={(e) => setSelectDocumentType(e.value)}
                            optionLabel="LGE_ELEMENTO_DESCRIPCION" 
                            optionValue="LGE_CODIGO"
                            className="h-10 col-100" 
                            placeholder="Seleccionar" 
                            style={{ alignItems: "center" }} />
                        </>
                      )}
                    />
                    {getFormErrorMessage("tipo")}
                  </div>

                  <div className="col-100">
                    <label>No. documento</label>
                    <br />
                    <Controller
                      name="identification"
                      control={control}
                      rules={{ maxLength: { value: 15, message: "Solo se permiten 15 caracteres" } }}
                      render={({ field, fieldState }) => (
                        <>
                          <span className="p-float-label">
                            <InputText
                              id={field.name}
                              value={field.value}
                              className={classNames({ "p-invalid": fieldState.error }, "h-10 col-100")}
                              onChange={(e) => field.onChange(e.target.value)}
                              keyfilter="alphanum"
                            />
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="mr-4 col-100">
                  <label>Nombres</label>
                  <br />
                  <Controller
                    name="names"
                    control={control}
                    rules={{ maxLength: { value: 50, message: "Solo se permiten 50 caracteres" } }}
                    render={({ field, fieldState }) => (
                      <>
                        <span className="p-float-label">
                          <InputText
                            id={field.name}
                            value={field.value}
                            className={classNames({ "p-invalid": fieldState.error }, "h-10 col-100")}
                            onChange={(e) => field.onChange(e.target.value)}
                            keyfilter="alpha"
                          />
                        </span>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <div className="col-100">
                  <label>Apellidos</label>
                  <br />
                  <Controller
                    name="lastNames"
                    control={control}
                    rules={{ maxLength: { value: 50, message: "Solo se permiten 50 caracteres" } }}
                    render={({ field, fieldState }) => (
                      <>
                        <span className="p-float-label">
                          <InputText
                            id={field.name}
                            value={field.value}
                            className={classNames({ "p-invalid": fieldState.error }, "h-10 col-100")}
                            onChange={(e) => field.onChange(e.target.value)}
                            keyfilter="alpha"
                          />
                        </span>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-row container-movil col-100">
                <div className="mr-4 col-100">
                  <label>No. De contacto</label>
                  <br />
                  <Controller
                    name="noContact"
                    control={control}
                    rules={{ maxLength: { value: 10, message: "Solo se permiten 10 caracteres" } }}
                    render={({ field, fieldState }) => (
                      <>
                        <span className="p-float-label">
                          <InputText
                            id={field.name}
                            value={field.value}
                            className={classNames({ "p-invalid": fieldState.error }, "h-10 col-100")}
                            onChange={(e) => field.onChange(e.target.value)}
                            keyfilter="num"
                            style={{ width: "390px" }}
                          />
                        </span>
                        <br />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <div className="col-100">
                  <label>Correo electrónico</label>
                  <br />
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      maxLength: { value: 100, message: "Solo se permiten 100 caracteres" },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico no válido",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <span className="p-float-label">
                          <InputText
                            id={field.name}
                            value={field.value}
                            className={classNames({ "p-invalid": fieldState.error }, "h-10 col-100")}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </span>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end mb-4 col-100 movil-5">
                <Button
                  text
                  className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                  onClick={resetForm}
                  type="button"
                  label="Limpiar Campos"
                ></Button>
                <Button 
                  className="rounded-full !h-10" 
                  type="submit" 
                  disabled={loadbuton }
                  label="Buscar"
                  onClick={()=>{statusButton.current = true}}
                  >
              
                </Button>
              </div>
            </form>
          </Card>

          {load ? (
            <MessageComponent
              headerMsg="Usuario no encontrado"
              msg="¿Desea radicar la PQRSDF de todas formas y crear el ciudadano?"
              twoBtn={true}
              nameBtn1="Radicar"
              nameBtn2="Cancelar"
              onClickBt2={() => setLoad(false)}
              onClickBt1={()=>{navigate("/atencion-ciudadana/atencion-ciudadania-radicar-pqrsdf/radicar")}}
            />
          ) : (
            <></>
          )}

          {user.length > 0 ? (
            <Card className="card-container-body">
              <TableGenericComponent data={user} />
            </Card>
          ) : (
            <></>
          )}
        </Card>
      </div>
    </>
  );
};

export default AttentionTocitizens;
