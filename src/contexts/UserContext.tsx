import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Usuario from "../entidades/Usuario";
import { Rol } from "../entidades/Rol";

// Tipo del contexto
type UserContextType = {
  user: Usuario | null;
  loading: boolean;
  setUser: (user: Usuario | null) => void;
};

// Contexto
const UserContext = createContext<UserContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        const usuario = JSON.parse(raw);

        // Normalizar campos importantes
        usuario.fecha_nacimiento = new Date(usuario.fecha_nacimiento);

        const rolNormalizado = usuario.rol?.toUpperCase();
        usuario.rol = Object.values(Rol).includes(rolNormalizado as Rol)
          ? (rolNormalizado as Rol)
          : null;

        console.log("✅ Usuario cargado desde localStorage:", usuario);
        setUser(usuario);
      }
    } catch (error) {
      console.error("❌ Error al parsear el usuario desde localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de <UserProvider>");
  return context;
};
