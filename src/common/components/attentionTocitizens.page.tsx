import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "../../styles/attentionCitizens-styles.scss";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { usePqrsdfService } from "../hooks/PqrsdfService.hook"
import { TableGenericComponent } from "./genericComponent/table.component";

import { IPersonFilters } from "../interfaces/person.interfaces";
import { MessageComponent } from "./componentsEditWorkEntities/message.component";

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

  const workEntityService = useWorkEntityService();
  const pqrsdfService = usePqrsdfService();

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

  const resetForm = () => {
    setLoad(false), reset();
    setUser([]);
  };

  let statusButon = true;
  if (
    watch("names").length > 0 ||
    watch("identification").length > 0 ||
    watch("lastNames").length > 0 ||
    watch("email").length > 0
  ) {
    statusButon = false;
  }

  const onSubmit = async (filter: Payload) => {
    console.log("filter-> ", filter);

    try {
      const { email, identification, lastNames, names, documentTypeId, contactNumber } = filter;

      const payload: IPersonFilters = {
        email,
        surname: lastNames,
        name: names,
        identification,
        documentTypeId,
        contactNumber,
      };

      console.log("payload-> ", payload);

      const response = await pqrsdfService.getPeopleByFilters(payload);
      const { data, operation } = response;
      console.log("data-> ", data);
      if (operation.code !== "OK") {
        setLoad(true);
        return;
      }

      /*const usersData = data.map((user) => {
        return {
          identification: user?.numberDocument,
          names: `${user?.names} ${user?.lastNames}`,
          lastName: user?.lastNames,
          email: user?.email,
          noContact1: user?.numberContact1,
          noContact2: user?.numberContact2,
          userId: user?.id,
        };
      });*/
      setLoad(false);
      //setUser(usersData);
    } catch (error) {}
  };

  console.log("user-> ", user.length);

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <>
      <div className="p-8">
        <Card className="card-container">
          <Card title="Radicar PQRDSF" className="card-container mb-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: "8px" }}>
                <label className="text-xl">Buscar por</label>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-row mr-4">
                  <div className="mr-2">
                    <label className="font-label">Tipos</label>
                    <br />
                    <Controller
                      name="typeDocument"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown className="h-10" placeholder="Seleccionar" style={{ alignItems: "center" }} />
                        </>
                      )}
                    />
                    {getFormErrorMessage("tipo")}
                  </div>

                  <div>
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
                              className={classNames({ "p-invalid": fieldState.error }, "h-10")}
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

                <div className="mr-4">
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
                            className={classNames({ "p-invalid": fieldState.error }, "h-10")}
                            onChange={(e) => field.onChange(e.target.value)}
                            keyfilter="alpha"
                          />
                        </span>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <div>
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
                            className={classNames({ "p-invalid": fieldState.error }, "h-10")}
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
              <div className="flex flex-row">
                <div className="mr-4">
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
                            className={classNames({ "p-invalid": fieldState.error }, "h-10")}
                            onChange={(e) => field.onChange(e.target.value)}
                            keyfilter="alpha"
                            style={{ width: "390px" }}
                          />
                        </span>
                        <br />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>

                <div>
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
                            className={classNames({ "p-invalid": fieldState.error }, "h-10")}
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
                <Button className="rounded-full !h-10" type="submit" disabled={load || statusButon}>
                  Buscar
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
            />
          ) : (
            <></>
          )}

          {user.length > 0 ? (
            <Card className="card-container">
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
