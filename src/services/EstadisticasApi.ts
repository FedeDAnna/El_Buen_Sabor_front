import type  { RendimientoChartProjectionDTO } from "../DTOs/ProjectionsDTO/RendimientoChartProjectionDTOImpl";

const API_URL = "http://localhost:8080";
const basic   = btoa(`admin:admin123`);


export async function fetchRendimientos(periodo: string): Promise<RendimientoChartProjectionDTO> {
  const res = await fetch(`${API_URL}/estadisticas/rendimiento?periodo=${periodo}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer los rendimientos: ${res.statusText}`);
  return res.json()
}

export const fetchProductosMasVendidos= async(periodo : string) => {
  const res = await fetch(`${API_URL}/estadisticas/productos_mas_vendidos?periodo=${periodo}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer los Productos mas vendidos: ${res.statusText}`);
  return res.json()
}

export const fetchClientesRanking= async(periodo : string) => {
  const res = await fetch(`${API_URL}/estadisticas/clientes_ranking?periodo=${periodo}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer los Productos mas vendidos: ${res.statusText}`);
  return res.json()
}

export async function exportarExcel(periodo: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/estadisticas/exportar-excel?periodo=${periodo}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  });
  if (!res.ok) throw new Error(`Error ${res.status} al generar el Excel: ${res.statusText}`);
  return res.blob();
}