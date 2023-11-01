import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";

const PrivateRoute = ({ element, allowedAction }) => {
  const { authorization } = useContext(AppContext);
  const navigate = useNavigate();

  if (!authorization?.allowedActions) {
    return <div>Loading...</div>;
  }

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

  const acceptButton = (options, label = "Aceptar") => {
    return (
      <div className="flex items-center justify-center gap-2 pb-2">
        <Button label={label} rounded className="!px-4 !py-2 !text-base !mr-0 !font-sans" onClick={toCore} />
      </div>
    );
  };

  const toCore = () => navigate("/core");

  if (authorization?.allowedActions?.findIndex((i) => i == allowedAction) >= 0) {
    return element;
  } else {
    return (
      <ConfirmDialog
        className="!rounded-2xl overflow-hidden"
        headerClassName="!rounded-t-2xl"
        visible={true}
        contentClassName="md:w-[640px] max-w-full mx-auto justify-center"
        message={
          <div className="flex flex-wrap w-full items-center justify-center">
            <div className="mx-auto text-primary text-3xl w-full text-center">¡Acceso no autorizado!</div>
            <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
              Consulte con el admimistrador del sistema.
            </div>
          </div>
        }
        reject={toCore}
        onHide={toCore}
        accept={toCore}
        closeIcon={closeIcon}
        acceptLabel="Aceptar"
        footer={(options) => acceptButton(options)}
      ></ConfirmDialog>
    );
  }
};

export default PrivateRoute;
