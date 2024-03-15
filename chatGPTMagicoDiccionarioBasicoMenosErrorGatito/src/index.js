const express = require('express');
const app = express();
const morgan = require('morgan');
const http = require('http');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
// Requiere rutas
const openaiRouter = require('./openai');

// middlewares
app.use(morgan('dev'));
app.use(cors());
// activar la conf de la carpeta public 
app.use(express.static(__dirname + '/public'));

// Rutas
app.use('/', openaiRouter);

// consultas app.get('*', function(req, res){
app.get('*', function (req, res) {
    res.send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
});

// Listen va de ultimas 
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
