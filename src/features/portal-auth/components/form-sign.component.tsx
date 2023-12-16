import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { EDirection } from "../../../common/constants/input.enum";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IRequestSignIn } from "../../../common/interfaces/auth.interfaces";
import useAuthService from "../hooks/auth-service.hook";
import {
  FormComponent,
  InputComponent,
  ButtonComponent,
  InputShowPassword,
} from "../../../common/components/Form/index";
import { AppContext } from "../../../common/contexts/app.context";

interface IFailedSignIn {
  show: boolean;
  msg: string;
}

const FormSignInComponent = (): React.JSX.Element => {
  // Servicos
  const { benefactorSignIn } = useAuthService();
  const navigate = useNavigate();
  const { setAuthorization } = useContext(AppContext);
  const credentialsSaved = localStorage.getItem("credentials");
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    formState,
  } = useForm<IRequestSignIn>({ mode: "all" });

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [isRememberData, setIsRememberData] = useState<boolean>(false);
  const [objectSignInFailed, setObjectSignInFailed] = useState<IFailedSignIn>({
    show: false,
    msg: "",
  });

  // Effect que detecta los errores en el form
  useEffect(() => {
    if (errors.identification?.message || errors.password?.message)
      setObjectSignInFailed({
        show: false,
        msg: "",
      });
  }, [errors.identification?.message, errors.password?.message]);

  // Effect que carga las credencial si habilito el "recordar"
  useEffect(() => {
    JSON.parse(credentialsSaved) && setIsRememberData(!isRememberData);

    if (JSON.parse(credentialsSaved)) {
      setValue("identification", JSON.parse(credentialsSaved).identification);
      setValue("password", JSON.parse(credentialsSaved).password);
    }
  }, []);

  useEffect(() => {
    if (objectSignInFailed.show && objectSignInFailed.msg.includes("Usuario y")) {
      setValue("identification", "");
    }
    if (objectSignInFailed.show && objectSignInFailed.msg.includes("La contraseña actual")) {
      setValue("password", "");
    }
  }, [objectSignInFailed.show, objectSignInFailed.msg]);

  // Metodo que hace la peticion al api
  const onSubmitSignIn = handleSubmit(async (data: { identification: string; password: string }) => {
    setLoading(true);

    const credentials = {
      identification: data.identification,
      password: data.password,
    };

    const { data: dataResponse, operation } = await benefactorSignIn(data);

    console.log(operation);

    setLoading(false);
    if (operation.code === EResponseCodes.OK) {
      isRememberData && localStorage.setItem("credentials", JSON.stringify(credentials));
      JSON.parse(credentialsSaved) && !isRememberData && localStorage.removeItem("credentials");
      localStorage.setItem("token", dataResponse.token);
      sessionStorage.setItem("token", dataResponse.token);
      setAuthorization(dataResponse.authorization);

      if (dataResponse.authorization.user.password) {
        navigate(`/portal/layout`);
      } else {
        sessionStorage.setItem("identification", data.identification);
        navigate("../cambiar-clave");
      }
    } else {
      console.log("akive");
      setObjectSignInFailed({
        show: true,
        msg: operation.message,
      });
    }
  });

  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRememberData(event.target.checked);
  };

  return (
    <>
      <label className="text-main text-center biggest bold label-login">Ingresa tus datos para iniciar sesión</label>
      <FormComponent id="form-sign" className="form-signIn" action={onSubmitSignIn}>
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
          <input type="checkbox" className="checkbox-basic" onChange={onChangeCheckBox} checked={isRememberData} />
          <label className="text-primary medium">Recordar datos de acceso</label>
        </div>
        {objectSignInFailed.show && (
          <div className="error-message-user">
            <button onClick={() => setObjectSignInFailed({ show: false, msg: "" })}>x</button>
            <p className="error-message-p not-margin-padding">{objectSignInFailed.msg}</p>
          </div>
        )}
        <div className="content-finally_form">
          <ButtonComponent
            className="citizen-button-login big"
            form="form-sign"
            value="Ingresar"
            loading={loading}
            type="submit"
            disabled={!formState.isValid}
          />
          <div className="recovery-password">
            <p className="text-primary medium not-margin-padding">¿Olvidaste tu contraseña?</p>
            <Link className="a-main medium weight-500" to={"../recuperar-clave"}>
              Recupérala AQUÍ
            </Link>
          </div>
        </div>
      </FormComponent>
    </>
  );
};

export default FormSignInComponent;
