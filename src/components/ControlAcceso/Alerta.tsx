import { useEffect, useState } from "react";

interface Props {
  mensaje: string;
  tipo?: "info" | "error" | "success";
  duracion?: number;
  onClose?: () => void; // opcional, se llama al finalizar
}

const Alerta = ({ mensaje, tipo = "info", duracion = 3000, onClose }: Props) => {
  const [desaparecer, setDesaparecer] = useState(false);

  useEffect(() => {
    const tiempoFadeOut = duracion - 500;

    const fadeOutTimer = setTimeout(() => {
      setDesaparecer(true);
    }, tiempoFadeOut);

    const removeTimer = setTimeout(() => {
      if (onClose) onClose();
    }, duracion);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [duracion, onClose]);

  const colores = {
    info: "#0dcaf0",
    error: "#dc3545",
    success: "#198754"
  };

  return (
    <div
      style={{
        backgroundColor: colores[tipo],
        color: "#fff",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center",
        marginBottom: "1rem",
        animation: `${desaparecer ? "fadeOut" : "fadeIn"} 0.5s ease-in-out`,
        animationFillMode: "forwards"
      }}
    >
      {mensaje}
    </div>
  );
};

export default Alerta;
