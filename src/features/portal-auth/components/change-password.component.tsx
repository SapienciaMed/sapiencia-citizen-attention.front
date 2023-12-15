import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logoAlcaldiaMedellin from "../../../public/images/logo-alcaldia-black.png";
import logoSapiencia from "../../../public/images/logo-sapiencia.png";
import { EDirection } from "../../../common/constants/input.enum";
import { IRequestRecoveryPassword } from "../../../common/interfaces/auth.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { FormComponent, InputShowPassword, ButtonComponent } from "../../../common/components/Form/index";
import { EResponseCodes } from "../../../common/constants/api.enum";
import "../../../styles/auth-styles.scss";
import { useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { changePassword } from "../../../common/schemas/index";
import useAuthService from "../hooks/auth-service.hook";
import { AppContext } from "../../../common/contexts/app.context";

function ChangePasswordComponent({ action }): React.JSX.Element {
  // Servicios
  const resolver = useYupValidationResolver(changePassword);
  const { setMessage } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IRequestRecoveryPassword>({ resolver });
  const { changeUserPassword } = useAuthService();

  // States
  const [modal, setModal] = useState<boolean>(false);
  const [formData, setFormData] = useState(null);

  // Effect cuando cambia el estado del showModal
  useEffect(() => {
    if (modal)
      setMessage({
        title: "Cambiar Contraseña",
        description: "¿Estás Segur@ de cambiar la contraseña?",
        show: true,
        cancelTitle: "Cancelar",
        OkTitle: "Aceptar",
        onOk: async () => {
          // debugger
          let r = await action(formData);
          debugger;
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
        onCancel: () => {
          showModal();
          setMessage({});
        },
      });
  }, [modal]);

  // Metodo que cambia el estado del show Modal
  const showModal = () => {
    setModal(!modal);
  };

  // Metodo que hace la peticion al api
  const onSubmitChangePassword = handleSubmit(async (data: { password: string; confirmPassword: string }) => {
    setFormData(data);

    const object = {
      password: data.password,
      tokenRecovery: localStorage.getItem("token"),
    };
    const { data: dataResponse, operation } = await changeUserPassword(object);

    if (operation.code === EResponseCodes.OK) {
      navigate("/portal");
    }
  });

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
          <label className="text-main text-center biggest">Cambiar contraseña</label>
          <p className="text-black big not-margin-padding text-center">
            Por favor digita la siguiente información para cambiar tu contraseña
          </p>
          <FormComponent className="form-recoveryPassword" id="form-changePassword" action={onSubmitChangePassword}>
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
        <div className="validations-info">
          <div className="msg-info_validation">
            <GiCheckMark color="#a71989" fontSize={"15px"} />
            <p className="text-primary medium not-margin-padding">8 caracteres como minimo</p>
          </div>
          <div className="msg-info_validation">
            <GiCheckMark color="#a71989" fontSize={"15px"} />
            <p className="text-primary medium not-margin-padding">Un numero</p>
          </div>
        </div>
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
        <span className="bold text-center" onClick={() => navigate("../../portal/ingreso")}>
          Cancelar
        </span>
        <ButtonComponent className="citizen-button-main big" value="Cambiar" type="submit" form="form-changePassword" />
      </div>
      <div className="footer-img">
        <img className="img-sapiencia" src={logoSapiencia} alt="Sapiencia" />
        <img className="img-alcaldia" src={logoAlcaldiaMedellin} alt="Alcaldia de medellin" />
      </div>
    </div>
  );
};

export default React.memo(ChangePasswordComponent);
