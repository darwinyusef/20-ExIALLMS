const express = require('express');
const morgan = require('morgan');
const http = require('http');
require('dotenv').config();
const cors = require('cors');
const openaiRouter = require('./openai');


const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// middlewares
app.use(morgan('dev'));
app.use(cors());
// activar la conf de la carpeta public 
app.use(express.static(__dirname + '/public'));
// Add router
app.use('/', openaiRouter);

app.get('*', function (req, res) {
    res.send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
});

server.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});