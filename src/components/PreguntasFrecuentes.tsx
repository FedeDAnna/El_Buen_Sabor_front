import '../estilos/PreguntasFrecuentes.css';

export default function PreguntasFrecuentes() {
  return (
    <div className="faq-container">
  <h1 className="faq-title">Preguntas Frecuentes</h1>

  <div className="faq-section">
    <h2 className="faq-section-title">Información general</h2>

    <div className="faq-item">
      <h3 className="faq-question">¿Cuáles son los horarios de atención?</h3>
      <p className="faq-answer">Nuestro restaurante está abierto de lunes a domingo, de 00.00AM a 00.00PM.</p>
    </div>

    <div className="faq-item">
      <h3 className="faq-question">¿Dónde está ubicado el restaurante?</h3>
      <p className="faq-answer">Nos encontramos en Rodriguez 425, en el centro de la ciudad, cerca de Plaza Haimes.</p>
    </div>
  </div>

  <div className="faq-section">
    <h2 className="faq-section-title">Pedidos y servicios</h2>

    <div className="faq-item">
      <h3 className="faq-question">¿Se puede comer en el local?</h3>
      <p className="faq-answer">No, actualmente no contamos con mesas para consumo en el lugar. Solo ofrecemos retiro o entrega a domicilio.</p>
    </div>

    <div className="faq-item">
      <h3 className="faq-question">¿Puedo personalizar mi pedido?</h3>
      <p className="faq-answer">Por el momento, no ofrecemos personalización de platos. Sin embargo, estamos trabajando para incorporar esta opción próximamente.</p>
    </div>
  </div>

  <div className="faq-section">
    <h2 className="faq-section-title">Pagos y promociones</h2>

    <div className="faq-item">
      <h3 className="faq-question">¿Cuáles son los métodos de pago aceptados?</h3>
      <p className="faq-answer">Aceptamos efectivo para retiros en el local y Mercado Pago para envíos a domicilio.</p>
    </div>

    <div className="faq-item">
      <h3 className="faq-question">¿Tienen promociones vigentes?</h3>
      <p className="faq-answer">Sí, consulta nuestras redes sociales, pregunta en el local o revisá nuestra web.</p>
    </div>
  </div>
</div>

  );
};
