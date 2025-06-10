import type Domicilio from "./Domicilio";
import type Imagen from "./Imagen";
import type Pedido from "./Pedido";
import type { Rol } from "./Rol";
import type Sucursal from "./Sucursal";
import type UsuarioA0 from "./UsuarioA0";

export default class Usuario {
    id?: number =0;
    nombre: string = "";
    apellido: string ="";
    telefono: string = "";
    email: string = "";
    fechaNacimiento: Date = new Date();
    
    rol?: Rol;
    domicilios : Domicilio[]=[];
    sucursales : Sucursal[]=[];
    usuario_A0 ?: UsuarioA0;
    imagen?: Imagen;
    pedidos: Pedido[]=[];
}