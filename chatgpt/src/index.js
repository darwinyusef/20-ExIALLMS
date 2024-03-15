// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');
//agregar openai
const OpenAI = require('openai');
const { json } = require('body-parser');


// Configurar dotenv para cargar variables de entorno
dotenv.config();



// Configurar el servidor Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar middleware
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:5500/indexprcors.html', // Reemplaza con el origen de tu frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
//     allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
// }));

app.use(morgan('dev'));
app.use(bodyParser.json());
// Define la ruta pública para los archivos estáticos
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Configurar la base de datos SQLite
const db = new sqlite3.Database('./db_sqlite.sqlite');



const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

let move = { "data": 1 }
let aditionalList = {

}

app.param('id', (req, res, next, id) => {
    move.data = id;
    console.log('CALLED ONLY ONCE');
    next();
});

// Rutas a las páginas HTML Estaticas requiere obligatoriamente configurarse /public y  app.use(express.static('public'));
app.get('/page', (req, res) => {
    res.sendFile('./index.html', { root: 'public' });
});

app.get('/page/:id', (req, res) => {
    console.log(move);
    const id = req.params.id;
    res.send(`este es el id ${id}`);
});

// Contenidos estatico dinamicos con rendereado requiere virtual engine app.set('view engine', 'ejs');
app.get('/user', (req, res) => {
    res.render('home', { title: 'Listado de elementos', message: 'Lista de elementos sugeridos' });
});


app.get('/response/', async (req, res) => {
    const mensaje = req.query.mensaje;
    const cantidad = req.query.cantidad | 1;
    console.log(mensaje);
    const chatCompletion = await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `primero elimina todas las introducciones solo quiero un json, 
        nunca debes debes incluir en el json { "": [] } solo agrega [],  
        limita a entregarme solo el json nada mas, 
        quiero saber aleatoriamente los más populares, un total de ${cantidad}  recomendaciones de ${mensaje} dame los nombres y fechas, los premios serán listados separados por (;) una unica calificación sera de 0 a 5. tambien debes incluir un numero aleatorio entre 500 y 511 e incluirlo en num_aleatorio, todo esto en json para cada uno internamente en el array así:   
            [{
              "id": 1,
              "nombre": "nombre completo de la pelicula ó canción o elemento seleccionado",
              "fecha": año aleatorio,
              "num_aleatorio": 500 a 511,
              "calificacion": de 0 a 5,
              "premios": "lista de premios separado por (;) punto y coma"
            }],` }],
        model: 'gpt-3.5-turbo',
    });
    res.status(201).json({ response_gpt: chatCompletion.choices[0].message });
});

let products = [
    {
        "id": 1,
        "name": "Equipos de Ejercicio",
        "descript": "Equipos de alta calidad para entrenamiento en casa o en el gimnasio.",
        "url": "https://www.example.com/equipos-de-ejercicio"
    },
    {
        "id": 2,
        "name": "Suplementos Nutricionales",
        "descript": "Suplementos diseñados para apoyar el rendimiento deportivo y la salud en general.",
        "url": "https://www.example.com/suplementos-nutricionales"
    },
    {
        "id": 3,
        "name": "Ropa Deportiva para Hombres",
        "descript": "Ropa cómoda y funcional diseñada para hombres activos.",
        "url": "https://www.example.com/ropa-deportiva-hombres"
    },
    {
        "id": 4,
        "name": "Ropa Deportiva para Mujeres",
        "descript": "Estilo y comodidad se unen en nuestra colección de ropa deportiva para mujeres.",
        "url": "https://www.example.com/ropa-deportiva-mujeres"
    },
    {
        "id": 5,
        "name": "Máquinas de Cardio",
        "descript": "Equipos diseñados para mejorar la salud cardiovascular y quemar calorías.",
        "url": "https://www.example.com/maquinas-cardio"
    },
    {
        "id": 6,
        "name": "Proteínas en Polvo",
        "descript": "Fuentes convenientes de proteína para ayudar en la recuperación muscular y el crecimiento.",
        "url": "https://www.example.com/proteinas-polvo"
    },
    {
        "id": 7,
        "name": "Camisetas Deportivas para Hombres",
        "descript": "Camisetas diseñadas para brindar comodidad y estilo durante el entrenamiento.",
        "url": "https://www.example.com/camisetas-deportivas-hombres"
    },
    {
        "id": 8,
        "name": "Leggings Deportivos para Mujeres",
        "descript": "Leggings cómodos y de alto rendimiento para mujeres activas.",
        "url": "https://www.example.com/leggings-deportivos-mujeres"
    },
    {
        "id": 9,
        "name": "Pesas Libres",
        "descript": "Pesas y mancuernas para entrenamientos de fuerza y tonificación muscular.",
        "url": "https://www.example.com/pesas-libres"
    },
    {
        "id": 10,
        "name": "Multivitaminas",
        "descript": "Fórmulas completas para satisfacer las necesidades nutricionales diarias.",
        "url": "https://www.example.com/multivitaminas"
    }
];

