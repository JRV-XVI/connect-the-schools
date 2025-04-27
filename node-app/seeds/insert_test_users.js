/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Borra todos los registros existentes
  await knex('usuario').del();
  await knex('perfilEscuela').del()
  await knex('perfilAliado').del()

  // Inserta los usuarios de prueba
  await knex('usuario').insert([
    {
      idUsuario: 1,
      correo: 'escuela@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-24',
      telefono: '1234567890',
      nombre: 'Escuela Test',
      tipoPerfil: 1,
      direccion: 'Dirección Escuela'
    },
    {
      idUsuario: 2,
      correo: 'aliado@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-24',
      telefono: '0987654321',
      nombre: 'Aliado Test',
      tipoPerfil: 2,
      direccion: 'Dirección Aliado'
    },
    {
      idUsuario: 3,
      correo: 'admin@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-24',
      telefono: '1122334455',
      nombre: 'Admin Test',
      tipoPerfil: 3,
      direccion: 'Dirección Admin'
    }
  ]);


  // Inserta los perfiles aliados después de los usuarios
  await knex('perfilAliado').insert([
    {
      rfc: "RFC800207",
      idUsuario: 2,
      razonSocial: 'Primaria',
      telefono: '3347194761',
      correoRepresentante: 'ceo@outlook.com'
    }
  ]);


  await knex('perfilEscuela').insert([
    {
      cct: "CCT00900D",
      idUsuario: 1,
      nivelEducativo: 'Primaria',
      sector: 'Publico',
      numeroEstudiantes: 100,
      nombreDirector: 'Jose Ramos',
      telefonoDirector: '4457391047',
    }
  ]);
};
