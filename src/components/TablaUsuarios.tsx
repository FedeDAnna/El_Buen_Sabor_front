import React, { useEffect, useState } from "react";
import Usuario from "../entidades/Usuario";
import {
  obtenerUsuariosPorTipo,
  obtenerRolesEmpleados,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/FuncionesApi";
import "../estilos/TablaUsuarios.css";

interface TipoUsuario {
  tipo: "empleados" | "clientes";
}

export default function TablaUsuarios({ tipo }: TipoUsuario) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [rolesEmpleado, setRolesEmpleado] = useState<string[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<
    Usuario | undefined
  >(undefined);
  const [soloLectura, setSoloLectura] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarUsuarios();
    if (tipo === "empleados") {
      cargarRoles();
    }
  }, [tipo]);

  const cargarUsuarios = async () => {
    try {
      const datos = await obtenerUsuariosPorTipo(tipo);
      setUsuarios(datos);
    } catch (err) {
      console.error(`Error al cargar ${tipo}:`, err);
    }
  };

  const cargarRoles = async () => {
    try {
      const roles = await obtenerRolesEmpleados();
      setRolesEmpleado(roles);
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  };

  const abrirModal = (lectura: boolean, usuario?: Usuario) => {
    setUsuarioSeleccionado(usuario ?? new Usuario());
    setSoloLectura(lectura);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioSeleccionado(undefined);
    setSoloLectura(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (usuarioSeleccionado && !soloLectura) {
      const { name, value } = e.target;
      setUsuarioSeleccionado({ ...usuarioSeleccionado, [name]: value });
    }
  };

  // Normalize separa letras y tildes á --> a + tilde
  // replace(...) Ignora caracteres diacríticos
  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtrarUsuarios = () => {
    return usuarios.filter((usuario) => {
      const nombre = normalizarTexto(usuario.nombre);
      const apellido = normalizarTexto(usuario.apellido);
      const email = normalizarTexto(usuario.email);
      const termino = normalizarTexto(busqueda);
      return (
        nombre.includes(termino) ||
        apellido.includes(termino) ||
        email.includes(termino)
      );
    });
  };

  const eliminarUsuarios = (id: number) => async () => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado correctamente");
    } catch (e: any) {
      alert(`Error al eliminar el usuario: ${e.message || e}`);
      console.error(e);
    }
  };

  const guardarCambios = async () => {
    if (!usuarioSeleccionado) return;

    try {
      let usuarioGuardado: Usuario;

      if (!usuarioSeleccionado.id || usuarioSeleccionado.id === 0) {
        // Crear usuario
        usuarioGuardado = await crearUsuario(usuarioSeleccionado);
        setUsuarios((prev) => [...prev, usuarioGuardado]);
        alert("Usuario creado correctamente");
      } else {
        // Actualizar usuario
        usuarioGuardado = await actualizarUsuario(
          usuarioSeleccionado.id,
          usuarioSeleccionado
        );
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuarioGuardado.id ? usuarioGuardado : u))
        );
        alert("Usuario actualizado correctamente");
      }

      cerrarModal();
    } catch (error: any) {
      alert(`Error al guardar usuario: ${error.message || error}`);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="usuarios-header">
        <h2>{tipo === "empleados" ? "Empleados" : "Clientes"}</h2>
        <div>
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="usuarios-buscador"
          />
          {tipo === "empleados" && (
            <button onClick={() => abrirModal(false)}>Agregar +</button>
          )}
        </div>
      </div>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            {tipo === "empleados" && <th>Rol</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrarUsuarios().map((usuario) => (
            <tr key={usuario.id}>
              <td>
                {usuario.nombre} {usuario.apellido}
              </td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              {tipo === "empleados" && <td>{usuario.rol}</td>}
              <td>
                <button onClick={() => abrirModal(true, usuario)}>👁️</button>
                <button onClick={() => abrirModal(false, usuario)}>✏️</button>
                <button onClick={eliminarUsuarios(usuario.id!)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <div className="usuario-modal">
          <div className="usuario-modal-contenido">
            <div className="usuario-modal-header">
              <h3 className="usuario-modal-titulo">
                {soloLectura
                  ? "Datos"
                  : usuarioSeleccionado?.id
                  ? "Editar"
                  : "Agregar"}{" "}
                {tipo === "empleados" ? "Empleado" : "Cliente"}
              </h3>
              <button className="cerrar-modal" onClick={cerrarModal}>
                ×
              </button>
            </div>
            <div className="usuario-modal-body">
              <div className="usuario-modal-formulario">
                <label className="usuario-modal-label">
                  Nombre:
                  <input
                    className="usuario-modal-input"
                    name="nombre"
                    value={usuarioSeleccionado?.nombre ?? ""}
                    onChange={handleInputChange}
                    readOnly={soloLectura}
                  />
                </label>
                <label className="usuario-modal-label">
                  Apellido:
                  <input
                    className="usuario-modal-input"
                    name="apellido"
                    value={usuarioSeleccionado?.apellido ?? ""}
                    onChange={handleInputChange}
                    readOnly={soloLectura}
                  />
                </label>
                <label className="usuario-modal-label">
                  Email:
                  <input
                    className="usuario-modal-input"
                    name="email"
                    value={usuarioSeleccionado?.email ?? ""}
                    onChange={handleInputChange}
                    readOnly={soloLectura}
                  />
                </label>
                <label className="usuario-modal-label">
                  Teléfono:
                  <input
                    className="usuario-modal-input"
                    name="telefono"
                    value={usuarioSeleccionado?.telefono ?? ""}
                    onChange={handleInputChange}
                    readOnly={soloLectura}
                  />
                </label>
                <label className="usuario-modal-label">
                  Fecha Nac.:
                  <input
                    className="usuario-modal-input"
                    type="date"
                    name="fecha_nacimiento"
                    value={
                      usuarioSeleccionado?.fecha_nacimiento
                        ? usuarioSeleccionado.fecha_nacimiento
                            .toString()
                            .substring(0, 10)
                        : ""
                    }
                    onChange={handleInputChange}
                    readOnly={soloLectura}
                  />
                </label>
                {tipo === "empleados" && (
                  <label className="usuario-modal-label">
                    Rol:
                    {soloLectura ? (
                      <input
                        className="usuario-modal-input"
                        value={usuarioSeleccionado?.rol ?? ""}
                        readOnly
                      />
                    ) : (
                      <select
                        className="usuario-modal-select"
                        name="rol"
                        value={usuarioSeleccionado?.rol ?? ""}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Seleccionar --</option>
                        {rolesEmpleado.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    )}
                  </label>
                )}
              </div>
              <div className="usuario-modal-botones">
                <button
                  className="usuario-modal-boton cerrar"
                  onClick={cerrarModal}
                >
                  Cerrar
                </button>
                {!soloLectura && (
                  <button
                    className="usuario-modal-boton guardar"
                    onClick={guardarCambios}
                  >
                    Guardar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
