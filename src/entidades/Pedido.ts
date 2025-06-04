import type Domicilio from "./Domicilio";
import type { Estado } from "./Estado";
import type Factura from "./Factura";
import type { FormaPago } from "./FormaPago";
import type Sucursal from "./Sucursal";
import type { TipoEnvio } from "./TipoEnvio";
import type Usuario from "./Usuario";
import { DateTime } from "luxon";


export default class Pedido{
    id?: number ;
    hora_estimada_finalizacion: string = "";
    total: number =0;
    estado_pedido?: Estado;
    tipo_envio?: TipoEnvio;
    forma_pago?: FormaPago; 
    fecha_pedido : Date =  new Date();

    domicilio?: Domicilio;
    sucursal?: Sucursal;
    usuario?: Usuario;
    factura?: Factura;
}