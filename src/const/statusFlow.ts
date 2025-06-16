import { Estado } from "../entidades/Estado";

export const statusFlow: Partial<Record<Estado, Estado>> = {
  [Estado.PENDIENTE]:     Estado.CONFIRMADO,
  [Estado.CONFIRMADO]:    Estado.EN_PREPARACION,
  [Estado.EN_PREPARACION]: Estado.LISTO,
  [Estado.LISTO]:         Estado.EN_CAMINO,
  [Estado.EN_CAMINO]:     Estado.ENTREGADO,
};

export const buttonLabels: Record<Estado, string> = {
  [Estado.PENDIENTE]:      "Confirmar",
  [Estado.CONFIRMADO]:     "Iniciar Preparación",
  [Estado.EN_PREPARACION]: "Marcar Listo",
  [Estado.LISTO]:          "Enviar a Cliente",
  [Estado.EN_CAMINO]:      "Marcar Entregado",
  // Estados sin acción:
  [Estado.ENTREGADO]:      "",
  [Estado.RECHAZADO]:      "",
  [Estado.CANCELADO]:      "",
  [Estado.DEMORADO]:       "",
};
