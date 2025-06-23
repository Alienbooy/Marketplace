require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const clienteRouter = require('./routes/clienteRouter');
const anuncioRouter = require('./routes/anuncioRouter');
const imagenRouter = require('./routes/imagenRouter');
const likeRouter = require('./routes/likeRouter');
const conversacionRouter = require('./routes/conervasacionRouter');
const mensajeRouter = require('./routes/mensajeRouter');




const pool = require('./db');

app.use(express.json());

app.use(cors());

app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/cliente', clienteRouter);
app.use('/api/anuncios', anuncioRouter);
app.use('/api/imagenes', imagenRouter);
app.use('/api/likes', likeRouter);
app.use('/api/conversaciones', conversacionRouter);
app.use('/api/mensajes', mensajeRouter);




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
