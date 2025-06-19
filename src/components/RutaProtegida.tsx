import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "../contexts/UserContext";
import { useAlerta } from "../components/ControlAcceso/AlertaContext";
import { Rol } from "../entidades/Rol";

type Props = {
  children: ReactNode;
  rol?: Rol[];
};

export default function RutaProtegida({ children, rol }: Props) {
  const { user, loading } = useUser();
  const mostrarAlerta = useAlerta();
  const [redirect, setRedirect] = useState<"login" | "home" | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      mostrarAlerta({
        mensaje: "Debe iniciar sesión para continuar.",
        tipo: "error",
        duracion: 3000,
      });
      setRedirect("login");
    } else if (rol && (!user.rol || !rol.includes(user.rol))) {
      mostrarAlerta({
        mensaje: "No tiene permiso para ingresar a esta sección.",
        tipo: "error",
        duracion: 3000,
      });
      setRedirect("home");
    }
  }, [user, rol, loading, mostrarAlerta]);

  if (loading) return <p>Cargando usuario...</p>;

  if (redirect === "login") return <Navigate to="/login" replace />;
  if (redirect === "home") return <Navigate to="/HomePage" replace />;

  return <>{children}</>;
}
