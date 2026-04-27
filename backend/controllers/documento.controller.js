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
 * Se ejecuta SOLO cuando el usuario aprueba explícitamente el resultado desde el frontend.
 * Representa el cierre del ciclo Human-in-the-Loop: el usuario leyó el análisis de la IA,
 * tomó una decisión informada y autorizó la acción final.
 *
 * Por ahora registra la confirmación y devuelve los datos aprobados.
 * En iteraciones futuras este endpoint puede extenderse para:
 * - Guardar el registro de confirmación en base de datos
 * - Generar un PDF con la respuesta aprobada
 * - Notificar a otros sistemas internos (nunca de forma autónoma hacia clientes)
 */
const confirmar = async (req, res, next) => {
  try {
    // Los datos del análisis aprobado llegan en el cuerpo de la petición
    const { datos, mensaje } = req.body;

    // Validar que se recibió el análisis a confirmar
    if (!datos) {
      const error = new Error('No se recibieron datos del análisis para confirmar.');
      error.status = 400;
      return next(error);
    }

    // Registrar en consola la confirmación (en producción esto iría a un logger)
    console.log(`[HITL] Usuario confirmó análisis de documento tipo: ${datos.tipo || 'desconocido'}`);

    // Devolver confirmación al frontend con los datos aprobados
    res.status(200).json({
      mensaje: 'Análisis confirmado correctamente por el usuario.',
      datosConfirmados: datos,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analizar, confirmar };
