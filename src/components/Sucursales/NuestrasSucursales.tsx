import { useState, useEffect } from 'react';
import {
  getSucursales
} from '../../services/FuncionesApi';
import type Sucursal from '../../entidades/Sucursal';

import '../../estilos/NuestrasSucursales.css';
import MapaGoogle from '../Cliente/MapaGoogle';
import { DateTime } from 'luxon';

interface Coords { lat: number; lng: number; }

async function obtenerCoordenadas(direccion: string): Promise<Coords | null> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=AIzaSyACTocPOlHyRgbE8MTAxfXAR_0jlYMJnXQ`
  );
  const data = await res.json();
  if (data.status === 'OK') {
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  }
  console.error('Geocoding error', data.status);
  return null;
}

export default function NuestrasSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [coordsMap, setCoordsMap] = useState<Record<number, Coords>>({});
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await getSucursales();
      setSucursales(list);
      // geocode all at once
      const entries = await Promise.all(
        list.map(async s => {
          const dir = s.domicilio!;
          const str = `${dir.calle} ${dir.numero}, ${dir.localidad!.nombre}, ${dir.localidad!.provincia!.nombre}, ${dir.localidad!.provincia!.pais!.nombre}`;
          const c = await obtenerCoordenadas(str);
          return [s.id!, c] as [number, Coords | null];
        })
      );
      const m: Record<number, Coords> = {};
      for (const [id, c] of entries) {
        if (c) m[id] = c;
      }
      setCoordsMap(m);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="sl-loading">Cargando sucursales…</p>;

  return (
    <div className="sl-container">
      {sucursales.map(s => {
        const dir = s.domicilio!;
        const coords = coordsMap[s.id!];
        return (
          <section key={s.id} className="sl-section">
            <h3 className="sl-title">{s.nombre}</h3>
            <div className="sl-info">
              <div>
                <strong>Horario:</strong> {typeof s.horario_apertura === 'string'
                                    ? s.horario_apertura  // ya es "HH:mm:ss"
                                    : DateTime.fromJSDate(s.horario_apertura).toFormat('HH:mm')} - {typeof s.horario_cierre === 'string'
                    ? s.horario_cierre
                    : DateTime.fromJSDate(s.horario_cierre).toFormat('HH:mm')}
              </div>
              <div>
                <strong>Dirección:</strong> {dir.calle} {dir.numero}, CP {dir.cp} – {dir.localidad?.nombre}
              </div>
            </div>
            <div className="sl-map">
              {coords
                ? <MapaGoogle lat={coords.lat} lng={coords.lng} />
                : <p>No se pudo cargar el mapa</p>
              }
            </div>
          </section>
        );
      })}
    </div>
  );
}
