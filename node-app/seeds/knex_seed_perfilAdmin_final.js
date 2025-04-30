/**
     * @param { import('knex').Knex } knex
     */
    exports.seed = async function(knex) {
      await knex('perfilAdmin').del();
      await knex('perfilAdmin').insert([
  {
    "idUsuario": 17,
    "rol": "superadmin"
  }
]);
    };