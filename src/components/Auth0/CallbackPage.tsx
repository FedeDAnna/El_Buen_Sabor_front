

const CallbackPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700">
      <h2 className="text-2xl font-semibold mb-4">¡Un momento por favor!</h2>
      <p className="text-center">
        Estamos validando tu acceso y preparando todo para que disfrutes de la mejor experiencia en El Buen Sabor 🍽️
      </p>
      <div className="mt-8 animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default CallbackPage;
