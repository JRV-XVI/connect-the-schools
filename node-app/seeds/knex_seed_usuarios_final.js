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
      correo: 'escuela@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-24',
      telefono: '1234567890',
      nombre: 'Escuela Test',
      tipoPerfil: 1,
      calle: "Avenida Durango 1250",
      codigoPostal: "46688",
      ciudad: "Arandas",
      estado: "Jalisco"
    },
    {
      correo: 'aliado@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-24',
      telefono: '0987654321',
      nombre: 'Aliado Test',
      tipoPerfil: 2,
      calle: "Boulevard Grecia 60",
      codigoPostal: "47157",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: 'admin@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-24',
      telefono: '1122334455',
      nombre: 'Admin Test',
      tipoPerfil: 3,
      calle: "Circunvalación Guinea 1678",
      codigoPostal: "49420",
      ciudad: "Guadalajara",
      estado: "Jalisco"
    },
    {
      correo: 'escuela2@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-25',
      telefono: '5544332211',
      nombre: 'Escuela Secundaria',
      tipoPerfil: 1,
      calle: "Callejón Moya 2178",
      codigoPostal: "45003",
      ciudad: "Arandas",
      estado: "Jalisco"
    },
    {
      correo: 'escuela3@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-26',
      telefono: '6677889900',
      nombre: 'Preparatoria Técnica',
      tipoPerfil: 1,
      calle: "Callejón Norte Navarrete 10",
      codigoPostal: "46658",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: 'aliado2@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-25',
      telefono: '9988776655',
      nombre: 'Empresa Aliada',
      tipoPerfil: 2,
      "calle": "Viaducto Sur Montes 387",
      codigoPostal: "46234",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: 'aliado3@test.com',
      contraseña: '123456',
      estadoCuenta: false,
      fechaCreacion: '2025-04-26',
      telefono: '1231231234',
      nombre: 'Fundación Educativa',
      tipoPerfil: 2,
      calle: "Calle Jalisco 674",
      codigoPostal: "47829",
      ciudad: "Puerto Vallarta",
      estado: "Jalisco"
    }
  ]);


  // Inserta los perfiles aliados después de los usuarios
  await knex('perfilAliado').insert([
    {
      rfc: "RFC800207",
      idUsuario: 2,
      razonSocial: 'Empresa Constructora SA',
      telefono: '123456789',
      correoRepresentante: 'ceo@outlook.com'
    },
    {
      rfc: "RFC567890",
      idUsuario: 6,
      razonSocial: 'Tecnología Educativa SA',
      telefono: '987654321',
      correoRepresentante: 'contacto@tecnedu.com'
    },
    {
      rfc: "RFC123456",
      idUsuario: 7,
      razonSocial: 'Fundación Educativa Nacional',
      telefono: '555123456',
      correoRepresentante: 'fundacion@educativa.org'
    }
  ]);

  // Inserta los perfiles escuelas despues de aliados
  await knex('perfilEscuela').insert([
    {
      cct: "CCT00900D",
      idUsuario: 1,
      nivelEducativo: 'Primaria',
      sector: 'Publico',
      numeroEstudiantes: 100,
      nombreDirector: 'Jose Ramos',
      telefonoDirector: '456789123',
    },
    {
      cct: "CCT12345E",
      idUsuario: 4,
      nivelEducativo: 'Secundaria',
      sector: 'Publico',
      numeroEstudiantes: 250,
      nombreDirector: 'María González',
      telefonoDirector: '789456123',
    },
    {
      cct: "CCT67890F",
      idUsuario: 5,
      nivelEducativo: 'Preparatoria',
      sector: 'Privado',
      numeroEstudiantes: 180,
      nombreDirector: 'Roberto Sánchez',
      telefonoDirector: '321654987',
    }
  ]);

  console.log('Se insertaron 7 usuarios, 3 aliados, 3 escuelas y un administrador');
};
