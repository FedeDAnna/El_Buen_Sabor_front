import { Link } from 'react-router-dom'
import '../../estilos/PedidoConfirmado.css'


export default function PedidoConfirmado() {
  return (
    <main className="pc-main">
      <div className="pc-card">
        <img src="/imagenes/confirmado.png" alt="Pedido confirmado" className="pc-icon" />
        <h1>¡Ya tomamos tu pedido!</h1>
        <p>Gracias por confiar en El Buen Sabor. Te avisaremos cuando esté en camino.</p>
        <Link to="/HomePage" className="pc-btn">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
