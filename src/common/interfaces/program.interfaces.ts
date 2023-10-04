import { IAffair } from "./affair.interfaces";

export interface IProgram {
  prg_codigo?: number;
  prg_descripcion?: string;
  prg_clasificacion?: number;
  prg_dependencia?: number;
  affairs?: IAffair[];
  prg_activo?: boolean;
  prg_orden?: number;
}
