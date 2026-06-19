// Archivo: netlify/functions/analizar.js

exports.handler = async function(event, context) {
    // Solo permitimos peticiones POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    try {
        // Recibimos los datos que envía tu página web
        const { script, theory } = JSON.parse(event.body);

        // Obtenemos tu clave secreta guardada en las variables de entorno de Netlify
        const API_KEY = process.env.API_KEY;

        // Hacemos la petición a Google desde el servidor de Netlify (IP de EE. UU.)
        const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analiza el siguiente guion aplicando la perspectiva teórica de ${theory}. Guion: ${script}`
                    }]
                }]
            })
        });

        const data = await googleResponse.json();

        // Verificamos si Google devolvió un error
        if (!googleResponse.ok) {
            throw new Error(data.error?.message || "Error al conectar con Gemini");
        }

        // Extraemos el texto de la respuesta de la IA
        const aiText = data.candidates[0].content.parts[0].text;

        // Se lo enviamos de vuelta a tu página web
        return {
            statusCode: 200,
            body: JSON.stringify({ result: aiText })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
