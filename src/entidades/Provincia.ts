import type Localidad from "./Localidad";
import type Pais from "./Pais";

export default class Provincia {
    id?: number;
    nombre: string ="";
    localidades : Localidad[]=[]
    pais?: Pais;
}