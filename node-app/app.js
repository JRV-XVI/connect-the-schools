const express = require('express');
const usuario = require('./routers/usuario.js');
const aliado = require('./routers/aliado.js');
const admin = require('./routers/admin.js')
const mensaje = require('./routers/mensaje.js')
const mensajeria = require('./routers/mensajeria.js')
const escuela = require('./routers/escuela.js')
const app = express();

const PORT = process.env.PORT || 4001;

app.use(express.json())
app.use('/api', usuario);
app.use('/api', aliado);
app.use('/api', admin);
app.use('/api', mensaje)
app.use('/api', mensajeria)
app.use('/api', escuela)

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
	console.log(`http://localhost:${PORT}/`)
});
