import {Estado} from '../../entidades/Estado';
export interface PedidoHistorialDTO {
  id: number;
  hora: string; 
  fecha: string; 
  estado: Estado;
  productos: string[]; 
}
