// Servicio de análisis usando Google Gemini API.
// Responsabilidad única: recibir texto plano y devolver el análisis estructurado
// (clasificación del documento, datos clave extraídos, sugerencia de respuesta).
// TODO: Implementar en Fase 4 (Integración Gemini API y UI React).

/**
 * analizarTexto
 * @param {string} texto - Texto extraído del documento por el servicio OCR
 * @returns {Promise<Object>} - Objeto con clasificación, datos clave y sugerencia de respuesta
 */
const analizarTexto = async (texto) => {
  // TODO Fase 4: Conectar con Google Gemini API
  // El flujo será: texto → Gemini prompt → JSON estructurado con:
  //   - tipo: clasificación del documento (ej: 'factura', 'contrato', 'PQRS')
  //   - datosRelevantes: campos clave detectados
  //   - sugerenciaRespuesta: borrador de respuesta para el usuario (HITL)
  throw new Error('Servicio Gemini aún no implementado. Pendiente Fase 4.');
};

module.exports = { analizarTexto };
