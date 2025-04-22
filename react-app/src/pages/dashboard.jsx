import React, { useEffect, useState } from "react";
import axios from "axios";
import BarraNavegacion from "./components/BarraNavegacion";

import { navbarAdministrador } from "./data/navItems"; // tu estructura base

const Dashboard = () => {
  const [datosNavbar, setDatosNavbar] = useState(navbarAdministrador);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await axios.get('http://localhost:4001/api/usuarios');
        const nuevosUsuarios = res.data;

        if (nuevosUsuarios && nuevosUsuarios.length > 0) {
          const nuevasNotificaciones = nuevosUsuarios.map((usuario, index) => ({
            id: Date.now() + index,
            title: 'Nuevo usuario registrado',
            description: `El usuario ${usuario.nombre} fue creado.`,
            time: 'Hace unos segundos',
            icon: 'fa-user-plus',
            color: 'info',
            unread: true,
            url: '/admin/usuarios'
          }));

          setDatosNavbar(prev => ({
            ...prev,
            notificaciones: [...nuevasNotificaciones, ...prev.notificaciones]
          }));
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    obtenerUsuarios();
  }, []);

  return (
    <BarraNavegacion
      tipoUsuario={datosNavbar.tipoUsuario}
      usuario={datosNavbar.usuario}
      notificaciones={datosNavbar.notificaciones}
      menuItems={datosNavbar.menuItems}
      logo={datosNavbar.logo}
    />
  );
};

export default Dashboard;
