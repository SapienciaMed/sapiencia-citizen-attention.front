import { Controller, useForm } from 'react-hook-form';
import { Card } from "primereact/card";
import "../../styles/attentionCitizens-styles.scss"
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { TableGenericComponent } from './genericComponent/table.component';

const AttentionTocitizens = ()=> {

  const defaultValues = {
    typeDocument:"",
    identification: "",
    names: "",
    lastName: "",
    email: "",
    noContact:""
  };

  const {
    formState: { errors, isValid },
    control,
    handleSubmit,
    watch,
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
    <>
      <div className="p-8">
        <Card className="card-container">
          <Card
            title='Radicar PQRDSF'
            className="card-container mb-4"
            >
              <form>

                <div style={{ marginBottom: "8px" }}>
                  <label className="text-xl">Buscar por</label>
                </div>

                <div className='flex flex-row'>
                  <div className='flex flex-row mr-4'>
                    <div className='mr-2'>
                      <label className='font-label'>Tipos</label><br />
                      <Controller
                        name="typeDocument"
                        control={control}
                        rules={{ required: 'Campo obligatorio.'}}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                            className='h-10'
                            placeholder='Seleccionar'
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage('tipo')}
                    </div>

                    <div>
                      <label>No. documento</label><br />
                      <Controller
                        name="identification"
                        control={control}
                        rules={{ maxLength:{value:15, message:'Solo se permiten 15 caracteres'} }}
                        render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                  <InputText 
                                    id={field.name} 
                                    value={field.value} 
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10')} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    keyfilter='alphanum' 
                                  />
                              </span>
                              {getFormErrorMessage(field.name)}
                            </>
                        )}
                      />
                    </div>
                  </div>

                  <div className='mr-4'>
                      <label>Nombres</label><br />
                      <Controller
                        name="names"
                        control={control}
                        rules={{ maxLength:{value:50, message:'Solo se permiten 50 caracteres'} }}
                        render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                  <InputText 
                                    id={field.name} 
                                    value={field.value} 
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10')} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    keyfilter='alpha' 
                                  />
                              </span>
                              {getFormErrorMessage(field.name)}
                            </>
                        )}
                      />
                    </div>

                    <div>
                      <label>Apellidos</label><br />
                      <Controller
                        name="lastName"
                        control={control}
                        rules={{ maxLength:{value:50, message:'Solo se permiten 50 caracteres'} }}
                        render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                  <InputText 
                                    id={field.name} 
                                    value={field.value} 
                                    className={classNames({ 'p-invalid': fieldState.error },'h-10')} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    keyfilter='alpha' 
                                  />
                              </span>
                              {getFormErrorMessage(field.name)}
                            </>
                        )}
                      />
                    </div>
                </div>
                <div className='flex flex-row'>
                  <div className='mr-4'>
                    <label>No. De contacto</label><br />
                    <Controller
                      name="noContact"
                      control={control}
                      rules={{ maxLength:{value:10, message:'Solo se permiten 10 caracteres'} }}
                      render={({ field, fieldState }) => (
                          <>
                            <span className="p-float-label">
                                <InputText 
                                  id={field.name} 
                                  value={field.value} 
                                  className={classNames({ 'p-invalid': fieldState.error },'h-10')} 
                                  onChange={(e) => field.onChange(e.target.value)}
                                  keyfilter='alpha'
                                  style={{width:'390px'}}
                                />
                            </span>
                            {getFormErrorMessage(field.name)}
                          </>
                      )}
                    />
                  </div>

                  <div>
                    <label>Correo electrónico</label><br />
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                         maxLength:{value:100, message:'Solo se permiten 100 caracteres'},
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
                                  className={classNames({ 'p-invalid': fieldState.error },'h-10')} 
                                  onChange={(e) => field.onChange(e.target.value)} 
                                />
                            </span>
                            {getFormErrorMessage(field.name)}
                          </>
                      )}
                    />
                  </div>
                </div>

              </form>
          </Card>

          <Card className="card-container">
              <TableGenericComponent/>
          </Card>
        </Card>
      </div>
    </>
  )

}

export default AttentionTocitizens;
