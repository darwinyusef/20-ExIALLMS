const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');


const dotenv = require('dotenv');

// configuración .env
dotenv.config();

const PORT = process.env.PORT || 3000;
// configuración express
const app = express();
const server = http.createServer(app);
const openaiRouter = require('./openai');
// Configuración de middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
// configuracón de la carpeta public
app.use(express.static(__dirname + "/public"));

app.use('/', openaiRouter);

app.get('/chatse', (req, res) => {
    res.send('pepito');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


