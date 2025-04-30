/**
     * @param { import('knex').Knex } knex
     */
    exports.seed = async function(knex) {
      await knex('proyecto').del();
      await knex('proyecto').insert([
  {
    "descripcion": "Proyecto piloto 1",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-30",
    "fechaFin": "2025-06-29"
  },
  {
    "descripcion": "Proyecto piloto 2",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-28",
    "fechaFin": "2025-06-30"
  },
  {
    "descripcion": "Proyecto piloto 3",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-26",
    "fechaFin": "2025-07-01"
  },
  {
    "descripcion": "Proyecto piloto 4",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-24",
    "fechaFin": "2025-07-02"
  },
  {
    "descripcion": "Proyecto piloto 5",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-22",
    "fechaFin": "2025-07-03"
  },
  {
    "descripcion": "Proyecto piloto 6",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-20",
    "fechaFin": "2025-07-04"
  },
  {
    "descripcion": "Proyecto piloto 7",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-18",
    "fechaFin": "2025-07-05"
  },
  {
    "descripcion": "Proyecto piloto 8",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-16",
    "fechaFin": "2025-07-06"
  },
  {
    "descripcion": "Proyecto piloto 9",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-14",
    "fechaFin": "2025-07-07"
  },
  {
    "descripcion": "Proyecto piloto 10",
    "validacionAdmin": true,
    "fechaCreacion": "2025-04-12",
    "fechaFin": "2025-07-08"
  }
]);
    };