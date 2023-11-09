import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller, useForm } from "react-hook-form";

interface City {
    name: string;
    code: string;
}

export const ManagetPqrsdfComponent = () => {

    const cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const defaultValues = {
        city:'',
        name:''
      };

    const {
        control,
        formState: { errors, isValid, dirtyFields },
        handleSubmit,
        getFieldState,
        setValue,
        reset,
        resetField,
        getValues,
        watch,
        register,
      } = useForm({ defaultValues, mode: "all" });

      console.log('->> ',isValid);
      

    const getFormErrorMessage = (name) => {
        return errors[name] ? (
          <small className="p-error">{errors[name].message}</small>
        ) : (
          <small className="p-error">&nbsp;</small>
        );
      };

  return (
    <>
    <div className="container-manage">
        <div>
            <Controller
                name="city"
                control={control}
                rules={{ required: 'City is required.'}}
                render={({ field, fieldState }) => (
                        <Dropdown
                            id={field.name}
                            value={field.value}
                            optionLabel="name"
                            placeholder="Select a City"
                            showClear 
                            options={cities}
                            focusInputRef={field.ref}
                            onChange={(e) => field.onChange(e.value)}
                            className={classNames({ 'p-invalid': fieldState.error })}
                        />
                )}
            />
        </div>

        <div>
            <div>
                <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required.'}}
                    render={({ field, fieldState }) => (
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                optionLabel="name"
                                placeholder="Select a City"
                                showClear 
                                options={cities}
                                focusInputRef={field.ref}
                                onChange={(e) => field.onChange(e.value)}
                                className={classNames({ 'p-invalid': fieldState.error })}
                            />
                    )}
                />
            </div>
            <div>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Name - Surname is required.' }}
                    render={({ field, fieldState }) => (
                        <>
                            <span className="p-float-label">
                                <InputText id={field.name} value={field.value} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                <label htmlFor={field.name}>Name - Surname</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}
                />
            </div>
        </div>
        <div>
            <Controller
                name="city"
                control={control}
                rules={{ required: 'City is required.'}}
                render={({ field, fieldState }) => (
                        <Dropdown
                            id={field.name}
                            value={field.value}
                            optionLabel="name"
                            placeholder="Select a City"
                            showClear 
                            options={cities}
                            focusInputRef={field.ref}
                            onChange={(e) => field.onChange(e.value)}
                            className={classNames({ 'p-invalid': fieldState.error })}
                        />
                )}
            />
        </div>
    </div>

    <Accordion activeIndex={0}>
    <AccordionTab header="Header I">
        <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </AccordionTab>
    <AccordionTab header="Header II">
        <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            Consectetur, adipisci velit, sed quia non numquam eius modi.
        </p>
    </AccordionTab>
    <AccordionTab header="Header III">
        <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
        </p>
    </AccordionTab>
</Accordion>

    </>
  )
}
