import React, { useContext, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import logoAlcaldiaMedellin from "../../public/images/logo-alcaldia-black.png";
import logoSapiencia from "../../public/images/logo-sapiencia.png";

import { EDirection } from "../../common/constants/input.enum";
import { EResponseCodes } from "../../common/constants/api.enum";
import { IRequestSignIn } from "../../common/interfaces/auth.interfaces";

import useYupValidationResolver from "../../common/hooks/form-validator.hook";
import useAuthService from "../../common/hooks/auth-service.hook";

import {
  FormComponent,
  InputComponent,
  ButtonComponent,
  InputShowPassword,
} from "../../common/components/Form/index";

import { loginValidator } from "../../common/schemas/index";

import { AppContext } from "../../common/contexts/app.context";
import { useNavigate, Link } from "react-router-dom";

interface IVersionComponente {
  version: string;
}

interface IFailedSignIn {
  show: boolean;
  msg: string;
}

function LoginPage(): React.JSX.Element {
  return (
    <main className="container-grid_login">
      <article className="login-visualization">
        <section className="login-container-aurora">
          <img
            className="img-mobil"
            // src={require("../../public/images/icons-aplication/aurora-white-logo.svg")}
            alt="aurora"
          />
          <span className="text-login huge">
            Bienvenid@ a{" "}
            <img
              // src={require("../../public/images/icons-aplication/aurora-white-logo.svg")}
              alt="aurora"
            />{" "}
          </span>
          <span className="text-login extra-large">
            Sistema de información Sapiencia
          </span>
        </section>
      </article>

      <article className="login-signIn">
        <section className="container-logos_signIn">
          <img src={logoAlcaldiaMedellin} alt="Alcaldia de medellin" />
          <img src={logoSapiencia} alt="Sapiencia" />
          <hr />
        </section>

        <section className="container-form_signIn">
          <div className="content-form_signIn">
            <FormSignIn />
            <VersionSapiencia version={"1.0.0"} />
          </div>
        </section>
      </article>
    </main>
  );
}

const FormSignIn = (): React.JSX.Element => {
  // Servicos
  const { signIn } = useAuthService();
  const navigate = useNavigate();

  const { setAuthorization } = useContext(AppContext);
  const resolver = useYupValidationResolver(loginValidator);
  const credentialsSaved = localStorage.getItem("credentials");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
    formState,
  } = useForm<IRequestSignIn>({ resolver });

  // States
  const [objectSignInFailed, setObjectSignInFailed] = useState<IFailedSignIn>({
    show: false,
    msg: "",
  });

  const [isRememberData, setIsRememberData] = useState<boolean>(false);

  useEffect(() => {
    if (errors.identification?.message || errors.password?.message)
      setObjectSignInFailed({
        show: false,
        msg: "",
      });
  }, [errors.identification?.message, errors.password?.message]);

  // Metodo que hace la peticion al api
  const onSubmitSignIn = handleSubmit(
    async (data: { identification: string; password: string }) => {
      const credentials = {
        identification: data.identification,
        password: data.password,
      };

      const { data: dataResponse, operation } = await signIn(data);

      if (operation.code === EResponseCodes.OK) {
        isRememberData &&
          localStorage.setItem("credentials", JSON.stringify(credentials));
        JSON.parse(credentialsSaved) &&
          !isRememberData &&
          localStorage.removeItem("credentials");

        localStorage.setItem("token", dataResponse.token);
        setAuthorization(dataResponse.authorization);
        navigate("/core");
      } else {
        setObjectSignInFailed({
          show: true,
          msg: operation.message,
        });
      }
    }
  );

  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRememberData(event.target.checked);
  };

  useEffect(() => {
    JSON.parse(credentialsSaved) && setIsRememberData(!isRememberData);

    if (JSON.parse(credentialsSaved)) {
      setValue("identification", JSON.parse(credentialsSaved).identification);
      setValue("password", JSON.parse(credentialsSaved).password);
    }
  }, []);

  useEffect(() => {
    if (
      objectSignInFailed.show &&
      objectSignInFailed.msg.includes("Usuario y")
    ) {
      setValue("identification", "");
    }
    if (
      objectSignInFailed.show &&
      objectSignInFailed.msg.includes("La contraseña actual")
    ) {
      setValue("password", "");
    }
  }, [objectSignInFailed.show, objectSignInFailed.msg]);

  return (
    <>
      <label className="text-main text-center biggest bold label-login">
        Ingresa tus datos para iniciar sesión
      </label>
      <FormComponent className="form-signIn" action={onSubmitSignIn}>
        <InputComponent
          idInput="identification"
          className="input-basic"
          typeInput="text"
          register={register}
          label="Documento de identidad"
          classNameLabel="text-black big"
          direction={EDirection.column}
          errors={errors}
          placeholder={"Tu número de documento"}
        />
        <InputShowPassword
          idInput="password"
          className="input-basic"
          register={register}
          label="Digita tú contraseña"
          classNameLabel="text-black big"
          direction={EDirection.column}
          errors={errors}
          placeholder={"Tu contraseña"}
        ></InputShowPassword>
        <div className="content-remember_data">
          <input
            type="checkbox"
            className="checkbox-basic"
            onChange={onChangeCheckBox}
            checked={isRememberData}
          />
          <label className="text-primary medium">
            Recordar datos de acceso
          </label>
        </div>
        {objectSignInFailed.show &&
          objectSignInFailed.msg != "Usuario no existe" && (
            <div className="error-message-user">
              <button
                onClick={() => setObjectSignInFailed({ show: false, msg: "" })}
              >
                x
              </button>
              <p className="error-message-p not-margin-padding">
                {objectSignInFailed.msg}
              </p>
            </div>
          )}
        <div className="content-finally_form">
          <ButtonComponent
            className="button-login big"
            value="Ingresar"
            type="submit"
            disabled={!formState.isValid}
          />
          <div className="recovery-password">
            <p className="text-primary medium not-margin-padding">
              ¿Olvidaste tu contraseña?
            </p>
            <Link
              className="a-main medium weight-500"
              to={"../aurora/recuperar-clave"}
            >
              Recupérala AQUÍ
            </Link>
          </div>
        </div>
      </FormComponent>
    </>
  );
};

const VersionSapiencia = ({
  version,
}: IVersionComponente): React.JSX.Element => {
  return (
    <div className="content-version">
      <p className="text-black bug weight-900 not-margin-padding">
        Powered by:
      </p>
      <p className="text-primary not-margin-padding bug ">Sapiencia</p>
      <p className="text-main weight-500 not-margin-padding bug ">v{version}</p>
    </div>
  );
};

export default React.memo(LoginPage);
