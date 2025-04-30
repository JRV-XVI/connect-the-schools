/**
     * @param { import('knex').Knex } knex
     */
    exports.seed = async function(knex) {
      await knex('necesidadApoyo').del();
      await knex('necesidadApoyo').insert([
  {
    "idUsuario": 7,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Requerimos sillas en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Requerimos luz en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 7,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Requerimos mesas en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Infraestructura",
    "subcategoria": "Pintura",
    "descripcion": "Requerimos pintura en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Requerimos literarios en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Requerimos sillas en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Requerimos baños en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 7,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Requerimos pizarrones en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 7,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Requerimos conectividad en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Infraestructura",
    "subcategoria": "Pintura",
    "descripcion": "Requerimos pintura en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Requerimos didácticos en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 1,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Requerimos luz en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 1,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 6,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Requerimos pizarrones en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Requerimos sillas en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Requerimos didácticos en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Requerimos literarios en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Requerimos sillas en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Requerimos luz en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Requerimos pizarrones en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 1,
    "categoria": "Infraestructura",
    "subcategoria": "Pintura",
    "descripcion": "Requerimos pintura en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 6,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Requerimos didácticos en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 7,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Requerimos didácticos en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Requerimos baños en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Requerimos mesas en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 7,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Requerimos conectividad en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Requerimos agua en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Requerimos pizarrones en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 1,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Requerimos conectividad en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 6,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Requerimos agua en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 6,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Requerimos didácticos en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Requerimos sillas en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Requerimos luz en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Requerimos literarios en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Requerimos literarios en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Requerimos didácticos en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 5,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Requerimos pizarrones en la escuela.",
    "prioridad": "Media",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Requerimos baños en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 1,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Requerimos luz en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Requerimos mesas en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 3,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Requerimos luz en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Infraestructura",
    "subcategoria": "Pintura",
    "descripcion": "Requerimos pintura en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 2,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Requerimos agua en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 8,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Requerimos tecnológico en la escuela.",
    "prioridad": "Baja",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 4,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Requerimos conectividad en la escuela.",
    "prioridad": "Alta",
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 14,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Ofrecemos apoyo con agua.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 12,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Ofrecemos apoyo con baños.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Ofrecemos apoyo con tecnológico.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 15,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Ofrecemos apoyo con agua.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 12,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Ofrecemos apoyo con pizarrones.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 12,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Ofrecemos apoyo con baños.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Ofrecemos apoyo con luz.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Ofrecemos apoyo con conectividad.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 10,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Ofrecemos apoyo con pizarrones.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 10,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Ofrecemos apoyo con mesas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 13,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Ofrecemos apoyo con mesas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Ofrecemos apoyo con sillas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Ofrecemos apoyo con luz.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 12,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Ofrecemos apoyo con literarios.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 13,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Ofrecemos apoyo con baños.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 13,
    "categoria": "Infraestructura",
    "subcategoria": "Baños",
    "descripcion": "Ofrecemos apoyo con baños.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Ofrecemos apoyo con sillas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Ofrecemos apoyo con luz.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 10,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Ofrecemos apoyo con sillas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Ofrecemos apoyo con agua.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Ofrecemos apoyo con tecnológico.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Ofrecemos apoyo con sillas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Ofrecemos apoyo con sillas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Ofrecemos apoyo con pizarrones.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 13,
    "categoria": "Materiales",
    "subcategoria": "Tecnológico",
    "descripcion": "Ofrecemos apoyo con tecnológico.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Mobiliario",
    "subcategoria": "Sillas",
    "descripcion": "Ofrecemos apoyo con sillas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Ofrecemos apoyo con luz.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 14,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Ofrecemos apoyo con pizarrones.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 10,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Ofrecemos apoyo con conectividad.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 15,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Ofrecemos apoyo con agua.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Ofrecemos apoyo con literarios.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 14,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Ofrecemos apoyo con mesas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Ofrecemos apoyo con luz.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 10,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Ofrecemos apoyo con literarios.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Infraestructura",
    "subcategoria": "Luz",
    "descripcion": "Ofrecemos apoyo con luz.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 9,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 15,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Ofrecemos apoyo con agua.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Materiales",
    "subcategoria": "Literarios",
    "descripcion": "Ofrecemos apoyo con literarios.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 16,
    "categoria": "Infraestructura",
    "subcategoria": "Agua",
    "descripcion": "Ofrecemos apoyo con agua.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 13,
    "categoria": "Mobiliario",
    "subcategoria": "Mesas",
    "descripcion": "Ofrecemos apoyo con mesas.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 11,
    "categoria": "Materiales",
    "subcategoria": "Didácticos",
    "descripcion": "Ofrecemos apoyo con didácticos.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 13,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Ofrecemos apoyo con conectividad.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 12,
    "categoria": "Mobiliario",
    "subcategoria": "Pizarrones",
    "descripcion": "Ofrecemos apoyo con pizarrones.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  },
  {
    "idUsuario": 14,
    "categoria": "Infraestructura",
    "subcategoria": "Conectividad",
    "descripcion": "Ofrecemos apoyo con conectividad.",
    "prioridad": null,
    "fechaCreacion": "2025-04-30T07:36:58.622134",
    "estadoValidacion": 0
  }
]);
    };