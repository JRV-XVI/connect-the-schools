const db = require('../db');

const obtenerUsuarios = async () => {
	const resultado = await db.query('SELECT * FROM Usuario');
	return resultado.rows;
};

const usuarioId = async (id) => {
	const resultado = await db.query('SELECT * FROM Usuario WHERE "idUsuario" = $1', [id]);
	return resultado.rows;
};

const crearUsuario = async (params) => {
	const resultado = await db.query('INSERT INTO Usuario (correo, contraseña, "estadoCuenta", "fechaCreacion", telefono, nombre, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7)',
		[
			params.correo,
			params.contraseña,
			params.estadoCuenta,
			params.fechaCreacion,
			params.telefono,
			params.nombre,
			params.direccion
		]);
	return resultado.rows;
};

const actualizarUsuario = async (id, params) => {
	const resultado = await db.query('UPDATE usuario SET correo = $2, contraseña = $3, telefono = $4, nombre = $5, direccion = $6 WHERE "idUsuario" = $1', [id, params.correo, params.contraseña, params.telefono, params.nombre, params.direccion])
	return resultado.rows;
};


const eliminarUsuario = async (id) => {
	const resultado = await db.query('DELETE FROM Usuario WHERE "idUsuario" = $1', [id]);
	return {
		mensaje: `Usuario con id de ${id} fue eliminado correctamente`
	};
};

module.exports = { obtenerUsuarios, usuarioId, crearUsuario, eliminarUsuario, actualizarUsuario };
