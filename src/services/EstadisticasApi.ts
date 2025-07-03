import type { RendimientoChartProjectionDTO } from "../DTOs/ProjectionsDTO/RendimientoChartProjectionDTOImpl";

const API_URL = "http://localhost:8080";

let tokenGetter: () => Promise<string>;

export function setTokenGetter(getter: () => Promise<string>) {
  tokenGetter = getter;
}

async function securedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!tokenGetter) throw new Error("Token getter no configurado");
  const token = await tokenGetter();
  return fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

async function securedGet<T>(url: string): Promise<T> {
  const res = await securedFetch(url);
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      `Error ${res.status} en GET ${url}: ${res.statusText}. ${errorText}`
    );
  }
  return res.json();
}

export async function fetchRendimientos(
  periodo: string
): Promise<RendimientoChartProjectionDTO> {
  return securedGet<RendimientoChartProjectionDTO>(
    `/estadisticas/rendimiento?periodo=${encodeURIComponent(periodo)}`
  );
}

export async function fetchProductosMasVendidos(
  periodo: string
): Promise<any[]> {
  return securedGet<any[]>(
    `/estadisticas/productos_mas_vendidos?periodo=${encodeURIComponent(periodo)}`
  );
}

export async function fetchClientesRanking(
  periodo: string
): Promise<any[]> {
  return securedGet<any[]>(
    `/estadisticas/clientes_ranking?periodo=${encodeURIComponent(periodo)}`
  );
}

export async function exportarExcel(periodo: string): Promise<Blob> {
  const res = await securedFetch(`/estadisticas/exportar-excel?periodo=${periodo}`, {
    method: 'GET'
  });

  // Ojo: securedFetch devuelve JSON por defecto, así que no uses `.json()` aquí.
  return res.blob();
}