import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';

const MapaGoogle = ({ tipo }) => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 20.6597, lng: -103.3496 }); // Inicializa en Guadalajara
    const [geocoder, setGeocoder] = useState(null); // Estado para almacenar el geocodificador

    const containerStyle = {
        width: '100%',
        height: '500px',
    };

    const handleMapLoad = () => {
        setGeocoder(new window.google.maps.Geocoder());
    };

    const geocodeAddress = async (direccion) => {
        if (!geocoder) {
            console.error('Geocoder no está inicializado');
            return null;
        }

        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: direccion }, (results, status) => {
                if (status === 'OK') {
                    const { lat, lng } = results[0].geometry.location;
                    resolve({ lat: lat(), lng: lng() });
                } else {
                    console.error('Error al geocodificar dirección:', status);
                    reject(status);
                }
            });
        });
    };

    useEffect(() => {
        const endpoint =
            tipo === "admin"
                ? "http://localhost:4001/api/ubicaciones"
                : tipo === "aliados"
                    ? "http://localhost:4001/api/escuelas/ubicaciones"
                    : "http://localhost:4001/api/aliados/ubicaciones";


        fetch(endpoint)
            .then((response) => response.json())
            .then(async (data) => {
                if (Array.isArray(data)) {
                    const ubicacionesConCoordenadas = await Promise.all(
                        data.map(async (item) => {
                            const direccion = `${item.calle}, ${item.codigoPostal}, ${item.ciudad}, ${item.estado}`;
                            const coordenadas = await geocodeAddress(direccion);

                            let tipoItem = "desconocido";
                            if (tipo === "admin") {
                                tipoItem = item.nombre_escuela ? "escuela" : "aliado";
                            } else if (tipo === "aliados") {
                                tipoItem = "escuela";
                            } else if (tipo === "escuelas") {
                                tipoItem = "aliado";
                            }

                            return { ...item, ...coordenadas, tipo: tipoItem };
                        })
                    );
                    setUbicaciones(ubicacionesConCoordenadas);
                } else {
                    console.error('El formato de datos no es válido:', data);
                }
            })
            .catch((error) => console.error('Error al cargar ubicaciones:', error));
    }, [tipo, geocoder]);

    return (
        <LoadScript googleMapsApiKey="apikey">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                onLoad={handleMapLoad}
            >
                {ubicaciones.map((item) => (
                    <Marker
                        key={item.id}
                        position={{ lat: item.lat, lng: item.lng }}
                        icon={{
                            url: item.tipo === 'escuela' ? '/icons/school-marker.png' : '/icons/aliado-marker.png',
                            scaledSize: { width: 50, height: 50 },
                        }}
                        onClick={() => {
                            setSelectedItem(item);
                            setMapCenter({ lat: item.lat, lng: item.lng });
                        }}
                    />
                ))}

                {selectedItem && (
                    <InfoWindow
                        position={{
                            lat: selectedItem.lat,
                            lng: selectedItem.lng,
                        }}
                        onCloseClick={() => setSelectedItem(null)}
                    >
                        <div>
                            <h4>{selectedItem.nombre_escuela || selectedItem.nombre_aliado}</h4>
                            <p>ID: {selectedItem.id}</p>
                            <p>Tipo: {selectedItem.tipo === 'escuela' ? 'Escuela' : 'Aliado'}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapaGoogle;
