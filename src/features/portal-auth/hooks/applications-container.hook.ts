import { useMemo } from "react";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";

export function useApplicationsData() {
  const applications = useMemo(
    (): IMenuAccess[] => [
      {
        id: 1,
        name: "Presentar PQRSDF",
        order: 1,
        url: `/portal/layout/registrar-pqrsdf/$$identification`,
      },
    ],
    []
  );

  return { applications };
}
