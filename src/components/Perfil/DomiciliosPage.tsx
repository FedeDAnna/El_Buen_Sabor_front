// src/components/Cliente/DomiciliosPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteDomicilioById, saveDomicilio, getDomiciliosPorUsuario, getUsuarioById, saveUsuario } from '../../services/FuncionesApi'
import type Domicilio from '../../entidades/Domicilio'
import DomicilioModal from './DomicilioModal'
import '../../estilos/DomiciliosPage.css'
import type Usuario from '../../entidades/Usuario'
import Swal from 'sweetalert2'

export default function DomiciliosPage() {
  const { usuarioId } = useParams<{ usuarioId: string }>();
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState<Usuario>()
  const [domicilios, setDomicilios] = useState<Domicilio[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string|null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<Domicilio|undefined>(undefined)
  const [mode, setMode] = useState<'view'|'edit'|'create'>('view')


  const load = async () => {
    setLoading(true)

    try {
      const user = await getUsuarioById(Number(usuarioId))
      setUsuario(user)
    } catch (e: any){
      setError("Error al traer el usuario")
    }

    try {
      const list = await getDomiciliosPorUsuario(Number(usuarioId))
      setDomicilios(list)
    } catch (e: any) {
      setError('Error cargando direcciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openModal = (m: 'view'|'edit'|'create', dom?: Domicilio) => {
    setMode(m)
    setSelected(dom)
    setModalOpen(true)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el domicilio.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (!result.isConfirmed) return;
      try {
        await deleteDomicilioById(id)
        await load()
        const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Domicilio eliminado con éxito"
              });
      } catch {
        alert('No se pudo eliminar')
      }
    }

  const handleSave = async (dom: Domicilio) => {
    try {
      const newDom = await saveDomicilio(dom)
      usuario?.domicilios.push(newDom);
      saveUsuario(usuario!)
      setModalOpen(false)
      const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Domicilio creado/editado con éxito"
            });
      await load()
    } catch {
      alert('Error al guardar dirección')
    }
  }

  return (
    <main className="dp-main">
      <header className="dp-header">
        <h2>Mis Direcciones</h2>
        <button onClick={() => openModal('create')} className="btn-add">
          Agregar Dirección
        </button>
      </header>
      {loading && <p>Cargando…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="dp-list">
          {domicilios.map(d => (
            <div key={d.id} className="dp-item">
              <div className="dp-item-info">
                <strong>{d.tipo}</strong>
                <span>Calle {d.calle}, {d.numero}, CP {d.cp}</span>
                <span>{d.localidad?.nombre}</span>
              </div>
              <div className="dp-item-actions">
                <button onClick={() => openModal('view', d)}>Ver</button>
                <button onClick={() => openModal('edit', d)}>Modificar</button>
                <button onClick={() => handleDelete(d.id)}>Eliminar</button>
              </div>
            </div>
          ))}
          {domicilios.length === 0 && (
            <div className="empty-container">
              <img
                src="/imagenes/sinDomicilios.png"
                alt="Sin Domicilios"
                className="dom-empty-img"
              />
            </div>
                      
          )}
        </div>
      )}

      <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver
      </button>

      {modalOpen && (
        <DomicilioModal
          mode={mode}
          domicilio={selected}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  )
}