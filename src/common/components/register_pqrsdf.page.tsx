import { Card } from "primereact/card";
import { AccordionComponent } from "./componentsRegisterPqrsdf/accordionComponent";
import { CitizenInformation } from "./componentsRegisterPqrsdf/citizenInformation";

import "../../styles/register_pqrsdf.scss";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

interface Props {
  isPerson?: boolean;
}

const Register_pqrsdf = ({ isPerson = false }: Props) => {
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const defaultValues = {
    city: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues, mode: "all" });

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="container">
      <Card className="card card-body">
        <Card title="Registrar PQRSDF" className="card">
          <div className="mb-8 flex flex-wrap">
            <div className="mr-4">
              <label className="font-label" style={{ color: "black" }}>
                Canal de atención<span className="required">*</span>
              </label>
              <br />
              <Controller
                name="city"
                control={control}
                rules={{ required: "Campo obligatorio." }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    showClear
                    optionLabel="name"
                    placeholder="Seleccionar"
                    options={cities}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({ "p-invalid": fieldState.error }, "h-10")}
                    style={{ alignItems: "center", width: "15em" }}
                  />
                )}
              />
              <br />
              {getFormErrorMessage("city")}
            </div>
            <div>
              <label className="font-label" style={{ color: "black" }}>
                Elija ¿Cuál?
              </label>
              <br />
              <Controller
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    showClear
                    optionLabel="name"
                    placeholder="Seleccionar"
                    options={cities}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({ "p-invalid": fieldState.error }, "h-10")}
                    style={{ alignItems: "center", width: "15em" }}
                  />
                )}
              />
            </div>
          </div>
          <p style={{ fontSize: "15px" }} className="mb-4">
            SAPIENCIA adoptó el manual de atención a PQRSDF por resolución 212 de 2016, en virtud de este se establece
            lo siguiente:
          </p>
          <AccordionComponent />
        </Card>

        <br />

        <Card className="card">
          <CitizenInformation isPerson={isPerson} />
        </Card>
      </Card>
    </div>
  );
};

export default Register_pqrsdf;
