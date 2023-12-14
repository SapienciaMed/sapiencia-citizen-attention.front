import React, { Fragment, useContext, useEffect } from "react";
import useAuthService from "./features/portal-auth/hooks/auth-service.hook";
import { AppContext } from "./common/contexts/app.context";
import { EResponseCodes } from "./common/constants/api.enum";

interface IPropsAppProvider {
    children: React.JSX.Element;
}

function ApplicationProvider({ children }: IPropsAppProvider): React.JSX.Element {
    const { getAuthorization, BenefactorgetAuthorization } = useAuthService();
    const { setAuthorization } = useContext(AppContext);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          getAuthorization(token)
            .then((res) => {
              if (res.operation.code == EResponseCodes.OK) {
                setAuthorization(res.data);
              } else {
                BenefactorgetAuthorization(token)
                .then((res) => {
                  if (res.operation.code == EResponseCodes.OK) {
                    setAuthorization(res.data);
                  } else {
                    localStorage.removeItem("token");
                  }
                })
                .catch(() => {});
              }
            })
            .catch(() => {});
        }
    }, []);
    return(
        <Fragment>
            {children}
        </Fragment>
    )
}

export default React.memo(ApplicationProvider);