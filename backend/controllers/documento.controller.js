// Controlador del módulo de documentos.
// Responsabilidad: orquestar el flujo de una petición.
// Recibe req/res, delega la lógica pesada a los servicios,
// y devuelve la respuesta HTTP. No contiene lógica de negocio directa.

const ocrService = require('../services/ocr.service');
const geminiService = require('../services/gemini.service');

/**
 * analizar — POST /api/documentos/analizar
 * Flujo:
 * 1. Toma el buffer del archivo desde req.file (multer memoryStorage)
 * 2. Extrae el texto usando el servicio OCR (Google Document AI)
 * 3. Envía el texto al servicio Gemini para análisis y clasificación
 * 4. Devuelve el resultado al frontend para revisión del usuario (HITL)
 */
const analizar = async (req, res, next) => {
  try {
    // El buffer llega en memoria gracias a multer.memoryStorage()
    // NUNCA se guarda en disco ni en almacenamiento externo
    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Paso 1: Extraer texto del documento mediante OCR
    // El buffer se usa aquí y se descarta al salir del scope
    const textoExtraido = await ocrService.extraerTexto(buffer, mimeType);

    // Paso 2: Analizar el texto con Gemini para clasificar y sugerir respuesta
    const analisis = await geminiService.analizarTexto(textoExtraido);

    // Paso 3: Devolver el resultado al frontend
    // El usuario DEBE revisar este resultado antes de cualquier acción final (HITL)
    res.status(200).json({
      mensaje: 'Documento analizado correctamente. Por favor revise el resultado.',
      datos: analisis,
    });
  } catch (error) {
    // Propagar el error al middleware de errores global
    next(error);
  }
};

/**
 * confirmar — POST /api/documentos/confirmar
 * Se ejecuta SOLO cuando el usuario aprueba explícitamente la acción desde el frontend.
 * Este endpoint representa el paso de confirmación del flujo Human-in-the-Loop.
 * Pendiente de implementar en la fase de integración Gemini + UI.
 */
const confirmar = async (req, res, next) => {
  try {
    // TODO: Implementar lógica de acción final en Fase 4 (Integración Gemini + UI)
    res.status(200).json({ mensaje: 'Acción confirmada por el usuario.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { analizar, confirmar };
