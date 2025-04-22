import Logo from '../../assets/Escuela.png';

export const navbarEscuela = {
    usuario: {
      nombre: "Escuela",
      foto: Logo
    },
    notificaciones: [
      {
        title: "Necesidad aprobada",
        description: "Su solicitud de equipamiento de laboratorio ha sido aprobada.",
        time: "Hace 10 minutos",
        icon: "fa-check-circle",
        color: "success"
      },
      {
        title: "Proyecto iniciado",
        description: "El proyecto 'Biblioteca Digital' ha comenzado. Ver detalles.",
        time: "Hace 2 horas",
        icon: "fa-play-circle",
        color: "primary"
      },
      {
        title: "Vinculación con aliado",
        description: "Su escuela ha sido vinculada con Empresa XYZ para el proyecto de equipamiento.",
        time: "Hace 1 día",
        icon: "fa-handshake",
        color: "info"
      },
      {
        title: "Donación recibida",
        description: "Ha recibido una donación de material didáctico. Por favor confirme la recepción.",
        time: "Hace 3 días",
        icon: "fa-gift",
        color: "warning"
      },
      {
        title: "Seguimiento requerido",
        description: "Se requiere evidencia fotográfica del avance del proyecto 'Aula de cómputo'.",
        time: "Hace 1 semana",
        icon: "fa-clipboard-list",
        color: "danger"
      }
    ],
    menuItems: [
        { text: "Mi perfil", icon: "fa-user", href: "#perfil" },
        { text: "Mis necesidades", icon: "fa-list-ul", href: "#necesidades" },
        { text: "Mis proyectos", icon: "fa-project-diagram", href: "#proyectos" },
        { text: "Configuración", icon: "fa-cog", href: "#configuracion" },
        { text: "Cerrar sesión", icon: "fa-sign-out-alt", href: "#logout" },
    ]
  };