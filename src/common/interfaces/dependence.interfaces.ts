import { IProgram } from "./program.interfaces";

export interface IDependence {
  dep_codigo?: number;
  dep_descripcion?: string;
  dep_activo?: boolean;
  dep_orden?: number;
  programs?: IProgram[];
}
