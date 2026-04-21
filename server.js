import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/generar-evaluacion", async (req, res) => {
  const { materia, grupo, numPreguntas, dificultad, tiempo, instrucciones, tipo } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: "Falta configurar la API KEY" });
  }

  const prompt = `
Genera un examen en formato JSON.

Materia: ${materia}
Grupo: ${grupo}
Tipo: ${tipo}
Dificultad: ${dificultad}
Preguntas: ${numPreguntas}
Tiempo: ${tiempo} minutos
Notas: ${instrucciones}

IMPORTANTE:
- Devuelve SOLO JSON válido
- No uses markdown
- No uses explicaciones

Formato:

{
  "titulo": "string",
  "instrucciones": "string",
  "preguntas": [
    {
      "id": 1,
      "tipo": "multiple",
      "texto": "string",
      "opciones": ["A","B","C","D"],
      "correcta": 0,
      "pts": 2
    }
  ]
}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Planeador IA"
      },
      body: JSON.stringify({
        // ✅ MODELO CORREGIDO
        model: "meta-llama/llama-3-8b-instruct",

        messages: [
          {
            role: "system",
            content: "Eres un generador de exámenes educativos en formato JSON puro."
          },
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("🔎 RESPUESTA COMPLETA:\n", JSON.stringify(data, null, 2));

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      console.log("❌ RESPUESTA VACÍA:", data);
      return res.status(500).json({ error: "La IA no devolvió contenido" });
    }

    console.log("🧠 TEXTO IA:\n", text);

    // 🔥 limpiar respuesta
    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = clean.match(/\{[\s\S]*\}/);

    if (!match) {
      console.log("❌ NO JSON ENCONTRADO:", clean);
      return res.status(500).json({ error: "No se encontró JSON en la respuesta" });
    }

    try {
      const json = JSON.parse(match[0]);
      return res.json(json);
    } catch (err) {
      console.log("❌ ERROR PARSEANDO:\n", match[0]);
      return res.status(500).json({ error: "JSON inválido" });
    }

  } catch (error) {
    console.log("❌ ERROR GENERAL:", error);
    res.status(500).json({ error: "Error generando evaluación" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor en http://localhost:3000");
});