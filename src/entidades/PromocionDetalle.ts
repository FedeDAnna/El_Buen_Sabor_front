import type Articulo from "./Articulo";
import type Promocion from "./Promocion";

export default class PromocionDetalle {
    id?: number;
    cantidad: number = 0;

    promocion?: Promocion;
    articulo?: Articulo;
}