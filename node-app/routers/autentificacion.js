const express = require('express');
const auten = express.Router();

auten.get('/escuelas', (req, res, next) => {
	const school = {
		"Escuela": "Tecnologico de monterrey",
		"Descripcion": "Hola mundo"
	};
	res.send(JSON.stringify(school));
});

module.exports = auten;
