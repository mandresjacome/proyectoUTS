// Servicio de OCR usando Google Cloud Document AI.
// Responsabilidad única: recibir un buffer de archivo en memoria y devolver
// el texto extraído como string plano.
// El buffer NUNCA se escribe en disco — se envía directamente a la API de GCP
// codificado en base64, cumpliendo la regla de Zero Storage.

require('dotenv').config();

const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

// Inicializar el cliente de Document AI.
// La variable GOOGLE_APPLICATION_CREDENTIALS apunta al archivo JSON de la cuenta
// de servicio; el SDK la lee automáticamente para autenticarse con GCP.
// Se usa la URL regional 'us' para que coincida con la región del procesador creado.
const cliente = new DocumentProcessorServiceClient({
  apiEndpoint: 'us-documentai.googleapis.com',
});

// Construir el nombre completo del procesador usando las variables de entorno.
// Este formato es requerido por la API de Document AI para identificar el procesador.
const NOMBRE_PROCESADOR = `projects/${process.env.DOCUMENT_AI_PROJECT_ID}/locations/${process.env.DOCUMENT_AI_LOCATION}/processors/${process.env.DOCUMENT_AI_PROCESSOR_ID}`;

/**
 * extraerTexto — procesa un archivo en memoria con Document AI y devuelve su texto.
 *
 * El flujo es:
 * 1. Recibe el buffer (archivo en RAM, nunca en disco)
 * 2. Lo codifica en base64 (formato requerido por la API de Document AI)
 * 3. Envía la petición al procesador OCR en GCP
 * 4. Extrae y concatena el texto de todas las páginas detectadas
 * 5. Descarta el buffer — no se almacena en ningún lado
 *
 * @param {Buffer} buffer - Contenido del archivo en memoria (multer memoryStorage)
 * @param {string} mimeType - Tipo MIME del archivo (ej: 'application/pdf', 'image/png')
 * @returns {Promise<string>} - Texto completo extraído del documento
 */
const extraerTexto = async (buffer, mimeType) => {
  // Verificar que las variables de entorno necesarias están configuradas
  if (!process.env.DOCUMENT_AI_PROJECT_ID || !process.env.DOCUMENT_AI_PROCESSOR_ID) {
    throw new Error('Las variables de Document AI no están configuradas en el archivo .env');
  }

  // Codificar el buffer en base64.
  // Document AI no recibe el archivo binario directamente sino su representación
  // en base64 dentro del cuerpo JSON de la petición.
  const contenidoBase64 = buffer.toString('base64');

  // Construir el objeto de petición según el formato requerido por la API
  const peticion = {
    name: NOMBRE_PROCESADOR,
    rawDocument: {
      content: contenidoBase64,  // Archivo codificado en base64
      mimeType: mimeType,         // Tipo de archivo para que la API lo procese correctamente
    },
  };

  // Llamar al procesador OCR de Document AI.
  // processDocument devuelve un array donde el primer elemento es el documento procesado.
  const [resultado] = await cliente.processDocument(peticion);

  // Extraer el texto completo del documento procesado.
  // Document AI devuelve el texto de todo el documento en la propiedad 'text'
  // del objeto document. Si no se detectó texto, se retorna string vacío.
  const textoExtraido = resultado.document.text || '';

  // Verificar que se extrajo contenido útil del documento
  if (!textoExtraido.trim()) {
    throw new Error('No se pudo extraer texto del documento. Verifica que el archivo tenga contenido legible.');
  }

  return textoExtraido;
};

module.exports = { extraerTexto };
