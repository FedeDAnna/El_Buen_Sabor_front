import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: `${window.location.origin}/HomePage`,
          },
        })
      }
      className="inline-block px-4 py-2 text-sm font-semibold text-gray-500 text-center bg-gray-100 rounded-lg outline-none ring-indigo-300 hover:text-indigo-600 focus-visible:ring active:text-indigo-800 md:text-base transition duration-100"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
