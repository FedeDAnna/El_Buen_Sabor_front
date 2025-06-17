import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getUsuarioById } from '../../services/FuncionesApi'
import type Usuario from '../../entidades/Usuario'
import '../../estilos/DatosPersonales.css'

export default function DatosPersonales() {
  const { usuarioId } = useParams<{ usuarioId: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<Usuario>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!usuarioId) return
    getUsuarioById(Number(usuarioId))
      .then(u => setUser(u))
      .catch(() => setError('No se pudo cargar usuario'))
      .finally(() => setLoading(false))
  }, [usuarioId])

  if (loading) return <p className="dp-loading">Cargando datos…</p>
  if (error || !user) return <p className="dp-error">{error || 'Usuario no encontrado'}</p>
  console.log(user)

  return (
    
    <div className="dp-container">
        <button onClick={() => navigate(-1)} className="dp-back-btn">
        ← Volver
        </button>
      <div className="dp-card">
        <img
            src={user.imagen!.src}
            alt={"Foto de Perfil"}
            className="adp-img"
        />
        <h2 className="dp-name">{user.nombre} {user.apellido}</h2>
        <Link to={`/perfil/${user.id}/editar`} className="dp-edit-btn">
          Editar configuración
        </Link>
      </div>
      <div className="dp-details">
        <div className="dp-row">
          <span className="dp-label">Correo Electrónico</span>
          <span className="dp-value">{user.email}</span>
        </div>
        <div className="dp-row">
          <span className="dp-label">Teléfono</span>
          <span className="dp-value">{user.telefono}</span>
        </div>
        <div className="dp-row">
          <span className="dp-label">Fecha de Nacimiento</span>
          <span className="dp-value">{new Date(user.fecha_nacimiento).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}