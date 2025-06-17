import { useNavigate } from "react-router-dom";

const ProfileButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/cliente/perfil")}
      className="inline-block px-4 py-2 text-sm font-semibold text-white text-center bg-indigo-500 rounded-lg outline-none ring-indigo-300 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base transition duration-100"
    >
      Perfil
    </button>
  );
};

export default ProfileButton;
