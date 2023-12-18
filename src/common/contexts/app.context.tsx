import { useState, createContext, useMemo, ReactElement, Dispatch, SetStateAction } from "react";
import { IMessage } from "../interfaces/global.interface";
import { IAuthorization, IPortalUser } from "../interfaces/auth.interfaces";

interface IAppContext {
  portalUser: IPortalUser;
  setPortalUser: Dispatch<SetStateAction<IPortalUser>>;
  authorization: IAuthorization;
  setAuthorization: Dispatch<SetStateAction<IAuthorization>>;
  message: IMessage;
  setMessage: Dispatch<SetStateAction<IMessage>>;
  validateActionAccess: (indicator: string) => boolean;
}
interface IProps {
  children: ReactElement | ReactElement[];
}

export const AppContext = createContext<IAppContext>({
  portalUser: {} as IPortalUser,
  setPortalUser: () => {},
  authorization: {} as IAuthorization,
  setAuthorization: () => {},
  message: {} as IMessage,
  setMessage: () => {},
  validateActionAccess: () => true,
});

export function AppContextProvider({ children }: IProps) {
  // States
  const [message, setMessage] = useState<IMessage>({} as IMessage);
  const [authorization, setAuthorization] = useState<IAuthorization>({} as IAuthorization);
  const [portalUser, setPortalUser] = useState<IPortalUser>({} as IPortalUser);

  // Metodo que verifica si el usuario posee permisos sobre un accion
  function validateActionAccess(indicator: string): boolean {
    return authorization.allowedActions?.findIndex((i) => i === indicator) >= 0;
  }

  const values = useMemo<IAppContext>(() => {
    return {
      portalUser,
      setPortalUser,
      authorization,
      setAuthorization,
      message,
      setMessage,
      validateActionAccess,
    };
  }, [message, authorization, portalUser]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
