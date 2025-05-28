import type { FormaPago } from "./FormaPago";
import type Pedido from "./Pedido";


export default class Factura {
    id: number = 0;
    fecha_facturacion: Date = new Date();
    mp_payment_id: number = 0;
    mp_merchant_order_id: number = 0;
    mp_preference_id: string = "";
    mp_paument_type: string = "";
    forma_pago ?: FormaPago  ;
    total_venta : number = 0 ;

    pedido?: Pedido;

}