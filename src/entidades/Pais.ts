import type Provincia from "./Provincia";

export default class Pais {
    id?: number;
    nombre: string ="";
    provincias: Provincia[] = [];
}