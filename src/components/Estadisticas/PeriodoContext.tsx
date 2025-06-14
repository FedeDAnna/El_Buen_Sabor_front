
import { createContext, useContext, useState } from "react";

export type Periodo = "1" | "2" | "3";

const PeriodoContext = createContext<{
  periodo: Periodo;
  setPeriodo: (p: Periodo) => void;
} | null>(null);

export const usePeriodo = () => {
  const ctx = useContext(PeriodoContext);
  if (!ctx) throw new Error("usePeriodo debe usarse dentro de un PeriodoProvider");
  return ctx;
};

export function PeriodoProvider({ children }: { children: React.ReactNode }) {
  const [periodo, setPeriodo] = useState<Periodo>("2");

  return (
    <PeriodoContext.Provider value={{ periodo, setPeriodo }}>
      {children}
    </PeriodoContext.Provider>
  );
}
