/**
     * @param { import('knex').Knex } knex
     */
    exports.seed = async function(knex) {
      await knex('perfilEscuela').del();
      await knex('perfilEscuela').insert([
  {
    "cct": "14DPR2001",
    "idUsuario": 1,
    "nivelEducativo": "Secundaria",
    "sector": "Público",
    "numeroEstudiantes": 234,
    "nombreDirector": "Humberto Tijerina Preciado",
    "telefonoDirector": "6629227363"
  },
  {
    "cct": "14DPR2002",
    "idUsuario": 2,
    "nivelEducativo": "Secundaria",
    "sector": "Público",
    "numeroEstudiantes": 195,
    "nombreDirector": "Trinidad Villalobos",
    "telefonoDirector": "1724246034"
  },
  {
    "cct": "14DPR2003",
    "idUsuario": 3,
    "nivelEducativo": "Primaria",
    "sector": "Público",
    "numeroEstudiantes": 132,
    "nombreDirector": "Hernán Camila Sanabria Escamilla",
    "telefonoDirector": "2642709075"
  },
  {
    "cct": "14DPR2004",
    "idUsuario": 4,
    "nivelEducativo": "Telesecundaria",
    "sector": "Público",
    "numeroEstudiantes": 232,
    "nombreDirector": "Mauricio Yolanda Armenta",
    "telefonoDirector": "4968806994"
  },
  {
    "cct": "14DPR2005",
    "idUsuario": 5,
    "nivelEducativo": "Preescolar",
    "sector": "Privado",
    "numeroEstudiantes": 284,
    "nombreDirector": "Sr(a). Anel Vela",
    "telefonoDirector": "2833297710"
  },
  {
    "cct": "14DPR2006",
    "idUsuario": 6,
    "nivelEducativo": "Telesecundaria",
    "sector": "Privado",
    "numeroEstudiantes": 97,
    "nombreDirector": "Marcos Chacón Marrero",
    "telefonoDirector": "7351084932"
  },
  {
    "cct": "14DPR2007",
    "idUsuario": 7,
    "nivelEducativo": "Preescolar",
    "sector": "Público",
    "numeroEstudiantes": 138,
    "nombreDirector": "Marisol Tamayo",
    "telefonoDirector": "1157705528"
  },
  {
    "cct": "14DPR2008",
    "idUsuario": 8,
    "nivelEducativo": "Secundaria",
    "sector": "Público",
    "numeroEstudiantes": 233,
    "nombreDirector": "Marcos Beatriz Saavedra",
    "telefonoDirector": "7048713661"
  }
]);
    };