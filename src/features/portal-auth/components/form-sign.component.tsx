import React, { useContext, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { EDirection } from "../../../common/constants/input.enum";
import { EResponseCodes } from "../../../common/constants/api.enum";

import { IRequestSignIn } from "../../../common/interfaces/auth.interfaces";


import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import useAuthService from "../../../common/hooks/auth-service.hook";

import {
    FormComponent,
    InputComponent,
    ButtonComponent,
    InputShowPassword,
  } from "../../../common/components/Form/index";
  
import { AppContext } from "../../../common/contexts/app.context";
import { loginValidator } from "../../../common/schemas/index";


interface IFailedSignIn {
  show: boolean;
  msg: string;
}

const FormSignIn = (): React.JSX.Element => {
    // Servicos
    const { signIn, externalSignIn } = useAuthService();
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
      if (errors.numberDocument?.message || errors.password?.message)
        setObjectSignInFailed({
          show: false,
          msg: "",
        });
    }, [errors.numberDocument?.message, errors.password?.message]);
  
    // Metodo que hace la peticion al api
    const onSubmitSignIn = handleSubmit(
      async (data: { numberDocument: string; password: string }) => {
        const credentials = {
          numberDocument: data.numberDocument,
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
        setValue("numberDocument", JSON.parse(credentialsSaved).numberDocument);
        setValue("password", JSON.parse(credentialsSaved).password);
      }
    }, []);
  
    useEffect(() => {
      if (
        objectSignInFailed.show &&
        objectSignInFailed.msg.includes("Usuario y")
      ) {
        setValue("numberDocument", "");
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
            idInput="numberDocument"
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
           
          </div>
        </FormComponent>
      </>
    );
  };

export default FormSignIn;
  