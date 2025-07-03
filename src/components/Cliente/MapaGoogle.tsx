import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

type Props = {
  lat: number;
  lng: number;
};

export default function MapaGoogle({ lat, lng }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyACTocPOlHyRgbE8MTAxfXAR_0jlYMJnXQ',
  });

  if (!isLoaded) {
    return <p>Cargando mapa…</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={16}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}

