const db = require('../db');

const obtenerUsuarios = async () => {
	const resultado = await db.query('SELECT * FROM Usuario');
	return resultado.rows;
}

const usuarioId = async (id) => {
	const resultado = await db.query('SELECT * FROM Usuario WHERE "idUsuario" = $1', [id]);
	return resultado.rows;
}

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
}

const obtenerCorreo = async (id) => {
	const resultado = await db.query('SELECT correo FROM Usuario WHERE "idUsuario" = $1', [id]);
	return resultado.rows;
}

const actualizarCorreo = async (id, params) => {
	const resultado = await db.query("UPDATE Usuario SET correo = $2 WHERE id = $1", [id, params.correo])
	return resultado.rows;
}

const obtenerContraseña = async (id) => {
	const resultado = await db.query('SELECT contraseña FROM Usuario WHERE id = $1', [id]);
	return resultado.rows;
}

const actualizarContraseña = async (id, params) => {
	const resultado = await db.query("UPDATE Usuario SET contraseña = $2 WHERE id = $1", [id, params.contraseña])
	return resultado.rows;
}

const eliminarUsuario = async (id) => {
	const resultado = await db.query("DELETE FROM Usuario WHERE id = $1", [id]);
	return resultado.rows;
}

module.exports = { obtenerUsuarios, usuarioId, crearUsuario, obtenerCorreo, actualizarCorreo, obtenerContraseña, actualizarContraseña, eliminarUsuario };
