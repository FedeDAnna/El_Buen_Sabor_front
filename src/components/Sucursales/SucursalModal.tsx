import React, { useState, useEffect } from 'react';
import { getLocalidades, saveSucursal } from '../../services/FuncionesApi';
import type Sucursal from '../../entidades/Sucursal';
import type Domicilio from '../../entidades/Domicilio';
import type Localidad from '../../entidades/Localidad';
import Swal from 'sweetalert2';
import '../../estilos/SucursalModal.css';

interface Props {
  mode: 'view' | 'edit' | 'create';
  sucursal?: Sucursal;
  onClose: () => void;
  onSave: () => void;
}

export default function SucursalModal({ mode, sucursal, onClose, onSave }: Props) {
  const editable = mode !== 'view';

  // Sucursal
  const [nombre, setNombre] = useState('');
  const [horaA, setHoraA] = useState('09:00:00');
  const [horaC, setHoraC] = useState('18:00:00');

  // Campos del domicilio
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [cp, setCp] = useState('');
  const [localidadId, setLocalidadId] = useState<number | ''>('');

  // Localidades
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  // Cargar localidades al montar
  useEffect(() => {
    getLocalidades().then(setLocalidades).catch(console.error);
  }, []);

  // Si viene una sucursal para ver/editar, precargamos
  useEffect(() => {
    if (!sucursal) return;
    setNombre(sucursal.nombre);
    setHoraA(sucursal.horario_apertura.toString());
    setHoraC(sucursal.horario_cierre.toString());

    if (sucursal.domicilio) {
      setCalle(sucursal.domicilio.calle);
      setNumero(String(sucursal.domicilio.numero));
      setCp(String(sucursal.domicilio.cp));
      setLocalidadId(sucursal.domicilio.localidad!.id!);
    }
  }, [sucursal]);

  const handleSubmit = async () => {
    try {
      // Construimos el objeto a enviar
      const toSave: Sucursal = {
        ...(sucursal || {}),
        nombre,
        horario_apertura: horaA,
        horario_cierre: horaC,
        domicilio: {
          id: sucursal?.domicilio?.id,
          tipo: 'Sucursal',          // fijo
          calle,
          numero: Number(numero),
          cp: Number(cp),
          localidad: { id: localidadId } as any
        } as any,
        empresa: { id: 1 } as any      // siempre empresa 1
      } as any;

      await saveSucursal(toSave);
      Swal.fire('Éxito', 'Sucursal guardada correctamente', 'success');
      onSave();
    } catch {
      Swal.fire('Error', 'No se pudo guardar la sucursal', 'error');
    }
  };

   return (
    <div className="sm-overlay">
      <div className="sm-modal">
        <header className="sm-header">
          <h3>
            {mode === 'create' ? 'Nueva Sucursal'
              : mode === 'edit'   ? 'Editar Sucursal'
              : 'Detalle de Sucursal'}
          </h3>
          <button onClick={onClose}>×</button>
        </header>
        <div className="sm-body">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            readOnly={!editable}
          />

          <label>Horario Apertura</label>
          <input
            type="time"
            value={horaA.slice(0,5)}
            onChange={e => setHoraA(e.target.value + ':00')}
            readOnly={!editable}
          />

          <label>Horario Cierre</label>
          <input
            type="time"
            value={horaC.slice(0,5)}
            onChange={e => setHoraC(e.target.value + ':00')}
            readOnly={!editable}
          />

          <fieldset className="sm-fieldset">
            <legend>Domicilio de la Sucursal</legend>

            <label>Tipo</label>
            <input
              type="text"
              value="Sucursal"
              readOnly
            />

            <label>Calle</label>
            <input
              type="text"
              value={calle}
              onChange={e => setCalle(e.target.value)}
              readOnly={!editable}
            />

            <label>Número</label>
            <input
              type="number"
              value={numero}
              onChange={e => setNumero(e.target.value)}
              readOnly={!editable}
            />

            <label>Código Postal</label>
            <input
              type="number"
              value={cp}
              onChange={e => setCp(e.target.value)}
              readOnly={!editable}
            />

            <label>Localidad</label>
            <select
              value={localidadId}
              onChange={e => setLocalidadId(Number(e.target.value))}
              disabled={!editable}
            >
              <option value="" disabled>Seleccione localidad</option>
              {localidades.map(l => (
                <option key={l.id} value={l.id}>{l.nombre}</option>
              ))}
            </select>
          </fieldset>
        </div>
        <footer className="sm-footer">
          <button onClick={onClose}>Cancelar</button>
          {editable && (
            <button onClick={handleSubmit}>Guardar</button>
          )}
        </footer>
      </div>
    </div>
  );
}
