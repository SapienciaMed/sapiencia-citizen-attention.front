import { Card } from "primereact/card";
import { AccordionComponent } from "./componentsRegisterPqrsdf/accordionComponent";
import { CitizenInformation } from "./componentsRegisterPqrsdf/citizenInformation";

import "../../styles/register_pqrsdf.scss";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { mastersTablesServices } from "../hooks/masterTables.hook";
import { useEffect, useState } from "react";
import { IChannelAttetion, IChannelAttetionDetail } from "../interfaces/mastersTables.interface";

interface Props {
  isPerson?: boolean;
  isPersonInternl?:boolean;
}

interface Channel{
  channels?: string,
  attention?: string,
  isValid?:boolean
}

const Register_pqrsdf = ({ isPerson = false, isPersonInternl=false }: Props) => {

  const [channels,setChannels] = useState<IChannelAttetion[]>([])
  const [channelsDetail,setChannelsDetal] = useState<IChannelAttetionDetail[]>([])
  const [seletchannels,setSeletChannels] = useState(null)
  const [attention,setAttention] = useState(null)

  const masterTablesServices = mastersTablesServices();

  const getattentionChannels =  async() =>{
    const attentionChannel =  await masterTablesServices.getChannelAtencion()
    return attentionChannel;
  };

  const getattentionChannelsDetail =  async(id:number) =>{
    const attentionChannelDetail =  await masterTablesServices.getChannelAtencionid(id)
    return attentionChannelDetail;
  };

  useEffect(()=>{
    getattentionChannels().then(({data})=>{ setChannels(data)} )
  },[])

  useEffect(()=>{
    getattentionChannelsDetail(seletchannels).then(({data})=>{ setChannelsDetal(data) } )
  },[seletchannels])

  const defaultValues = {
    channels: "",
    attention: ""
  };
  
  const {
    control,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ defaultValues, mode: "all" });
  
  console.log(attention);
  

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
          {isPersonInternl?(
          <>
                      <div className="mb-8 flex flex-wrap">
            <div className="mr-4">
              <label className="font-label" style={{ color: "black" }}>
                Canal de atención<span className="required">*</span>
              </label>
              <br />
              <Controller
                name="channels"
                control={control}
                rules={{ required: "Campo obligatorio." }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    showClear
                    optionLabel="cna_canal"
                    optionValue="cna_codigo"
                    placeholder="Seleccionar"
                    options={channels}
                    focusInputRef={field.ref}
                    onChange={(e) => {
                      field.onChange(e.value) 
                      setSeletChannels(e.value)
                    }}
                    className={classNames({ "p-invalid": fieldState.error }, "h-10")}
                    style={{ alignItems: "center", width: "15em" }}
                  />
                )}
              />
              <br />
              {getFormErrorMessage("city")}
            </div>
            {channelsDetail.length > 0?(
            <>

              <div>
                <label className="font-label" style={{ color: "black" }}>
                  Elija ¿Cuál?<span className="required">*</span>
                </label>
                <br />
                <Controller
                  name="attention"
                  control={control}
                  rules={{ required: "Campo obligatorio." }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      showClear
                      optionLabel="cad_nombre"
                      optionValue="cad_codigo"
                      placeholder="Seleccionar"
                      options={channelsDetail}
                      focusInputRef={field.ref}
                      onChange={(e) => {
                        field.onChange(e.value)
                        setAttention(e.value)
                      }}
                      className={classNames({ "p-invalid": fieldState.error }, "h-10")}
                      style={{ alignItems: "center", width: "15em" }}
                    />
                  )}
                />
              </div>

            </>):(<></>)

            }
          </div>
          </>):(<></>)

          }
          <p style={{ fontSize: "15px" }} className="mb-4">
            SAPIENCIA adoptó el manual de atención a PQRSDF por resolución 212 de 2016, en virtud de este se establece
            lo siguiente:
          </p>
          <AccordionComponent />
        </Card>

        <br />

        <Card className="card">
          <CitizenInformation 
            isPerson={isPerson} channel={{ 
              channels: getValues('channels'),
              attention: attention,
              isValid:isValid
              }} />
        </Card>
      </Card>
    </div>
  );
};

export default Register_pqrsdf;
