// Servicio de OCR usando Google Cloud Document AI.
// Responsabilidad única: recibir un buffer de archivo y devolver el texto extraído.
// TODO: Implementar en Fase 3 (OCR con Google Cloud Document AI).
// Este stub permite que el resto de la arquitectura funcione mientras llega esa fase.

/**
 * extraerTexto
 * @param {Buffer} buffer - El contenido del archivo en memoria (NO se guarda en disco)
 * @param {string} mimeType - Tipo MIME del archivo (ej: 'application/pdf')
 * @returns {Promise<string>} - El texto extraído del documento
 */
const extraerTexto = async (buffer, mimeType) => {
  // TODO Fase 3: Conectar con Google Cloud Document AI
  // El flujo será: buffer → Document AI API → texto plano
  // El buffer se pasa directamente a la API; nunca se escribe en disco
  throw new Error('Servicio OCR aún no implementado. Pendiente Fase 3.');
};

module.exports = { extraerTexto };
