// src/components/Cliente/DomicilioModal.tsx
import { useState, useEffect } from 'react';
import type Domicilio from '../../entidades/Domicilio';
import type Localidad from '../../entidades/Localidad';
import {getLocalidades } from '../../services/FuncionesApi';
import '../../estilos/DomicilioModal.css';

interface Props {
  mode: 'view' | 'edit' | 'create';
  domicilio?: Domicilio;
  onClose: () => void;
  onSave: (d: Domicilio) => void;
}

export default function DomicilioModal({ mode, domicilio, onClose, onSave }: Props) {
  const editable = mode !== 'view';

  // campos básicos
  const [tipo, setTipo] = useState<string>('Casa');
  const [calle, setCalle] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [cp, setCp] = useState<string>('');

  // localidades
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadId, setLocalidadId] = useState<number|''>('');
  const [locError, setLocError] = useState<string|null>(null);

  // cargar lista de localidades
  useEffect(() => {
    getLocalidades()
      .then(setLocalidades)
      .catch(e => setLocError(e.message));
  }, []);

  // cuando cambie `domicilio`, prefijo los campos
  useEffect(() => {
    if (!domicilio) return;
    setTipo(domicilio.tipo || 'Casa');
    setCalle(domicilio.calle);
    setNumero(String(domicilio.numero));
    setCp(String(domicilio.cp));
    setLocalidadId(domicilio.localidad?.id ?? '');
  }, [domicilio]);

  const handleSubmit = () => {
    const d = domicilio ? { ...domicilio } as Domicilio : {} as Domicilio;
    d.tipo = tipo;
    d.calle = calle;
    d.numero = Number(numero);
    d.cp = Number(cp);
    d.localidad = localidades.find(l => l.id === localidadId)!;
    onSave(d);
  };

  return (
    <div className="dm-overlay">
      <div className="dm-modal">
        <header className="dm-header">
          <h3>
            {mode === 'create' ? 'Agregar Domicilio'
              : mode === 'edit' ? 'Modificar Domicilio'
              : 'Ver Domicilio'}
          </h3>
          <button className="dm-close" onClick={onClose}>×</button>
        </header>
        <div className="dm-body">
          <label>Tipo</label>
          <select disabled={!editable} value={tipo} onChange={e => setTipo(e.target.value)}>
            <option>Casa</option>
            <option>Oficina</option>
            <option>Otro</option>
          </select>

          <label>Calle</label>
          <input
            type="text"
            value={calle}
            onChange={e => setCalle(e.target.value)}
            readOnly={!editable}
          />

          <label>Número</label>
          <input
            type="text"
            value={numero}
            onChange={e => setNumero(e.target.value)}
            readOnly={!editable}
          />

          <label>Código Postal</label>
          <input
            type="text"
            value={cp}
            onChange={e => setCp(e.target.value)}
            readOnly={!editable}
          />

          <label>Localidad</label>
          {locError ? (
            <p className="dm-error">Error al cargar localidades</p>
          ) : (
            <select
              disabled={!editable}
              value={localidadId}
              onChange={e => setLocalidadId(Number(e.target.value))}
            >
              <option value="" disabled>Seleccione una localidad</option>
              {localidades.map(l => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <footer className="dm-footer">
          <button className="dm-btn dm-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          {editable && (
            <button className="dm-btn dm-btn-save" onClick={handleSubmit}>
              Guardar
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
