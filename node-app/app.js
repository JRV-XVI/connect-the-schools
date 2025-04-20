const express = require('express');
const usuario = require('./routers/usuario.js');
const aliado = require('./routers/aliado.js');
const app = express();

const PORT = process.env.PORT || 4001;

app.use('/api', usuario);
app.use('/api', aliado);

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
	console.log(`http://localhost:${PORT}/`)
});
