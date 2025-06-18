import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Usuario from "../entidades/Usuario"; // importás tu clase con todos los campos

// Tipo del contexto
type UserContextType = {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
};

// Creamos el contexto tipado
const UserContext = createContext<UserContextType | null>(null);

// Props que recibe el provider (los hijos de la app)
type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Usuario | null>(null);

  // Al iniciar la app, intenta cargar el usuario desde localStorage
  useEffect(() => {
    const userFromStorage = localStorage.getItem("usuario");
    if (userFromStorage) {
      const usuarioParseado = JSON.parse(userFromStorage);
      usuarioParseado.fechaNacimiento = new Date(usuarioParseado.fechaNacimiento); // por si querés usarlo como Date
      setUser(usuarioParseado);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de <UserProvider>");
  return context;
};
