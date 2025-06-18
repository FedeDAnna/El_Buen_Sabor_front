// src/components/RutaProtegida.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

type Props = {
  children: ReactNode;
  rol?: "ADMIN" | "CLIENTE" | "EMPLEADO";
};

export default function RutaProtegida({ children, rol }: Props) {
  const { user } = useUser();

  // Mientras se carga el usuario desde localStorage
  if (user === null) return <p>Cargando...</p>;

  // Si no hay usuario (no logueado), redirige al login
  if (!user) return <Navigate to="/login" replace />;

  // Si hay restricción de rol y no coincide, redirige al home
  if (rol && user.rol?.toUpperCase() !== rol.toUpperCase()){
    return <Navigate to="/HomePage" replace />;
  }

  // Caso exitoso: renderiza el contenido protegido
  return <>{children}</>;
}
