import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../estilos/PromocionTabla.css'
import {
  
  getTipoPromocionById,
  deletePromocionById,
  getPromocionesPorTipoPromocion,
} from '../../services/FuncionesApi';
import type Promocion from '../../entidades/Promocion';
import type TipoPromocion from '../../entidades/TipoPromocion';
import PromocionModal from './PromocionModal';

export default function PromocionTabla() {
  const { tipoPromocionId } = useParams<{ tipoPromocionId: string }>();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState<boolean>();

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [modalPromo, setModalPromoId] = useState<Promocion | undefined>(undefined);
  const [tipoPromocion, setTipoPromocion] = useState<TipoPromocion | undefined>();

  // Cargar la categoría
  useEffect(() => {
    if (!tipoPromocionId) return;
    getTipoPromocionById(Number(tipoPromocionId))
      .then(setTipoPromocion)
      .catch((e) => console.error(e));
  }, [tipoPromocionId]);

  // Cargar Promociones
  useEffect(() => {
    //if (!promocionId) return;
    setCargando(true);
    getPromocionesPorTipoPromocion(Number(tipoPromocionId))
      .then(setPromociones)
      .catch(() => setError('No se pudieron cargar las promociones'))
      .finally(() => setCargando(false));
  }, [tipoPromocionId]);

  if (cargando) return <p>Cargando promociones</p>;
  if (error) return <p>{error}</p>;

  // Función para abrir el modal (edición, nuevo o ver)
  function openModal(edit: boolean,isOpen: boolean, Promo?: Promocion) {
    setEditable(edit);
    setModalPromoId(Promo);
    setPromoModalOpen(isOpen);
  }

  // Función para eliminar
  function deletePromocion(id: number) {
    return async () => {
      if (!window.confirm('¿Estás seguro de eliminar esta promocion?')) return;
      deletePromocionById(id)
        .then(() => setPromociones((prev) => prev.filter((p) => p.id !== id)))
        .catch((e) => {
          throw new Error(`Error al eliminar la promoción: ${e.message}`);
        });
    };
  }

  return (
    <section className="products-page">
      <div className="header">
        <h2>Promociones de: {tipoPromocion?.descripcion}</h2>
        <button onClick={() => openModal(true,true)}>Agregar +</button>
      </div>

      
      
      <table className="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Denominacion</th>
            <th>Descripción Descuento</th>
            <th>Fecha Desde</th>
            <th>Fecha Hasta</th>
            <th>Hr Desde</th>
            <th>Hr Hasta</th>
            <th>Precio Promocional</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map((p) => (
            
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.denominacion}</td>
              <td>{p.descripcion_descuento}</td>
              <td>{p.fecha_desde.toLocaleDateString()}</td>
              <td>{p.fecha_hasta.toLocaleDateString()}</td>
              <td>{p.hora_desde.toFormat('HH:mm')}</td>
              <td>{p.hora_hasta.toFormat('HH:mm')}</td>
              <td>${p.precio_promocional}</td>
              <td>
                <button 
                  title="Ver"
                  onClick={() => openModal(false, true, p!)}
                >👁️</button>

                <button
                  title="Editar"
                  onClick={() => openModal(true, true, p!)}
                >✏️</button>

                <button
                  title="Borrar"
                  onClick={deletePromocion(p.id!)}
                >🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
                                                                                                                  <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <div>
        
        <Link to={`admin/tipoPromociones`} className="btn-add">
          ← Volver
        </Link> 
      </div>

      {/* Aquí va la condición para pintar el modal, fuera de la función openModal */}
      {promoModalOpen && (
        <PromocionModal
        editable={editable!}
        TipoPromocion={tipoPromocion!} //ver si hace falta
          initialData={modalPromo}
          onClose={() => setPromoModalOpen(false)}
          onSave={(newProm) => {
            setPromociones((prev) =>
              modalPromo
                ? prev.map((prom) => (prom.id === newProm.id ? newProm : prom))
                : [...prev, newProm]
            );
            setPromoModalOpen(false);
          }}
        />
      )}
    </section>
  );
}
