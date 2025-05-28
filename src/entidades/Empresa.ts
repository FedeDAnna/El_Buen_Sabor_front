import type Sucursal from "./Sucursal";

export default class Empresa {
    id: number =0 ;
    nombre: string = "";
    razon_social: string = "";
    cuil: string = "";

    sucursales: Sucursal[] = [];

}