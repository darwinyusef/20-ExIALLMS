const express = require('express');
const router = express.Router();
const fs = require('fs');
const OpenAI = require('openai');

// configuración de OPENAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function openAIChat(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                role: 'user', content: `${message}`
            }],
            model: 'gpt-3.5-turbo',
        });
        return chatCompletion.choices[0];
    } catch (error) {
        console.log("Error en la llamada a OpenAI");
    }
}

async function entrenamiento1(mensaje) {
    const data = fs.readFileSync("./src/public/entrenamiento.json", 'utf-8');
    if (mensaje.toLowerCase().includes('pregunta pregunta')) {
        mensaje = "Dame una palabra dificil del diccionario que pudiera aprender hoy y su significado y expresalo de manera magica"
    } else {
        mensaje = `Dame el significado de ${mensaje} para aprenderla y su significado a tener en cuenta ${JSON.stringify(data)}`
    }
    return await openAIChat(`mensaje del usuario: ${mensaje}`);
}


async function entrenamiento2(mensaje) {
    const data = fs.readFileSync("./src/public/entrenamientoRomantico.json", 'utf-8');
    if (mensaje.toLowerCase().includes('pregunta pregunta')) {
        mensaje = "Dame una palabra dificil del diccionario que pudiera aprender hoy y su significado y expresalo de manera romantica"
    } else {
        mensaje = `Dame el significado de ${mensaje} para aprenderla y su significado a tener en cuenta ${JSON.stringify(data)}`
    }
    return await openAIChat(`mensaje del usuario: ${mensaje}`);
}

router.get('/chats', async (req, res) => {
    let mensaje = decodeURI(req.query.pregunta);
    let type = decodeURI(req.query.type);
    if (mensaje === 'undefined') {
        return res.status(404).send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
    }
    
    if (type == 'romantico') {
        const chatCompletion = await entrenamiento2(mensaje);
        res.status(201).json({ response_gpt: chatCompletion.message });
        return;
    }

    const chatCompletion = await entrenamiento1(mensaje);
    res.status(201).json({ response_gpt: chatCompletion.message });
});

module.exports = router; 