import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function MapaGoogle({ lat, lng }: { lat: number; lng: number }) {
  return (
    <LoadScript googleMapsApiKey="AIzaSyACTocPOlHyRgbE8MTAxfXAR_0jlYMJnXQ">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={15}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
}
