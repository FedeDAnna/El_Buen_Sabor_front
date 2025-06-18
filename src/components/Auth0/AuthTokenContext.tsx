import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect } from "react";
import { setTokenGetter } from "../../services/FuncionesApi"; // Asegurate de que la ruta sea correcta

const AuthTokenContext = createContext<() => Promise<string>>(async () => "");

export const AuthTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setTokenGetter(() => getAccessTokenSilently());
  }, [getAccessTokenSilently]);

  return (
    <AuthTokenContext.Provider value={getAccessTokenSilently}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useToken = () => useContext(AuthTokenContext);
export { AuthTokenContext };
