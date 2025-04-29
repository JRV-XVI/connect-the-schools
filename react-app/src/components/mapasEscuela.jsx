import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar ícono de marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapaEscuelas = () => {
    const [escuelas, setEscuelas] = useState([]);

    useEffect(() => {
        // Obtener ubicaciones desde el backend
        fetch('http://localhost:4001/api/escuelas/ubicaciones')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setEscuelas(data);
                } else {
                    console.error('El formato de datos no es válido:', data);
                    setEscuelas([]);
                }
            })
            .catch((error) => {
                console.error('Error al cargar ubicaciones:', error);
                setEscuelas([]);
            });
    }, []);

    return (
        <MapContainer center={[19.4326, -99.1332]} zoom={6} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {escuelas
                .filter((escuela) => escuela.latitud && escuela.longitud) // Filtrar registros con coordenadas válidas
                .map((escuela) => (
                    <Marker key={escuela.cct} position={[escuela.latitud, escuela.longitud]}>
                        <Popup>
                            <b>{escuela.nombre_escuela}</b>
                            <br />
                            CCT: {escuela.cct}
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
};

export default MapaEscuelas;