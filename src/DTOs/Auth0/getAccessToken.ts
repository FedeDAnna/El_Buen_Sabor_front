import { useAuth0 } from "@auth0/auth0-react";

export function useAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  return async () => {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error("No se pudo obtener el token:", error);
      throw error;
    }
  };
}
