/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Delete existing records in reverse dependency order
  await knex('perfilEscuela').del();
  await knex('perfilAliado').del();
  await knex('usuario').del();
  
  // Current date for fechaCreacion
  const currentDate = new Date().toISOString().split('T')[0];

  // Insert users - combining both original datasets
  const usuarios = await knex('usuario').insert([
    // Escuelas
    {
      correo: "escuela1@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "2749892799",
      nombre: "Escuela 1",
      tipoPerfil: 1,
      calle: "Avenida Durango 1250",
      codigoPostal: "46688",
      ciudad: "Arandas",
      estado: "Jalisco"
    },
    {
      correo: "escuela2@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "9723758223",
      nombre: "Escuela 2",
      tipoPerfil: 1,
      calle: "Boulevard Grecia 60",
      codigoPostal: "47157",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: "escuela3@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "9003802806",
      nombre: "Escuela 3",
      tipoPerfil: 1,
      calle: "Circunvalación Guinea 1678",
      codigoPostal: "49420",
      ciudad: "Guadalajara",
      estado: "Jalisco"
    },
    {
      correo: "escuela4@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "4975486421",
      nombre: "Escuela 4",
      tipoPerfil: 1,
      calle: "Callejón Moya 2178",
      codigoPostal: "45003",
      ciudad: "Arandas",
      estado: "Jalisco"
    },
    {
      correo: "escuela5@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "4820395721",
      nombre: "Escuela 5",
      tipoPerfil: 1,
      calle: "Callejón Norte Navarrete 10",
      codigoPostal: "46658",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: "escuela6@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "2463671885",
      nombre: "Escuela 6",
      tipoPerfil: 1,
      calle: "Viaducto Oaxaca 2130",
      codigoPostal: "44254",
      ciudad: "Autlán de Navarro",
      estado: "Jalisco"
    },
    {
      correo: "escuela7@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "7696461569",
      nombre: "Escuela 7",
      tipoPerfil: 1,
      calle: "Viaducto Sur Montes 387",
      codigoPostal: "46234",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: "escuela8@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "5026589058",
      nombre: "Escuela 8",
      tipoPerfil: 1,
      calle: "Calle Jalisco 674",
      codigoPostal: "47829",
      ciudad: "Puerto Vallarta",
      estado: "Jalisco"
    },
    // Aliados
    {
      correo: "aliado1@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "2155158496",
      nombre: "Aliado 1",
      tipoPerfil: 2,
      calle: "Continuación Sur Villalpando 2149",
      codigoPostal: "49912",
      ciudad: "Ocotlán",
      estado: "Jalisco"
    },
    {
      correo: "aliado2@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "4936899305",
      nombre: "Aliado 2",
      tipoPerfil: 2,
      calle: "Calzada Sanches 2294",
      codigoPostal: "45599",
      ciudad: "Guadalajara",
      estado: "Jalisco"
    },
    {
      correo: "aliado3@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "8451729871",
      nombre: "Aliado 3",
      tipoPerfil: 2,
      calle: "Peatonal Norte Lucio 1983",
      codigoPostal: "46872",
      ciudad: "Guadalajara",
      estado: "Jalisco"
    },
    {
      correo: "aliado4@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "4546183710",
      nombre: "Aliado 4",
      tipoPerfil: 2,
      calle: "Circuito Rumania 511",
      codigoPostal: "47953",
      ciudad: "Tepatitlán de Morelos",
      estado: "Jalisco"
    },
    {
      correo: "aliado5@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "9885700676",
      nombre: "Aliado 5",
      tipoPerfil: 2,
      calle: "Pasaje Quintana Roo 1041",
      codigoPostal: "48279",
      ciudad: "Tlaquepaque",
      estado: "Jalisco"
    },
    {
      correo: "aliado6@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "0261703958",
      nombre: "Aliado 6",
      tipoPerfil: 2,
      calle: "Continuación Distrito Federal 2448",
      codigoPostal: "48997",
      ciudad: "Arandas",
      estado: "Jalisco"
    },
    {
      correo: "aliado7@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "7352824671",
      nombre: "Aliado 7",
      tipoPerfil: 2,
      calle: "Circunvalación Jordania 568",
      codigoPostal: "45129",
      ciudad: "Autlán de Navarro",
      estado: "Jalisco"
    },
    {
      correo: "aliado8@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "7255670509",
      nombre: "Aliado 8",
      tipoPerfil: 2,
      calle: "Callejón Tuvalu 1907",
      codigoPostal: "48327",
      ciudad: "Zapopan",
      estado: "Jalisco"
    },
    // Admin
    {
      correo: "admin@test.com",
      contraseña: "12345",
      estadoCuenta: true,
      fechaCreacion: currentDate,
      telefono: "7067353289",
      nombre: "Administrador",
      tipoPerfil: 3,
      calle: "Avenida Ureña 1010",
      codigoPostal: "45151",
      ciudad: "Arandas",
      estado: "Jalisco"
    }
  ]).returning('idUsuario');

  // Get the inserted user IDs by type (needed for profile associations)
  const escuelaIds = usuarios.filter(u => u.tipoPerfil === 1).map(u => u.idUsuario);
  const aliadoIds = usuarios.filter(u => u.tipoPerfil === 2).map(u => u.idUsuario);

  // Insert school profiles
  await knex('perfilEscuela').insert([
    {
      cct: "CCT00901D",
      idUsuario: escuelaIds[0],
      nivelEducativo: 'Primaria',
      sector: 'Público',
      numeroEstudiantes: 120,
      nombreDirector: 'María González',
      telefonoDirector: '4567891230',
    },
    {
      cct: "CCT00902D",
      idUsuario: escuelaIds[1],
      nivelEducativo: 'Secundaria',
      sector: 'Público',
      numeroEstudiantes: 180,
      nombreDirector: 'José Ramírez',
      telefonoDirector: '7894561230',
    },
    {
      cct: "CCT00903D",
      idUsuario: escuelaIds[2],
      nivelEducativo: 'Primaria',
      sector: 'Privado',
      numeroEstudiantes: 100,
      nombreDirector: 'Roberto Sánchez',
      telefonoDirector: '3216549870',
    },
    {
      cct: "CCT00904D",
      idUsuario: escuelaIds[3],
      nivelEducativo: 'Preparatoria',
      sector: 'Público',
      numeroEstudiantes: 250,
      nombreDirector: 'Ana Martínez',
      telefonoDirector: '6549873210',
    },
    {
      cct: "CCT00905D",
      idUsuario: escuelaIds[4],
      nivelEducativo: 'Secundaria',
      sector: 'Privado',
      numeroEstudiantes: 150,
      nombreDirector: 'Carlos López',
      telefonoDirector: '9873216540',
    },
    {
      cct: "CCT00906D",
      idUsuario: escuelaIds[5],
      nivelEducativo: 'Primaria',
      sector: 'Público',
      numeroEstudiantes: 110,
      nombreDirector: 'Laura Torres',
      telefonoDirector: '8732165490',
    },
    {
      cct: "CCT00907D",
      idUsuario: escuelaIds[6],
      nivelEducativo: 'Preparatoria',
      sector: 'Privado',
      numeroEstudiantes: 200,
      nombreDirector: 'Miguel Hernández',
      telefonoDirector: '7321654980',
    },
    {
      cct: "CCT00908D",
      idUsuario: escuelaIds[7],
      nivelEducativo: 'Secundaria',
      sector: 'Público',
      numeroEstudiantes: 170,
      nombreDirector: 'Patricia Gómez',
      telefonoDirector: '3216549870',
    }
  ]);

  // Insert partner profiles
  await knex('perfilAliado').insert([
    {
      rfc: "RFC800201",
      idUsuario: aliadoIds[0],
      razonSocial: 'Constructora Educativa SA de CV',
      telefono: '1234567890',
      correoRepresentante: 'contacto@constructoraedu.com'
    },
    {
      rfc: "RFC800202",
      idUsuario: aliadoIds[1],
      razonSocial: 'Tecnología Escolar SA',
      telefono: '9876543210',
      correoRepresentante: 'info@tecnologiaescolar.com'
    },
    {
      rfc: "RFC800203",
      idUsuario: aliadoIds[2],
      razonSocial: 'Fundación Educativa Nacional',
      telefono: '5551234567',
      correoRepresentante: 'fundacion@educativa.org'
    },
    {
      rfc: "RFC800204",
      idUsuario: aliadoIds[3],
      razonSocial: 'Equipamiento Académico SA de CV',
      telefono: '3339876543',
      correoRepresentante: 'ventas@equipamientoacademico.mx'
    },
    {
      rfc: "RFC800205",
      idUsuario: aliadoIds[4],
      razonSocial: 'Materiales Didácticos Profesionales',
      telefono: '4445556677',
      correoRepresentante: 'contacto@materialesdidacticos.com'
    },
    {
      rfc: "RFC800206",
      idUsuario: aliadoIds[5],
      razonSocial: 'Capacitación Docente y Más',
      telefono: '8887776655',
      correoRepresentante: 'info@capacitaciondocente.edu'
    },
    {
      rfc: "RFC800207",
      idUsuario: aliadoIds[6],
      razonSocial: 'Infraestructura Educativa SA',
      telefono: '2223334455',
      correoRepresentante: 'proyectos@infraestructuraedu.com'
    },
    {
      rfc: "RFC800208",
      idUsuario: aliadoIds[7],
      razonSocial: 'Soluciones Digitales Escolares',
      telefono: '6667778899',
      correoRepresentante: 'soporte@solucionesdigitales.mx'
    }
  ]);

  console.log('Seed completado: Se insertaron 8 escuelas, 8 aliados, 1 administrador, y sus perfiles asociados');
};