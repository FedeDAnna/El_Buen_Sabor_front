import React from "react";
import "../../estilos/Paginado.css";

interface Props {
  paginaActual: number;
  totalPaginas: number;
  onPaginaCambio: (nuevaPagina: number) => void;
}

function Paginado({ paginaActual, totalPaginas, onPaginaCambio }: Props) {
  return (
    <div className="paginacion">
      <button
        onClick={() => onPaginaCambio(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        ‹
      </button>
      <span>{paginaActual} / {totalPaginas || 1}</span>
      <button
        onClick={() => onPaginaCambio(paginaActual + 1)}
        disabled={paginaActual === totalPaginas || totalPaginas === 0}
      >
        ›
      </button>
    </div>
  );
}

export default Paginado;
