import { useAuth0 } from "@auth0/auth0-react";

const RegisterButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: "/HomePage", 
          },
          authorizationParams: {
            screen_hint: "signup",
          },
        })
      }
      className="inline-block px-4 py-2 text-sm font-semibold text-white text-center bg-indigo-500 rounded-lg outline-none ring-indigo-300 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base transition duration-100"
    >
      Registrarse
    </button>
  );
};

export default RegisterButton;
