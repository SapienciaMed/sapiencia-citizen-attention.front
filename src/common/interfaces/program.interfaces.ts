import { IAffair } from "./affair.interfaces";
import { IDependence } from "./dependence.interfaces";

export interface IProgram {
  prg_codigo?: number;
  prg_descripcion?: string;
  prg_clasificacion?: number;
  prg_dependencia?: number;
  clpClasificacionPrograma?: IProgramClasification[];
  depDependencia?: IDependence;
  affairs?: IAffair[];
  prg_activo?: boolean;
  prg_orden?: number;
}

export interface IProgramClasification {
  clp_codigo?: number;
  clp_descripcion?: string;
  clp_programa?: number;
  clp_activo?: boolean;
  clp_orden?: number;
}
