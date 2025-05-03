const db = require('../db');

// ---------------------------------------------- //
// ----------------- USUARIO  ------------------- // 
// ---------------------------------------------- // 

const validacionLogin = async (params) => {
	const resultado = await db.query(
		'SELECT "idUsuario", correo, "tipoPerfil" FROM Usuario WHERE contraseña = $1 AND correo = $2',
		[params.contraseña, params.correo]);

	// Obtenemos el primer usuario (debería ser único por correo)
	const usuario = resultado.rows[0];

	// Guardamos los datos principales
	const idUsuario = usuario.idUsuario;
	const tipoPerfil = usuario.tipoPerfil;
	let perfilCompleto = {};

	// Dependiendo del tipo de perfil, buscamos en la tabla correspondiente
	if (tipoPerfil === 1) {
		const escuela = await db.query(
			'SELECT * FROM "perfilEscuela" WHERE "idUsuario" = $1',
			[idUsuario]
		);
		perfilCompleto = escuela.rows[0];
	} else if (tipoPerfil === 2) {
		const aliado = await db.query(
			'SELECT * FROM "perfilAliado" WHERE "idUsuario" = $1',
			[idUsuario]
		);
		perfilCompleto = aliado.rows[0];
	} else if (tipoPerfil === 3) {
		const admin = await db.query(
			'SELECT * FROM "perfilAdmin" WHERE "idUsuario" = $1',
			[idUsuario]
		);
		perfilCompleto = admin.rows[0];
	}

	// Retornamos todo junto
	return {
		idUsuario,
		correo: usuario.correo,
		rol: tipoPerfil === 1 ? 'escuela' : tipoPerfil === 2 ? 'aliado' : 'admin',
		...perfilCompleto
	};
};

module.exports = { validacionLogin };
