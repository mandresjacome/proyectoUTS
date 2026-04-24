// Servicio de análisis usando Google Gemini API.
// Responsabilidad única: recibir texto plano extraído por OCR y devolver un
// análisis estructurado en JSON con clasificación, datos clave y sugerencia de respuesta.
// La respuesta se devuelve al frontend para que el usuario la revise (Human-in-the-Loop).

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

// Inicializar el cliente de Gemini con la API key del entorno.
// Se instancia aquí (nivel módulo) para reutilizar la conexión en cada llamada,
// evitando crear una instancia nueva en cada petición HTTP.
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Nombre del modelo a usar. gemini-2.0-flash ofrece el mejor balance entre
// velocidad, costo y capacidad para tareas de clasificación de documentos.
const MODELO = 'gemini-2.0-flash';

/**
 * analizarTexto — envía el texto extraído por OCR a Gemini para su análisis.
 *
 * El prompt está diseñado para que Gemini devuelva SIEMPRE un JSON válido
 * con una estructura predecible, lo que permite al frontend renderizarlo
 * de forma consistente sin lógica de parseo adicional.
 *
 * @param {string} texto - Texto extraído del documento por el servicio OCR
 * @returns {Promise<Object>} - Objeto con:
 *   - tipo: clasificación del documento (ej: 'factura', 'contrato', 'PQRS')
 *   - datosRelevantes: objeto con los campos clave detectados en el documento
 *   - sugerenciaRespuesta: borrador de respuesta redactado por la IA para revisión del usuario
 *   - resumen: descripción breve del contenido del documento
 */
const analizarTexto = async (texto) => {
  // Verificar que la API key está configurada antes de intentar la llamada.
  // Fallar rápido con un mensaje claro evita errores crípticos del SDK.
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno.');
  }

  // Construcción del prompt.
  // Se instruye explícitamente a Gemini para que responda SOLO con JSON sin
  // bloques de código markdown (sin ```json), porque el backend parseará la
  // respuesta directamente con JSON.parse().
  const prompt = `Eres un asistente experto en gestión documental para pequeñas y medianas empresas (Mipymes) en Colombia.

Analiza el siguiente texto extraído de un documento y devuelve ÚNICAMENTE un objeto JSON válido, sin bloques de código ni texto adicional, con esta estructura exacta:

{
  "tipo": "tipo o categoría del documento (ej: factura, contrato, PQRS, carta, cotización, otro)",
  "resumen": "descripción breve del contenido del documento en 2-3 oraciones",
  "datosRelevantes": {
    "descripcion": "explica qué datos clave encontraste (fechas, montos, partes involucradas, etc.)"
  },
  "sugerenciaRespuesta": "borrador de respuesta profesional en español que la empresa podría enviar, adaptada al tipo de documento. Si no aplica una respuesta, escribe null."
}

Texto del documento:
${texto}`;

  // Llamada a la API de Gemini.
  // Se usa generateContent que es el método estándar para prompts de texto.
  const resultado = await genai.models.generateContent({
    model: MODELO,
    contents: prompt,
  });

  // Extraer el texto de la respuesta del modelo
  const textoRespuesta = resultado.text;

  // Parsear la respuesta como JSON.
  // Si Gemini devuelve texto que no es JSON válido, JSON.parse lanzará un error
  // que será capturado por el try/catch del controlador y enviado al errorHandler.
  const analisisJSON = JSON.parse(textoRespuesta);

  return analisisJSON;
};

module.exports = { analizarTexto };