function salida() {
    return `   
    En tercer lugar Ten encuenta las siguientes restricciones:
    
    A. Tu nombre es AlejitaCOUCH.
    B. No puedes hablar de nada que no tenga que ver con fitness y agrega accept false.
    C. No puedes hablar nada que no tenga que ver con los seres humanos y su entrenamiento deportivo y fitness, y agrega accept false.  
    D. Si alguien pregunta por entrenamiento deportivo para animales, ve al item E, y agrega accept false.
    E. Si el usuario habla de algo que no tenga que ver con el comprar productos deportivos, fitness, bajar de peso, obecidad, ejercicio, vida sana, o soporte u asesoria de nuestros productos, por ningun motivo sigas la conversación y agrega accept false. 
    F. Si no entrega información de fitness, comprar productos deportivos, bajar de peso, obecidad, ejercicio, vida sana de manera formal y explica que este chat es solo para fitness, y agrega accept false.
    G. No debes crear descripción inicial de ningun tipo.
    H. No puedes  mencionar los nombres reales de nada  ni usar imágenes de personas o cosas reales.
    I. Debes ser lo más especifico posible.
    J.  nuestro chat debe ser interactivo y responder de manera amigable y profesional a las consultas de los clientes.
    K. Debes revisar las medidas de seguridad para proteger la información del cliente y los datos de pago.
    
    Estos son nuestras categorias de productos  disponibles en nuestro catálogo productos con nombre catalogoID: 
    ${JSON.stringify(products)}`
}

function tipoChats(tipoCHAT) {
    const intro = `En segundo lugar la categorización; ten muy en cuenta que tipo de chat ha elegido el usuario y centrate solo contestar bajo esa categorización, así debes responder:
    Tipos disponibles de chat: search | sugerencia | envios | soporte | normal nosotros te proveeremos exactamente las 
    restricciones  = No puedes hablar de nada que no tenga que ver con esta categorización y/o Información según los tipos de chat: `;
    let finTipoChat = '';
    switch (tipoCHAT) {
        case 'search':
            finTipoChat = `
            A. Debe ser posible realizar búsquedas para encontrar una sola categoria según el nombre esto basado en el catagolo provisto con el nombre de catalogoID. 
            B. El chat debe tener capacidad ser preciso en brindar información completa de una sola categoria, y su resumen (descript) disponibles en catalogoID aqui no debe incluir la url. 
            C. En message_user no debe incluir la url de la categoria`;
            break;
        case 'sugerencia':
            finTipoChat = ` A. Se debe incluir un sistema de recomendación inteligente que sugiera categorias relevantes según el historial de compras del cliente y sus preferencias de entrenamiento de fitness o de las categorias.  
            B. En message_user no debe incluir la url de la categoria`;
            break;
        case 'envios':
            finTipoChat = `3. solo puedes mostrar estas opciones: ( Servientrega, Envia, Pago Contraentrega ).  para que los clientes puedan rastrear el estado de sus pedidos.`
            break;
        case 'soporte':
            finTipoChat = `A. Debes recibir la queja o tratamiento de datos nosotros guardaremos el ticket con tus palabras amables
            B. Si habla de demandas o de PQRS, y agrega url_service:   http://asesor.com.co/pqrs
            C. Este servicio de soporte es muy delicado por favor agrega agrega a url_service: http://asesor.com.co/pqrs 
            D. Agrega forzadamente accept true`;
            break;
        case 'normal':
            finTipoChat = `5. A. Debes solicitarle amablemente al cliente que hable con un asesor y agrega: url_service http://asesor.com.co/asesor`
            break;
        default:
            finTipoChat = `No es posible detectar un tipo de chat especifico por favor  ingresar uno valido.`;
            break;
    }

    return finTipoChat = `${intro} ${finTipoChat}`;
}

