const express = require('express');
const fs = require('fs');

//agregar openai
const OpenAI = require('openai');
const router = express.Router();

// configuración de OPENAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function openAICode(message) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `${message}`
        }],
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0];
}

async function getAMessage(req, res) {
    let mensaje = req.query.pregunta;
    const data = fs.readFileSync('./src/public/entrenamiento.json', 'utf8');
    const entrenamiento = JSON.parse(data);
    if (mensaje.toLowerCase().includes("pregunta pregunta")) {
        mensaje = "Dame una palabra dificil del diccionario que pudiera aprender hoy y su significado y expresalo de manera magica";
    } else {
        mensaje = `Dame el significado de ${mensaje} para aprenderla hoy y su significado a tener en cuenta ${JSON.stringify(entrenamiento)}.`
    }

    const chatCompletion = await openAICode(`mensaje del usuario: ${mensaje}`);
    res.status(201).json({ response_gpt: chatCompletion.message });
}

router.get('/chats', getAMessage);


module.exports = router;