import type Domicilio from "./Domicilio";
import type { Estado } from "./Estado";
import type { FormaPago } from "./FormaPago";
import type PedidoDetalle from "./PedidoDetalle";
import type Sucursal from "./Sucursal";
import type { TipoEnvio } from "./TipoEnvio";
import type Usuario from "./Usuario";


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
    repartidor?:Usuario;
    detalles: PedidoDetalle[]=[];
}