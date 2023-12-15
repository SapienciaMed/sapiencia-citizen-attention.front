import React, { Fragment, useContext, useEffect } from "react";
import useAuthService from "./features/portal-auth/hooks/auth-service.hook";
import { AppContext } from "./common/contexts/app.context";
import { EResponseCodes } from "./common/constants/api.enum";

interface IPropsAppProvider {
  children: React.JSX.Element;
}

function ApplicationProvider({ children }: IPropsAppProvider): React.JSX.Element {
  const { getAuthorization, getPortalAuthorization } = useAuthService();
  const { setAuthorization, setPortalUser } = useContext(AppContext);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAuthorization(token).then((res) => {
        if (res.operation.code == EResponseCodes.OK) {
          setAuthorization(res.data);
        } else {
          getPortalAuthorization(token).then((res) => {
            if (res.operation.code == EResponseCodes.OK) {
              setPortalUser(res.data.user);
            } else {
              localStorage.removeItem("token");
            }
          });
        }
      });
    }
  }, []);
  return <Fragment>{children}</Fragment>;
}

export default React.memo(ApplicationProvider);
