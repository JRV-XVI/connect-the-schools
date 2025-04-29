import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapaGoogle = () => {
    const [escuelas, setEscuelas] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);

    // Estilo del contenedor del mapa
    const containerStyle = {
        width: '100%',
        height: '500px',
    };

    // Coordenadas iniciales (CDMX)
    const center = {
        lat: 19.4326,
        lng: -99.1332,
    };

    useEffect(() => {
        fetch('http://localhost:4001/api/aliados/ubicaciones') // Endpoint correcto
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // Filtrar registros con coordenadas válidas
                    setEscuelas(data.filter((item) => item.latitud && item.longitud));
                } else {
                    console.error('El formato de datos no es válido:', data);
                }
            })
            .catch((error) => console.error('Error al cargar ubicaciones:', error));
    }, []);

    return (
        <LoadScript googleMapsApiKey="apikey">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
                {escuelas.map((escuela) => (
                    <Marker
                        key={escuela.cct}
                        position={{ lat: parseFloat(escuela.latitud), lng: parseFloat(escuela.longitud) }}
                        onClick={() => setSelectedSchool(escuela)}
                    />
                ))}

                {selectedSchool && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedSchool.latitud),
                            lng: parseFloat(selectedSchool.longitud),
                        }}
                        onCloseClick={() => setSelectedSchool(null)}
                    >
                        <div>
                            <h4>{selectedSchool.nombre_escuela}</h4> {/* Mostrar el nombre de la escuela */}
                            <p>CCT: {selectedSchool.cct}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapaGoogle;