import { useMemo } from "react";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";

export function useApplicationsData() {
  const applications = useMemo((): IMenuAccess[] =>
    [
      {
        id: 1,
        name: "Presentar PQRSDF",
        order: 1,
        url: ""
      },
    ], []);

  return { applications };
}
