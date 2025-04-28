import Logo from '../../assets/Aliado.jpeg';

export const navbarAliado = {
    usuario: {
      idUsuario: 2,
      nombre: "Aliado",
      foto: Logo
    },
    notificaciones: [
      {
        title: "Apoyo registrado con éxito",
        description: "Tu donación de equipo de cómputo ha sido registrada correctamente.",
        time: "Hace 15 minutos",
        icon: "fa-check-circle",
        color: "success"
      },
      {
        title: "Proyecto aprobado",
        description: "Tu proyecto 'Biblioteca Digital' ha sido aprobado por el administrador.",
        time: "Hace 2 horas",
        icon: "fa-clipboard-check",
        color: "primary"
      },
      {
        title: "Nueva vinculación",
        description: "Has sido vinculado con Escuela Primaria Vicente Guerrero para el proyecto de equipamiento.",
        time: "Hace 1 día",
        icon: "fa-handshake",
        color: "info"
      },
      {
        title: "Solicitud de modificación",
        description: "Se requieren ajustes en tu propuesta de 'Talleres de Robótica'.",
        time: "Hace 2 días",
        icon: "fa-edit",
        color: "warning"
      }
      
    ],
    menuItems: [
        { text: "Mi perfil", icon: "fa-user", href: "#perfil" },
        { text: "Mis apoyos", icon: "fa-list-ul", href: "#apoyos" },
        { text: "Mis proyectos", icon: "fa-briefcase", href: "#proyectos" },
        { text: "Configuración", icon: "fa-cog", href: "#configuracion" },
        { text: "Cerrar sesión", icon: "fa-sign-out-alt", href: "#logout" }
    ]
  };