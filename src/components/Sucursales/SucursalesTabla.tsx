import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getSucursales,
  deleteSucursalById
} from '../../services/FuncionesApi';
import type Sucursal from '../../entidades/Sucursal';
import SucursalModal from './SucursalModal';
import Swal from 'sweetalert2';
import '../../estilos/SucursalesTabla.css';
import { DateTime } from 'luxon';

type Mode = 'view' | 'edit' | 'create';

export default function SucursalesTabla() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('view');
  const [selected, setSelected] = useState<Sucursal|undefined>(undefined);

  const load = async () => {
    setLoading(true);
    try {
      const list = await getSucursales();
      setSucursales(list);
    } catch {
      setError('Error al cargar sucursales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openModal = (m: Mode, suc?: Sucursal) => {
    setMode(m);
    setSelected(suc);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar sucursal?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await deleteSucursalById(id);
      Swal.fire('Eliminada','Sucursal eliminada con éxito','success');
      await load();
    } catch {
      Swal.fire('Error','No se pudo eliminar','error');
    }
  };

  if (loading) return <p>Cargando sucursales…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <section className="sucursales-page">
      <header className="sucursales-header">
        <h2>Gestión de Sucursales</h2>
        <button onClick={() => openModal('create')} className="btn-add">
          + Agregar Sucursal
        </button>
      </header>

      <table className="sucursales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apertura</th>
            <th>Cierre</th>
            <th>Domicilio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nombre}</td>
              <td>
                {typeof s.horario_apertura === 'string'
                    ? s.horario_apertura  // ya es "HH:mm:ss"
                    : DateTime.fromJSDate(s.horario_apertura).toFormat('HH:mm')}
                </td>
                <td>
                {typeof s.horario_cierre === 'string'
                    ? s.horario_cierre
                    : DateTime.fromJSDate(s.horario_cierre).toFormat('HH:mm')}
                </td>
              <td>
                {s.domicilio?.calle} {s.domicilio?.numero}, CP {s.domicilio?.cp}
              </td>
              <td className="actions">
                <button onClick={() => openModal('view', s)}>👁️</button>
                <button onClick={() => openModal('edit', s)}>✏️</button>
                <button onClick={() => handleDelete(s.id!)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <SucursalModal
          mode={mode}
          sucursal={selected}
          onClose={() => setModalOpen(false)}
          onSave={async () => {
            setModalOpen(false);
            await load();
          }}
        />
      )}
    </section>
  );
}
