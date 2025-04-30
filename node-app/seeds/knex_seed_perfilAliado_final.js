/**
     * @param { import('knex').Knex } knex
     */
    exports.seed = async function(knex) {
      await knex('perfilAliado').del();
      await knex('perfilAliado').insert([
  {
    "rfc": "ECRZ153178HF",
    "idUsuario": 9,
    "razonSocial": "Organización Aliado 1",
    "telefono": "5418259760",
    "correoRepresentante": "contacto@aliado1.mx"
  },
  {
    "rfc": "KWLJ676728DX",
    "idUsuario": 10,
    "razonSocial": "Organización Aliado 2",
    "telefono": "3715623548",
    "correoRepresentante": "contacto@aliado2.mx"
  },
  {
    "rfc": "BHKT339348FO",
    "idUsuario": 11,
    "razonSocial": "Organización Aliado 3",
    "telefono": "3991088509",
    "correoRepresentante": "contacto@aliado3.mx"
  },
  {
    "rfc": "EJEK913586UI",
    "idUsuario": 12,
    "razonSocial": "Organización Aliado 4",
    "telefono": "7234649318",
    "correoRepresentante": "contacto@aliado4.mx"
  },
  {
    "rfc": "ZKVO282691CF",
    "idUsuario": 13,
    "razonSocial": "Organización Aliado 5",
    "telefono": "4522357397",
    "correoRepresentante": "contacto@aliado5.mx"
  },
  {
    "rfc": "FYQM149099IR",
    "idUsuario": 14,
    "razonSocial": "Organización Aliado 6",
    "telefono": "3782322225",
    "correoRepresentante": "contacto@aliado6.mx"
  },
  {
    "rfc": "TKYX296340OQ",
    "idUsuario": 15,
    "razonSocial": "Organización Aliado 7",
    "telefono": "7460964152",
    "correoRepresentante": "contacto@aliado7.mx"
  },
  {
    "rfc": "SEVN227768WG",
    "idUsuario": 16,
    "razonSocial": "Organización Aliado 8",
    "telefono": "0879929452",
    "correoRepresentante": "contacto@aliado8.mx"
  }
]);
    };