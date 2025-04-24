const db = require('../db');

// ---------------------------------------------- //
// ----------------- USUARIO  ------------------- // 
// ---------------------------------------------- // 

const validacionLogin = async (params) => {
	const resultado = await db.query('SELECT "idUsuario" FROM Usuario WHERE contraseña = $1 AND correo = $2', [params.contraseña, params.correo]);
	return resultado.rows;
}

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
