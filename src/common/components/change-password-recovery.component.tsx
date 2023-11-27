import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logoAlcaldiaMedellin from "../../public/images/logo-alcaldia-black.png";
import logoSapiencia from "../../public/images/logo-sapiencia.png";
import { EDirection } from "../../common/constants/input.enum";
import { IRequestRecoveryPassword } from "../../common/interfaces/auth.interfaces";
import useYupValidationResolver from "../../common/hooks/form-validator.hook";
import {
  FormComponent,
  InputShowPassword,
  ButtonComponent,
} from "../../common/components/Form/index";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../common/schemas/index";

import { AppContext } from "../../common/contexts/app.context";

function ChangePasswordRecovery({ action }): React.JSX.Element {
  const resolver = useYupValidationResolver(changePassword);
  const { setMessage } = useContext(AppContext);
  const [modal, setModal] = useState<boolean>(false);
  const [formData, setFormData] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IRequestRecoveryPassword>({ resolver });
  const showModal = () => {
    setModal(!modal);
  };
  // // Metodo que hace la peticion al api
  const onSubmitSignIn = handleSubmit(async (data) => {
    // showModal();  
  
    setMessage({
      title: "Cambiar Contraseña",
      description: "¿Estás Segur@ de cambiar la contraseña?",
      show: true,
      cancelTitle: "Cancelar",
      OkTitle: "Aceptar",
      onOk: async () => {
        // debugger
        let r = await action(data); // Envía los datos directamente aquí
        // debugger
        setMessage({
          title: "Cambiar Contraseña",
          description: "Operación realizada con éxito",
          show: true,
          OkTitle: "Aceptar",
          onOk: async () => {
            setMessage({});
          },
        });
      },
    });
  });
  

  const navigate = useNavigate();

  if (modal) {
    return <> </>;
  }

  return (  

    <main className="container-grid_recoveryPassword">
      <article className="recoveryPassword-visualization"></article>

      <article className="container-recoveryPassword">
        <div className="container-close">
          <span onClick={() => navigate("../ingreso")}>x</span> 
        </div>
        <section className="container-form_recoveryPassword">
          <label className="text-main text-center biggest">
            Cambiar contraseña
          </label>
          <p className="text-black big not-margin-padding text-center">
          Por favor ingresa tu nueva contraseña:
          </p>
          <FormComponent
            className="form-recoveryPassword"
            id="form-changePassword"
            action={onSubmitSignIn}
          >
            <InputShowPassword
              idInput="password"
              className="input-basic-login"
              register={register}
              label="Nueva contraseña"
              classNameLabel="text-black big"
              direction={EDirection.column}
              errors={errors}
              placeholder={"Contraseña nueva"}
            />
            <InputShowPassword
              idInput="confirmPassword"
              className="input-basic-login"
              register={register}
              label="Confirmación"
              classNameLabel="text-black big"
              direction={EDirection.column}
              errors={errors}
              placeholder={"Confirmar contraseña"}
            />
          </FormComponent>
        </section>
        <hr />
       <FooterRecoveryPasssword /> 
      </article>
    </main>
  );
}

const FooterRecoveryPasssword = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="content-footer_recoveryPassword">
      <div className="container-buttons">
        <span className="bold text-center" onClick={() => navigate("../ingreso")}>
          Cancelar
        </span>
        <ButtonComponent
          className="button-main huge hover-three"
          value="Recuperar"
          type="submit"
          form="form-changePassword"
        />
      </div>
      <div className="footer-img">
        <img className="img-sapiencia" src={logoSapiencia} alt="Sapiencia" />
        <img
          className="img-alcaldia"
          src={logoAlcaldiaMedellin}
          alt="Alcaldia de medellin"
        />
      </div>
    </div>
  );
};

export default React.memo(ChangePasswordRecovery);
