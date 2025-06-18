// src/api/estadisticasApi.ts

import type { RendimientoChartProjectionDTO } from "../DTOs/ProjectionsDTO/RendimientoChartProjectionDTOImpl";

const API_URL = "http://localhost:8080";

let tokenGetter: () => Promise<string>;

export function setTokenGetter(getter: () => Promise<string>) {
  tokenGetter = getter;
}

async function securedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!tokenGetter) throw new Error("Token getter no configurado");
  const token = await tokenGetter();
  return fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function fetchRendimientos(periodo: string): Promise<RendimientoChartProjectionDTO> {
  const res = await securedFetch(`/estadisticas/rendimiento?periodo=${periodo}`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer los rendimientos: ${res.statusText}`);
  return res.json();
}

export const fetchProductosMasVendidos = async (periodo: string) => {
  const res = await securedFetch(`/estadisticas/productos_mas_vendidos?periodo=${periodo}`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer los productos más vendidos: ${res.statusText}`);
  return res.json();
};

export const fetchClientesRanking = async (periodo: string) => {
  const res = await securedFetch(`/estadisticas/clientes_ranking?periodo=${periodo}`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer el ranking de clientes: ${res.statusText}`);
  return res.json();
};
