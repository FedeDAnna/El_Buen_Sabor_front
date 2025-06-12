import type Sucursal from "./Sucursal";

export default class Empresa {
    id?: number ;
    nombre: string = "";
    razon_social: string = "";
    cuil: string = "";

    sucursales: Sucursal[] = [];

}