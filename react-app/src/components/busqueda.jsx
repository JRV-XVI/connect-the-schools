import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { get, post } from '../api';

const Busqueda = ({
  titulo = "Búsqueda de Escuelas",
  resultados = [],
  opcionesFiltros = {},
  onFilterChange = () => { },
  onMapView = () => { },
  onVincular = () => { },
  onVerDetalles = () => { },
  onPageChange = () => { },
  paginaActual = 1,
  totalPaginas = 1,
  cargando: externalLoading = false,
  apoyosDisponibles = [],
  userData = null  // Cambiado de userId a userData para ser consistente
}) => {
  // Estados para datos reales y carga
  const [escuelasCompatibles, setEscuelasCompatibles] = useState([]);
  const [escuelasParaMostrar, setEscuelasParaMostrar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filtros, setFiltros] = useState({
    nivelEducativo: "",
    tipoNecesidad: "",
    municipio: "",
    urgencia: "",
    matriculaMin: "",
    matriculaMax: "",
    soloCompatibles: false
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estado de paginación local
  const [paginaLocal, setPaginaLocal] = useState(1);
  const escuelasPorPagina = 3;
  const [totalPaginasLocal, setTotalPaginasLocal] = useState(1);

  const [apoyosFiltrados, setApoyosFiltrados] = useState([]);

  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);

  // Estados para modal de vinculación
  const [showVinculacionModal, setShowVinculacionModal] = useState(false);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    necesidadSeleccionada: "",
    descripcionServicios: "", // Este campo ahora contendrá tanto el interés como la descripción
    apoyoSeleccionado: "",
    documentos: []
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referencias para evitar dependencias cíclicas
  const onFilterChangeRef = useRef(onFilterChange);
  const filtrosRef = useRef(filtros);

  // Actualizar referencias cuando cambian los props
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
    filtrosRef.current = filtros;
  }, [onFilterChange, filtros]);

  // Función para obtener necesidades compatibles
  // Reemplazar la función fetchEscuelasCompatibles con esta nueva implementación
  // ...existing code...
  const fetchEscuelasCompatibles = async () => {
    try {
      setLoading(true);

      if (!userData || !userData.idUsuario) {
        console.warn("No hay ID de usuario disponible para buscar necesidades compatibles");
        setError("No se puede identificar el usuario para buscar escuelas compatibles");
        return [];
      }

      // Revisar el tipo y valor del ID antes de enviarlo
      const userId = parseInt(userData.idUsuario, 10);
      console.log("Enviando solicitud con ID de usuario:", userId, "tipo:", typeof userId);

      // Usar POST en lugar de GET y enviar datos más completos
      const necesidades = await post("/lista/necesidad", {
        idUsuario: userId,
        tipoUsuario: userData.tipoUsuario || "aliado",
        filtros: {} // Si el endpoint espera parámetros de filtrado
      });

      console.log("Escuelas y necesidades obtenidas:", necesidades);

      if (!necesidades || necesidades.length === 0) {
        setError("No se encontraron escuelas disponibles");
        return [];
      }

      // Agrupar necesidades por escuela (CCT)
      const escuelasPorCCT = {};

      // Recorrer todas las necesidades y agruparlas por CCT
      necesidades.forEach(necesidad => {
        const cct = necesidad.cct;

        if (!escuelasPorCCT[cct]) {
          // First need for this school - create the base structure
          escuelasPorCCT[cct] = {
            id: cct,
            cct: cct,
            nombre: necesidad.nombre || `Escuela ${cct}`,
            nivelEducativo: necesidad.nivelEducativo || "No especificado",
            matricula: necesidad.numeroEstudiantes || 0,
            sector: necesidad.sector || "No especificado",
            // Asegurarnos de capturar todas las posibles variaciones del nombre del director
            nombreDirector: necesidad.nombreDirector || "No especificado",
            telefonoDirector: necesidad.telefonoDirector || "No especificado",
            calle: necesidad.calle || "Sin información de ubicación",
            compatibilidad: 'total',
            necesidades: []
          };
        }

        // Verificar si esta necesidad ya existe en el arreglo de necesidades de la escuela
        const necesidadExistente = escuelasPorCCT[cct].necesidades.find(
          n => n.idNecesidadApoyo === necesidad.idNecesidadApoyo
        );


        // Solo agregar si no existe ya
        if (!necesidadExistente) {
          escuelasPorCCT[cct].necesidades.push({
            id: necesidad.idNecesidadApoyo,
            idNecesidadApoyo: necesidad.idNecesidadApoyo,
            nombre: `${necesidad.categoria || ''} - ${necesidad.subcategoria || ''}`.trim(),
            descripcion: necesidad.descripcion || "Sin descripción",
            prioridad: necesidad.prioridad || 5,
            color: getPriorityColor(necesidad.prioridad)
          });
        }
      });

      // Convertir el objeto a un arreglo de escuelas
      const escuelasFormateadas = Object.values(escuelasPorCCT);

      console.log("Escuelas procesadas:", escuelasFormateadas);

      return escuelasFormateadas;
    } catch (error) {
      console.error("Error al obtener escuelas compatibles:", error);
      setError("No se pudieron cargar las escuelas compatibles");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // ...existing code...
  // Función auxiliar para asignar colores según prioridad
  const getPriorityColor = (prioridad) => {
    const priority = parseInt(prioridad, 10);
    if (priority >= 8) return 'danger';
    if (priority >= 5) return 'warning';
    return 'info';
  };

  useEffect(() => {
    const loadEscuelas = async () => {
      try {
        // Obtener todas las escuelas con necesidades compatibles
        const escuelasCompatibles = await fetchEscuelasCompatibles();

        if (!escuelasCompatibles || escuelasCompatibles.length === 0) {
          setError("No se encontraron escuelas compatibles");
          setLoading(false);
          return;
        }

        // Ya tenemos las escuelas procesadas, podemos usarlas directamente
        console.log("Escuelas procesadas de la base de datos:", escuelasCompatibles);

        // Guardar escuelas en estado local
        setEscuelasCompatibles(escuelasCompatibles);

        // Calcular total de páginas
        setTotalPaginasLocal(Math.ceil(escuelasCompatibles.length / escuelasPorPagina));

        // Actualizar escuelas a mostrar según paginación
        const startIndex = (paginaLocal - 1) * escuelasPorPagina;
        setEscuelasParaMostrar(escuelasCompatibles.slice(startIndex, startIndex + escuelasPorPagina));

        // Informar al componente padre
        if (typeof onFilterChange === 'function') {
          onFilterChange({ escuelasDB: escuelasCompatibles });
        }
      } catch (error) {
        console.error("Error al cargar datos de escuelas:", error);
        setError("Error al procesar los datos de escuelas");
      } finally {
        setLoading(false);
      }
    };
    loadEscuelas();
  }, []);

  // First useEffect for filtering apoyos when necesidadSeleccionada changes
  useEffect(() => {
    if (!formData.necesidadSeleccionada) {
      setApoyosFiltrados([]);
      return;
    }

    // Encontrar la necesidad seleccionada
    const necesidadSeleccionada = escuelaSeleccionada?.necesidades.find(
      n => (n.id || n.idNecesidad || n.idNecesidadApoyo) == formData.necesidadSeleccionada
    );

    if (!necesidadSeleccionada) {
      setApoyosFiltrados([]);
      return;
    }

    // Obtener la categoría y subcategoría de la necesidad
    const nombrePartes = necesidadSeleccionada.nombre.split(' - ');
    const categoriaNecesidad = nombrePartes[0];
    const subcategoriaNecesidad = nombrePartes[1];

    console.log(`Filtrando apoyos por categoría: ${categoriaNecesidad} y subcategoría: ${subcategoriaNecesidad}`);

    // Filtrar apoyos por categoría y subcategoría
    const apoyosCompatibles = apoyosDisponibles.filter(apoyo => {
      // Si tiene directamente campos de categoría y subcategoría
      if (apoyo.categoria && apoyo.subcategoria) {
        return apoyo.categoria === categoriaNecesidad &&
          apoyo.subcategoria === subcategoriaNecesidad;
      }

      // Si la info está en el título/nombre con formato similar "Categoría - Subcategoría"
      const titulo = apoyo.titulo || apoyo.nombre || '';
      if (titulo.includes(' - ')) {
        const [categoriaApoyo, subcategoriaApoyo] = titulo.split(' - ');
        return categoriaApoyo === categoriaNecesidad &&
          subcategoriaApoyo === subcategoriaNecesidad;
      }

      return false;
    });

    console.log(`Apoyos compatibles encontrados: ${apoyosCompatibles.length}`);
    setApoyosFiltrados(apoyosCompatibles);

    // Limpiar la selección de apoyo si el actual ya no está entre los compatibles
    const apoyoActualEsCompatible = apoyosCompatibles.some(
      a => (a.id || a.idApoyo) == formData.apoyoSeleccionado
    );

    if (!apoyoActualEsCompatible && formData.apoyoSeleccionado) {
      setFormData(prev => ({
        ...prev,
        apoyoSeleccionado: ""
      }));
    }
  }, [formData.necesidadSeleccionada, escuelaSeleccionada, apoyosDisponibles]);

  // Second useEffect - separated out as its own top-level hook
  useEffect(() => {
    const cargarSolicitudesExistentes = async () => {
      if (!userData?.idUsuario) return;

      try {
        // Get existing vinculaciones for this user
        const response = await get(`/vinculacion/usuario/${userData.idUsuario}`);
        console.log("Solicitudes existentes cargadas:", response);

        // Extract the key information we need to prevent duplicates
        const solicitudesPendientes = response.map(sol => ({
          cct: sol.cct,
          idNecesidad: sol.idNecesidad
        }));

        setSolicitudesEnviadas(solicitudesPendientes);
      } catch (error) {
        console.error("Error al cargar solicitudes existentes:", error);
      }
    };

    cargarSolicitudesExistentes();
  }, [userData?.idUsuario]);
  // Efecto para manejar cambios de página
  useEffect(() => {
    if (escuelasCompatibles.length > 0) {
      const startIndex = (paginaLocal - 1) * escuelasPorPagina;
      setEscuelasParaMostrar(escuelasCompatibles.slice(startIndex, startIndex + escuelasPorPagina));
    }
  }, [paginaLocal, escuelasCompatibles]);

  // Handler para cambio de página local
  const handlePageChangeLocal = (newPage) => {
    setPaginaLocal(newPage);
  };

  // Resto de funciones para el modal, etc.
  const handleOpenVinculacionModal = (escuela) => {
    setEscuelaSeleccionada(escuela);
    setShowVinculacionModal(true);
  };

  const handleCloseVinculacionModal = () => {
    setShowVinculacionModal(false);
    setEscuelaSeleccionada(null);
    setFormData({
      necesidadSeleccionada: "",
      mensajeInteres: "",
      apoyoSeleccionado: "",
      descripcionServicios: "",
      documentos: []
    });
    setValidationErrors({});
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar errores al cambiar el valor
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.necesidadSeleccionada) {
      errors.necesidadSeleccionada = 'Debe seleccionar una necesidad a atender';
    }

    if (!formData.apoyoSeleccionado) {
      errors.apoyoSeleccionado = 'Debe seleccionar un apoyo de su perfil';
    }

    if (!formData.descripcionServicios.trim()) {
      errors.descripcionServicios = 'Debe proporcionar una descripción de su interés y los servicios ofrecidos';
    }

    return errors;
  };

  const handleSubmitVinculacion = async (e) => {
    e.preventDefault();

    // Validación del formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Verificar que tenemos datos del usuario
    if (!userData || !userData.idUsuario) {
      setValidationErrors({
        submit: "No se puede identificar el usuario. Por favor inicie sesión nuevamente."
      });
      return;
    }

    // Encontrar necesidad seleccionada
    const necesidadSeleccionada = escuelaSeleccionada.necesidades.find(
      n => (n.id || n.idNecesidadApoyo) == formData.necesidadSeleccionada
    );

    const idNecesidad = parseInt(necesidadSeleccionada?.idNecesidadApoyo || formData.necesidadSeleccionada, 10);

    // Verificar si ya existe una solicitud para esta necesidad
    const solicitudExistente = solicitudesEnviadas.some(sol =>
      sol.cct === escuelaSeleccionada.cct &&
      sol.idNecesidad === idNecesidad
    );

    if (solicitudExistente) {
      setValidationErrors({
        submit: "Ya has enviado una solicitud para esta necesidad. Por favor espera la respuesta o selecciona otra necesidad."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Find selected support
      const apoyoSeleccionado = apoyosDisponibles.find(
        a => (a.id || a.idApoyo) == formData.apoyoSeleccionado
      );

      const vinculacionData = {
        idUsuario: userData.idUsuario,
        rfc: userData.rfc,
        cct: escuelaSeleccionada.cct,
        idNecesidad: idNecesidad,
        idApoyo: parseInt(apoyoSeleccionado?.idNecesidadApoyo || formData.apoyoSeleccionado, 10),
        observacion: formData.descripcionServicios || "Sin observaciones",
      };

      console.log("Enviando datos a la base de datos:", vinculacionData);

      // Send data to API
      const response = await post('/vinculacion', vinculacionData);
      console.log("Vinculación registrada en base de datos:", response);

      // Update local state to prevent duplicate requests
      setSolicitudesEnviadas(prev => [
        ...prev,
        {
          cct: escuelaSeleccionada.cct,
          idNecesidad: idNecesidad
        }
      ]);

      // Obtener los datos del usuario directamente de la base de datos
      const usuarioInfo = await get(`/usuario/${userData.idUsuario}`);
      const nombreUsuario = usuarioInfo?.nombre || "Usuario aliado";

      // 1. Notificación al administrador
      const notificacionAdmin = {
        idUsuario: 3, // Identificador para administradores
        titulo: "Nueva solicitud de vinculación",
        mensaje: `El aliado ${nombreUsuario} (${userData?.rfc || 'Sin RFC'}) ha solicitado vincularse con la escuela ${escuelaSeleccionada.nombre} (${escuelaSeleccionada.cct})`
      };

      // 2. Notificación a la escuela
      const notificacionEscuela = {
        cct: escuelaSeleccionada.cct,
        titulo: "Nuevo interés en tu necesidad",
        mensaje: `El aliado ${nombreUsuario} ha mostrado interés en atender una necesidad de tu escuela. Un administrador revisará la propuesta.`
      };

      try {
        // Enviar notificaciones
        await post('/notificacion', notificacionAdmin);
        console.log("Notificación enviada al administrador");

        await post('/notificacion', notificacionEscuela);
        console.log("Notificación enviada a la escuela");
      } catch (errorNotif) {
        console.error("Error al enviar notificaciones:", errorNotif);
        // No detenemos el flujo si fallan las notificaciones
      }

      // Para el componente padre - incluir los documentos seleccionados
      const fullData = {
        escuela: {
          id: escuelaSeleccionada.id,
          cct: escuelaSeleccionada.cct,
          nombre: escuelaSeleccionada.nombre
        },
        necesidad: {
          id: formData.necesidadSeleccionada,
          nombre: necesidadSeleccionada?.nombre || '',
          tipo: necesidadSeleccionada?.tipo || '',
          idNecesidadApoyo: necesidadSeleccionada?.idNecesidadApoyo || formData.necesidadSeleccionada
        },
        apoyo: {
          id: formData.apoyoSeleccionado,
          titulo: apoyoSeleccionado?.titulo || '',
          tipo: apoyoSeleccionado?.tipo || '',
          idApoyo: apoyoSeleccionado?.idApoyo || formData.apoyoSeleccionado
        },
        detalles: {
          descripcion: formData.descripcionServicios,
          documentos: formData.documentos.map(file => file.name),
          fechaSolicitud: new Date().toISOString()
        },
        resultado: response
      };

      onVincular(escuelaSeleccionada, fullData);
      handleCloseVinculacionModal();

      // Optional: refresh the schools list to reflect the updated state
      const escuelasActualizadas = await fetchEscuelasCompatibles();
      setEscuelasCompatibles(escuelasActualizadas);
      const startIndex = (paginaLocal - 1) * escuelasPorPagina;
      setEscuelasParaMostrar(escuelasActualizadas.slice(startIndex, startIndex + escuelasPorPagina));

    } catch (error) {
      // Your existing error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones de filtrado
  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);
  };

  const aplicarFiltros = () => {
    onFilterChange(filtros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      nivelEducativo: "",
      tipoNecesidad: "",
      municipio: "",
      urgencia: "",
      matriculaMin: "",
      matriculaMax: "",
      soloCompatibles: false
    };
    setFiltros(filtrosLimpios);
    onFilterChange(filtrosLimpios);
  };

  const getBadgeColor = (nivel) => {
    const colores = {
      'Primaria': 'primary',
      'Secundaria': 'success',
      'Preescolar': 'info',
      'default': 'secondary'
    };
    return colores[nivel] || colores.default;
  };

  // Renderizado de resultados
  const renderResultado = (resultado) => {
    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card school-card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">{resultado.nombre}</h5>
              <span className={`badge bg-${getBadgeColor(resultado.nivelEducativo)}`}>
                {resultado.nivelEducativo}
              </span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-map-marker-alt text-danger me-2"></i>
              <small className="text-muted">{resultado.calle}</small>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Número de estudiantes:</span>
                <strong>{resultado.matricula} alumnos</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Sector:</span>
                <strong>{resultado.sector}</strong>
              </div>
              {resultado.nombreDirector && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Director:</span>
                  <strong>{resultado.nombreDirector}</strong>
                </div>
              )}
            </div>
            <h6 className="mb-2">Necesidades prioritarias:</h6>
            <div className="mb-3">
              {resultado.necesidades.map((necesidad, i) => (
                <span key={i} className={`badge bg-${necesidad.color} category-badge me-1 mb-1`}>
                  {necesidad.nombre}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              {resultado.compatibilidad === 'total' ? (
                <span className="text-success">
                  <i className="fas fa-check-circle me-1"></i> Compatible con sus ofertas
                </span>
              ) : resultado.compatibilidad === 'parcial' ? (
                <span className="text-secondary">
                  <i className="fas fa-info-circle me-1"></i> Compatibilidad parcial
                </span>
              ) : (
                <span className="text-muted">
                  <i className="fas fa-times-circle me-1"></i> No compatible
                </span>
              )}

              {resultado.compatibilidad === 'total' ? (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleOpenVinculacionModal(resultado)}
                >
                  <i className="fas fa-handshake me-1"></i> Vincular
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onVerDetalles(resultado)}
                >
                  <i className="fas fa-eye me-1"></i> Ver detalles
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-5 pt-5">
      {/* El resto del JSX se mantiene igual... */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{titulo}</h2>
        <div>
        </div>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="mb-4">
          <div className="card school-filter-panel">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nivel educativo</label>
                  <select
                    className="form-select"
                    value={filtros.nivelEducativo}
                    onChange={(e) => handleFiltroChange('nivelEducativo', e.target.value)}
                  >
                    <option value="">Todos</option>
                    {opcionesFiltros.nivelesEducativos?.map((nivel, i) => (
                      <option key={i} value={nivel.valor}>{nivel.nombre}</option>
                    ))}
                  </select>
                </div>
                {/* Resto de filtros... */}
                {/* Mantener igual */}
                <div className="col-12 d-flex justify-content-end">
                  <button
                    className="btn btn-light me-2"
                    onClick={limpiarFiltros}
                  >
                    Limpiar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={aplicarFiltros}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando escuelas compatibles...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      ) : escuelasParaMostrar.length > 0 ? (
        <div className="row">
          <div className="col-12 mb-3">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Mostrando escuelas compatibles con su perfil
            </div>
          </div>
          {escuelasParaMostrar.map(resultado => (
            <React.Fragment key={resultado.cct || resultado.id}>
              {renderResultado(resultado)}
            </React.Fragment>

          ))}
        </div>
      ) : (
        <div className="text-center my-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <p>No se encontraron escuelas compatibles con su perfil.</p>
        </div>
      )}

      {/* Paginación local */}
      {escuelasCompatibles.length > escuelasPorPagina && (
        <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${paginaLocal === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChangeLocal(paginaLocal - 1)}
                disabled={paginaLocal === 1}
              >
                Anterior
              </button>
            </li>

            {[...Array(totalPaginasLocal).keys()].map(numero => (
              <li key={numero} className={`page-item ${paginaLocal === (numero + 1) ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChangeLocal(numero + 1)}
                >
                  {numero + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${paginaLocal === totalPaginasLocal ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChangeLocal(paginaLocal + 1)}
                disabled={paginaLocal === totalPaginasLocal}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal de vinculación */}
      <Modal
        show={showVinculacionModal}
        onHide={handleCloseVinculacionModal}
        size="lg"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Vincular con {escuelaSeleccionada?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {escuelaSeleccionada && (
            <Form onSubmit={handleSubmitVinculacion}>
              <div className="mb-4">
                <h5>Datos de la escuela</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>CCT:</strong> {escuelaSeleccionada.cct}
                    </p>
                    <p className="mb-1">
                      <strong>Nivel:</strong> {escuelaSeleccionada.nivelEducativo}
                    </p>
                    <p className="mb-1">
                      <strong>Sector:</strong> {escuelaSeleccionada.sector}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Número de estudiantes:</strong> {escuelaSeleccionada.matricula} alumnos
                    </p>
                    <p className="mb-1">
                      <strong>Director:</strong> {escuelaSeleccionada.nombreDirector}
                    </p>
                    <p className="mb-1">
                      <strong>Calle:</strong> {escuelaSeleccionada.calle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Seleccione la necesidad que desea atender:</Form.Label>
                  <Form.Select
                    name="necesidadSeleccionada"
                    value={formData.necesidadSeleccionada}
                    onChange={handleFormChange}
                    isInvalid={!!validationErrors.necesidadSeleccionada}
                  >
                    <option value="">-- Seleccione una necesidad --</option>
                    {escuelaSeleccionada.necesidades.map((necesidad) => {
                      const idNecesidad = parseInt(necesidad.idNecesidadApoyo || necesidad.id, 10);
                      const solicitudPendiente = solicitudesEnviadas.some(sol =>
                        sol.cct === escuelaSeleccionada.cct &&
                        sol.idNecesidad === idNecesidad
                      );

                      return (
                        <option
                          key={necesidad.id}
                          value={necesidad.id}
                          disabled={solicitudPendiente}
                        >
                          {necesidad.nombre} {solicitudPendiente ? '(Solicitud ya enviada)' : `(Prioridad: ${necesidad.prioridad})`}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.necesidadSeleccionada}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="mb-4">
                <h5>Detalles del apoyo ofrecido</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Seleccione el apoyo que puede proporcionar:</Form.Label>
                  <Form.Select
                    name="apoyoSeleccionado"
                    value={formData.apoyoSeleccionado}
                    onChange={handleFormChange}
                    isInvalid={!!validationErrors.apoyoSeleccionado}
                    disabled={!formData.necesidadSeleccionada || apoyosFiltrados.length === 0}
                  >
                    <option value="">-- Seleccione un apoyo --</option>
                    {apoyosFiltrados.length > 0 ? (
                      apoyosFiltrados.map((apoyo) => {
                        // Determinamos el texto a mostrar con formato "Categoría - Subcategoría"
                        let displayText = '';

                        // Si tiene campos directos de categoría y subcategoría
                        if (apoyo.categoria && apoyo.subcategoria) {
                          displayText = `${apoyo.categoria} - ${apoyo.subcategoria}`;
                        }
                        // Si la info está en el título/nombre con formato similar
                        else {
                          const titulo = apoyo.titulo || apoyo.nombre || '';
                          if (titulo.includes(' - ')) {
                            displayText = titulo; // Ya tiene el formato correcto
                          } else {
                            displayText = titulo; // Usamos el título tal cual si no tiene el formato
                          }
                        }

                        return (
                          <option key={apoyo.id || apoyo.idApoyo} value={apoyo.id || apoyo.idApoyo}>
                            {displayText}
                          </option>
                        );
                      })
                    ) : formData.necesidadSeleccionada ? (
                      <option disabled value="">No hay apoyos compatibles con esta necesidad</option>
                    ) : null}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.apoyoSeleccionado}
                  </Form.Control.Feedback>
                  {formData.necesidadSeleccionada && apoyosFiltrados.length === 0 && (
                    <div className="text-warning mt-2">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      No se encontraron apoyos compatibles con esta necesidad. Por favor seleccione otra necesidad.
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descripcionServicios"
                    value={formData.descripcionServicios}
                    onChange={handleFormChange}
                    placeholder="Explique por qué le interesa atender esta necesidad y detalle los recursos o servicios específicos que puede ofrecer."
                    isInvalid={!!validationErrors.descripcionServicios}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.descripcionServicios}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {validationErrors.submit && (
                <div className="alert alert-danger mb-3">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {validationErrors.submit}
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVinculacionModal} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitVinculacion}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-handshake me-2"></i>
                Confirmar vinculación
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Busqueda;
