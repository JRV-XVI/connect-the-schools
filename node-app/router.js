const express = require('express');
const router = express.Router();

router.get('/escuela', (req, res, next) => {
	const school = {
		"Escuela": "Tecnologico de monterrey",
		"Descripcion": "Hola mundo"
	};
	res.send(JSON.stringify(school));
});

router.get('/aliados', (req, res, next) => {
	const aliado = {
		"Aliado": "Jose",
		"Descripcion": "Hola mundo"
	}
	res.send(JSON.stringify(aliado));
});


module.exports = router;


