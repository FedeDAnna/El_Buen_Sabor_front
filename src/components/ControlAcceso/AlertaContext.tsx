import { createContext, useContext } from "react";

type TipoAlerta = "info" | "error" | "success";

export const AlertaContext = createContext<(params: {
  mensaje: string;
  tipo?: TipoAlerta;
  duracion?: number;
}) => void>(() => {});

export const useAlerta = () => useContext(AlertaContext);
