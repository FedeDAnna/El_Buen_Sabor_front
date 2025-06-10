import type Localidad from "./Localidad";

export default class Domicilio {
    id?: number;
    calle: string = "";
    numero: number = 0;
    cp: number = 0;

    localidad ?: Localidad;

}