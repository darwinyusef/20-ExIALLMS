const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const ElevenLabs = require("elevenlabs-node");
const apiKeyElevenLabs = process.env.ELEVENLABS_API_KEY;

let voices = new ElevenLabs({ apiKey: apiKeyElevenLabs });

const dates = new Date();
const dir = (dates.getMonth() + 1).toString() + dates.getDate().toString();

function createFolder(dir) {
    info = fs.mkdir((path.join(__dirname), `./src/public/audios/${dir.toString()}`), (e) => {
        if (e.code == 'EEXIST') {
            return console.log('Directory exist sucessfully');
        }
        if (e) {
            return console.log(e);
        }
        console.log('Directory created sucessfully');
    });
}

async function activeElevenLabs(ms) {
    return await voices.textToSpeech({
        // Required Parameters
        // The name of your audio file
        fileName: `./src/public/audios/${dir}/${dates.getTime()}.mp3`,
        // The text you wish to convert to speech                 
        textInput: ms,
        // Optional Parameters
        // A different Voice ID from the default
        // The stability for the converted speech
        voiceId: "ErXwobaYiN019PkySvjV", // Antony
        // The similarity boost for the converted speech      
        stability: 0.5,
        similarityBoost: 0.5,
        // The ElevenLabs Model ID                        
        modelId: "eleven_multilingual_v2",
        // The style exaggeration for the converted speech   
        style: 1,
        // The speaker boost for the converted speech                          
        speakerBoost: true
    }).then((res) => {
        return res;
    }).catch((e) => {
        console.log(e);
    });
}


// configuración de OPENAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

let modifyJsonStringify = (result) => {
    if (result) {
        return JSON.stringify(result.replace(/['"{}]+/g, "").replace(/[:]+/g, ":").replace(/,+/g, ";"))
    }
    return '';
}

async function openAIContent(mensaje) {
    return await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `mensaje del usuario: ${mensaje}`
        }],
        model: 'gpt-3.5-turbo',
    });
}

router.get('/chats', async (req, res) => {
    let mensaje = decodeURI(req.query.pregunta);
    if (mensaje === 'undefined') {
        return res.status(404).send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
    }
    const data = fs.readFileSync("./src/public/entrenamiento.json", 'utf-8');
    // console.log(mensaje);
    if (mensaje.toLowerCase().includes('pregunta pregunta')) {
        mensaje = "Dame una palabra magica del diccionario que pudiera aprender hoy y su significado y expresalo de manera magica; que no sea mayor a 20 palabras"
    } else {
        mensaje = `He llegado a la montaña mas antigua del mundo y he encontrado a un sabio, este sabio tiene un diccionario mágico que recibe cualquier 
        palabra sin importar que tan difícil sea y le da un consejo ó un significado único y mágico, yo pregunto esto: ( ${mensaje} ) y tu me respondes sabiamente, 
        tambien ten en cuenta estos ejemplos: 
      
        Ejemplo 1:
        Usuario: Quisiera saber el significado de la palabra "selenofobia".
        Respuesta magica1: Soy el gran sabio de la montaña con un diccionario mágico en mis manos y te respondo: La selenofobia es el temor irracional a la Luna. Quienes sufren de selenofobia pueden experimentar ansiedad extrema durante las noches de luna llena, asi como cuando el hombre lobo atemorizaba a miles de personas en la noche y se consumía sus almas."
        Ejemplo 2:
        Usuario: ¿Cuál es el significado de "quimérico"?
        Respuesta magica2: Soy el gran sabio de la montaña con un diccionario mágico en mis manos y te respondo Lo quimérico se refiere a algo ilusorio o fantástico, a menudo relacionado con ideas o proyectos que son difíciles de alcanzar o poco realistas. Es comúnmente utilizado para describir algo que parece tener características de fantasía o imaginación.
        por ultimo ten en cuenta lo siguiente: ${modifyJsonStringify(data)}`
    }
    const chatCompletion = await openAIContent(mensaje);
    const info = res;
    createFolder(dir); 
    activeElevenLabs(chatCompletion.choices[0].message.content.replace(/\\n/g, "\n")).then((res) => {
        info.status(200).json({ 'response': chatCompletion.choices[0].message.content, res });
    });
});

module.exports = router; 