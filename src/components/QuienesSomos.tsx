import '../estilos/QuienesSomos.css';

export default function QuienesSomos() {
  return (
    <section className="qs-container">
      <h2>Quiénes Somos</h2>
      <p className="qs-intro">
        Somos un restaurante apasionado por la buena comida y los momentos compartidos. Combinamos recetas tradicionales con un toque actual, usando ingredientes frescos y locales para brindar una experiencia única en cada visita.
      </p>

      <div className="qs-section">
        <h3>Misión</h3>
        <p>
          Brindar experiencias gastronómicas memorables, fusionando sabores tradicionales con un toque moderno, en un ambiente cálido y familiar donde cada plato se prepara con dedicación y pasión.
        </p>
      </div>

      <div className="qs-section">
        <h3>Visión</h3>
        <p>
          Convertirnos en un restaurante referente de la zona, reconocido por nuestra excelencia culinaria, atención personalizada y compromiso con los ingredientes frescos y locales.
        </p>
      </div>

      <div className="qs-section">
        <h3>Valores</h3>
        <ul>
          <li><strong>Calidez:</strong> tratamos a cada cliente como parte de nuestra familia.</li>
          <li><strong>Calidad:</strong> cuidamos cada detalle en la cocina y en la atención.</li>
          <li><strong>Compromiso local:</strong> trabajamos con productores regionales.</li>
          <li><strong>Pasión:</strong> cocinamos con amor, todos los días.</li>
          <li><strong>Innovación:</strong> reinventamos sin olvidar nuestras raíces.</li>
        </ul>
      </div>

      <div className="qs-quote">
        <blockquote>
          "Sabores que cuentan historias."
        </blockquote>
      </div>
    </section>
  );
};
