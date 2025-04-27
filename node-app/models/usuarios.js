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

const obtenerUsuarios = async () => {
	const resultado = await db.query('SELECT * FROM Usuario');
	return resultado.rows;
};

const infoUsuario = async (id) => {
	const resultado = await db.query('SELECT * FROM Usuario WHERE "idUsuario" = $1', [id]);
	return resultado.rows;
};

const crearUsuario = async (params) => {
	const resultado = await db.query('INSERT INTO Usuario (correo, contraseña, telefono, nombre, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
		[
			params.correo,
			params.contraseña,
			params.telefono,
			params.nombre,
			params.direccion
		]);
	return resultado.rows;
};

const actualizarUsuario = async (id, params) => {
	const camposActualizables = ['correo', 'contraseña', 'telefono', 'nombre', 'direccion'];
	const disponibles = [];
	const valores = [id];

	let indiceParam = 2;
	camposActualizables.forEach(campo => {
		if (params[campo] !== undefined) {
			disponibles.push(`"${campo}" = $${indiceParam}`);
			valores.push(params[campo]);
			indiceParam++;
		}
	});

	if (disponibles.length === 0) return null;
	const query = `UPDATE usuario SET ${disponibles.join(', ')} WHERE "idUsuario" = $1 RETURNING *`;
	const resultado = await db.query(query, valores);
	return resultado.rows;
};

const eliminarUsuario = async (id) => {
	const resultado = await db.query('DELETE FROM Usuario WHERE "idUsuario" = $1', [id]);
	return {
		mensaje: `Usuario con id de ${id} fue eliminado correctamente`
	};
};

module.exports = { obtenerUsuarios, infoUsuario, crearUsuario, eliminarUsuario, actualizarUsuario, validacionLogin };
