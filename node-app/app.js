const express = require('express');
const cors = require('cors');
const usuario = require('./routers/usuario.js');
const proyecto = require('./routers/proyecto.js');
const admin = require('./routers/admin.js')
const mensaje = require('./routers/mensaje.js')
const mensajeria = require('./routers/mensajeria.js')
const escuela = require('./routers/escuela.js')
const necesidadApoyo = require('./routers/necesidadApoyo.js')
const aliado = require('./routers/aliado.js')
const participacion = require('./routers/participacion.js')
const notificacion = require('./routers/notificacion.js')


const app = express();
const PORT = process.env.PORT || 4001;

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());
app.use('/api', usuario);
app.use('/api', admin);
app.use('/api', mensaje);
app.use('/api', mensajeria);
app.use('/api', escuela);
app.use('/api', necesidadApoyo);
app.use('/api', proyecto);
app.use('/api', aliado);
app.use('/api', participacion);
app.use('/api', notificacion);

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Server available at: http://localhost:${PORT}/api`);
});