import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUsuarioById, saveUsuario } from '../../services/FuncionesApi'
import type Usuario from '../../entidades/Usuario'
import '../../estilos/EditarDatosPersonales.css'
import type Imagen from '../../entidades/Imagen'

export default function EditarDatosPersonales() {
  const { usuarioId } = useParams<{ usuarioId: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<Usuario | null>(null)
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' })
  const [imageData, setImageData] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!usuarioId) return
    getUsuarioById(Number(usuarioId))
      .then(u => {
        setUser(u)
        setForm({
          nombre: u.nombre,
          apellido: u.apellido,
          telefono: u.telefono || ''
        })
        setImageData(u.imagen?.src || '')   // precargo la imagen existente
      })
      .finally(() => setLoading(false))
  }, [usuarioId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageData(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!user) return
    const updated: Usuario = { ...user, ...form }
    updated.imagen = {
      id: user.imagen?.id,
      src: imageData,
      alt: `${form.nombre} ${form.apellido}`
    } as Imagen
    await saveUsuario(updated)
    navigate(-1)
  }

  if (loading || !user) return <p className="edp-loading">Cargando…</p>

  return (
    <div className="edp-container">
      <h2>Editar Datos Personales</h2>
      <div className="edp-form">
        <label>Foto de Perfil</label>
        <div className="edp-avatar-preview">
          {imageData
            ? <img src={imageData} alt="Avatar" />
            : <div className="edp-avatar-placeholder">Sin foto</div>
          }
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label>Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <label>Apellido</label>
        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
        />
        <label>Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
        <label>Correo Electrónico</label>
        <input value={user.email} disabled />
        <label>Fecha de Nacimiento</label>
        <input
          value={new Date(user.fecha_nacimiento).toLocaleDateString()}
          disabled
        />
        <div className="edp-actions">
          <button onClick={() => navigate(-1)}>Cancelar</button>
          <button onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  )
}