const express = require('express');
const router = express.Router();

const fs = require('fs');
const OpenAI = require('openai');

// configuración de OPENAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function openAIContent(mensaje) {
    return await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `mensaje del usuario: ${mensaje}`
        }],
        model: 'gpt-3.5-turbo',
    });
}

const examples = `
Ejemplo 1:
Usuario: Quisiera saber el significado de la palabra "selenofobia".
Respuesta magica1: La selenofobia es el temor irracional a la Luna. Quienes sufren de selenofobia pueden experimentar ansiedad extrema durante las noches de luna llena, asi como cuando el hombre lobo atemorizaba a miles de personas en la noche y se consumia sus almas."
Ejemplo 2:
Usuario: ¿Cuál es el significado de "quimérico"?
Respuesta magica2: Lo quimérico se refiere a algo ilusorio o fantástico, a menudo relacionado con ideas o proyectos que son difíciles de alcanzar o poco realistas. Es comúnmente utilizado para describir algo que parece tener características de fantasía o imaginación.
`;

router.get('/chats', async (req, res) => {
    let mensaje = decodeURI(req.query.pregunta);
    if (mensaje === 'undefined') {
        return res.status(404).send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
    }
    const data = fs.readFileSync("./src/public/entrenamiento.json", 'utf-8');
    if (mensaje.toLowerCase().includes('pregunta pregunta')) {
        mensaje = "Dame una palabra dificil del diccionario que pudiera aprender hoy y su significado y expresalo de manera magica"
    } else {
        mensaje = `He llegado a la montaña mas antigua del mundo y he encontrao a un sabio, este sabio tiene un diccionario magico que recibe cualquier 
        palabra sin importar que tan dificil sea y le da un significado unico magico, yo digo esta palabra ${mensaje} y tu defines el resultado 
        ten en cuenta estos ejemplos: ${examples}
        por ultimo ten en cuenta lo siguiente ${JSON.stringify(data)}`

    }
    const chatCompletion = await openAIContent(mensaje);

    // activeElevenLabs(chatCompletion.choices[0].message.content.replace(/\\n/g, "\n"));
    res.status(201).json({ response: chatCompletion.choices[0].message.content.replace(/\\n/g, "\n") });
});

module.exports = router; 