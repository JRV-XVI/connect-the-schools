const express = require('express');
const escuela = express.Router();

escuela.get('/escuelas', (req, res, next) => {
	const escuela = {
		"Escuela": "Tecnologico de monterrey",
		"Descripcion": "Hola mundo"
	};
	res.send(JSON.stringify(escuela));
});

module.exports = escuela;
