import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapaGoogle = ({ tipo }) => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 20.6597, lng: -103.3496 }); // Inicializa en Guadalajara

    const containerStyle = {
        width: '100%',
        height: '500px',
    };

    useEffect(() => {
        const endpoint =
            tipo === "aliados"
                ? "http://localhost:4001/api/aliados/ubicaciones"
                : "http://localhost:4001/api/escuelas/ubicaciones";

        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setUbicaciones(data.filter((item) => item.latitud && item.longitud));
                } else {
                    console.error('El formato de datos no es válido:', data);
                }
            })
            .catch((error) => console.error('Error al cargar ubicaciones:', error));
    }, [tipo]);

    return (
        <LoadScript googleMapsApiKey="API">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter} // Usa el estado dinámico del centro
                zoom={12} // Ajusta el nivel de zoom según sea necesario
            >
                {ubicaciones.map((item) => (
                    <Marker
                        key={item.id}
                        position={{ lat: parseFloat(item.latitud), lng: parseFloat(item.longitud) }}
                        onClick={() => {
                            setSelectedItem(item);
                            setMapCenter({ lat: parseFloat(item.latitud), lng: parseFloat(item.longitud) }); // Actualiza el centro al marcador seleccionado
                        }}
                    />
                ))}

                {selectedItem && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedItem.latitud),
                            lng: parseFloat(selectedItem.longitud),
                        }}
                        onCloseClick={() => setSelectedItem(null)} // No cambia el centro al cerrar
                    >
                        <div>
                            <h4>{selectedItem.nombre_escuela || selectedItem.nombre_aliado}</h4>
                            <p>ID: {selectedItem.id}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapaGoogle;