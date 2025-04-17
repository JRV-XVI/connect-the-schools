const express = require('express');
const auten = require('./routers/autentificacion.js');
const usuario = require('./routers/usuario.js');
const app = express();

const PORT = process.env.PORT || 4001;

app.use('/api', auten);
app.use('/api', usuario);

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});
