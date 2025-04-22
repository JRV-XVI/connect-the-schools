import Logo from '../../assets/MPJ.png';

export const navbarAdministrador = {
  tipoUsuario: 'administrador',
  usuario: {
    nombre: 'Administrador Sistema',
    foto: Logo
  },
  notificaciones: [
    {
      id: 1,
      title: 'Nuevo registro de escuela',
      description: 'Escuela Secundaria Técnica #65 requiere validación.',
      time: 'Hace 30 minutos',
      icon: 'fa-user-plus',
      color: 'warning',
      unread: true,
      url: '/escuelas/pendientes/65'
    },
    {
      id: 2,
      title: 'Alerta de proyecto',
      description: 'Proyecto "Equipamiento de Biblioteca" ha excedido su fecha límite.',
      time: 'Hace 2 horas',
      icon: 'fa-exclamation-circle',
      color: 'danger',
      unread: true,
      url: '/proyectos/alertas/23'
    },
    {
      id: 3,
      title: 'Vinculación exitosa',
      description: 'Se ha confirmado la vinculación entre Empresa XYZ y Escuela Primaria Vicente Guerrero.',
      time: 'Hace 5 horas',
      icon: 'fa-check-circle',
      color: 'success',
      unread: false,
      url: '/vinculaciones/54'
    }
  ],
  menuItems: [
    { text: 'Mi Perfil', icon: 'fa-user', href: '/admin/perfil' },
    { text: 'Panel de Control', icon: 'fa-tachometer-alt', href: '/admin/dashboard' },
    { text: 'Configuración', icon: 'fa-cog', href: '/admin/configuracion' },
    { divider: true },
    { text: 'Cerrar Sesión', icon: 'fa-sign-out-alt', href: '/logout' }
  ],
  logo: '/assets/logo.png'
};