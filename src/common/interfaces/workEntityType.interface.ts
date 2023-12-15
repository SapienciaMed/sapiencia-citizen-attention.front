import { IDependence } from "./dependence.interfaces";
import { IPqrsdfStatus } from "./pqrsdf.interfaces";

export interface IWorkEntityType {
  tet_codigo?: number;
  tet_descripcion?: string;
  tet_activo?: boolean;
  tet_orden?: number;
  associatedStatusId?: number;
  dependenceId?: number;
  status?: IPqrsdfStatus;
  dependence?: IDependence;
}