app.get('/fitness', async (req, res) => {
    const mensaje = req.query.mensaje;
    const tipo = req.query.tipo;

    const permitidos = ['search', 'sugerencia', 'envios', 'soporte', 'normal']
    let finalMS = `{
        "accept": false
        "message_user": "por favor no es posible atender tu solicitud pues no cumple con nuestras politicas" ,
        "sender": error,
        "tipoCHAT": null
        "timestamp": "2024-02-26T10:15:30Z"
        "url_service":  null
    }`;
    
    if (permitidos.includes(tipo)) {
        finalMS = `
        Me llamo AlejitaCOUCH, soy un agente virtual de atención al cliente en línea, para la empresa FITNESS MARKETING
        recibes la atención del usuario.
    
        En primer lugar esta es la cosulta del usuario : ${mensaje.toString()}. 
     
        ${tipoChats(tipo)}
        fin de la restricciónes de tipos de chat. 
    
        El tipo de chat elegido por el usuario es: const TIPOCHAT:"${tipo}" 
    
        Estas son otras restricciones del chat: ${salida(mensaje)} 
       
        según las restricciones contesta amablemente al usuario segun el tipo de chat elegido  este es el json de salida solo puedes entregar este formato tal como se presenta a continuación no otro ni ningun parametro adicional.
            {
                "accept": true | false
                "message_user": "respuesta sin url" ,
                "sender": bot | user,
                "tipoCHAT": search | sugerencia | envios | soporte | normal
                "timestamp": "2024-02-26T10:15:30Z"
                "url_service":  "si tipoCHAT es: search | sugerencia, debes agregar la url de lo sugerido, aqui tambien debes poner el link de soporte seleccionado"
            }
        `
    }

    console.log(finalMS);
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: finalMS }],
        model: 'gpt-3.5-turbo',
    });
    res.status(201).json({ response_gpt: chatCompletion.choices[0].message });
});











// io.origins('http://127.0.0.1:5500');
// Crear tabla en la base de datos si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)", (err) => {
        if (err) {
            console.error('Error creating table "items":', err.message);
        } else {
            // console.log('Table "items" created or already exists.');
        }
    });
});

// Mostrar un elemento por su ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.json(row);
    });
});

// Rutas CRUD
// Listar todos los elementos
app.get('/items', (req, res) => {
    db.all("SELECT * FROM items", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Crear un nuevo elemento
app.post('/items', (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO items (name) VALUES (?)`, [name], function (err) {
        if (err) {
            return console.error(err.message);
        }
        io.emit('itemCreated', { id: this.lastID, name }); // Emitir evento de creación
        res.json({ id: this.lastID, name });
    });
});

// Actualizar un elemento
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.run(`UPDATE items SET name = ? WHERE id = ?`, [name, id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        io.emit('itemUpdated', { id, name }); // Emitir evento de actualización
        res.json({ id, name });
    });
});

// Eliminar un elemento
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM items WHERE id = ?`, id, (err) => {
        if (err) {
            return console.error(err.message);
        }
        io.emit('itemDeleted', { id }); // Emitir evento de eliminación
        res.json({ message: 'Item deleted', id });
    });
});

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
