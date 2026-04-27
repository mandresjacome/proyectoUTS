// Página principal: Análisis de Documentos.
// Orquesta el flujo completo de la UI:
//   1. El usuario selecciona y sube un documento.
//   2. Se muestra el resultado del análisis de la IA (OCR + Gemini).
//   3. El usuario revisa y confirma la acción (Human-in-the-Loop).

import React, { useState } from 'react';
import FormularioDocumento from '../components/FormularioDocumento';
import ResultadoAnalisis from '../components/ResultadoAnalisis';
import documentoService from '../services/documento.service';

const PaginaAnalisis = () => {
  // Estado de carga: controla el spinner y deshabilita botones durante peticiones
  const [cargando, setCargando] = useState(false);

  // Estado de error: mensaje visible al usuario si algo falla
  const [error, setError] = useState(null);

  // Estado del resultado: datos devueltos por el backend tras el análisis
  const [resultado, setResultado] = useState(null);

  // Estado de confirmación: indica si el usuario ya aprobó el resultado
  const [confirmado, setConfirmado] = useState(false);

  /**
   * manejarEnvio — se ejecuta cuando el usuario envía el formulario con su archivo.
   * Reinicia todos los estados y llama al servicio de análisis.
   */
  const manejarEnvio = async (archivo) => {
    // Limpiar estados previos antes de iniciar una nueva petición
    setError(null);
    setResultado(null);
    setConfirmado(false);
    setCargando(true);

    try {
      const datos = await documentoService.analizarDocumento(archivo);
      // Guardar el resultado para que el usuario lo revise (HITL)
      setResultado(datos);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al analizar el documento.');
    } finally {
      // Siempre detener el indicador de carga, ocurra lo que ocurra
      setCargando(false);
    }
  };

  /**
   * manejarConfirmacion — se ejecuta SOLO si el usuario aprueba explícitamente el resultado.
   * Llama al endpoint de confirmación del backend y marca el flujo como completado.
   * Este es el punto de cierre del ciclo Human-in-the-Loop.
   */
  const manejarConfirmacion = async () => {
    setCargando(true);
    setError(null);

    try {
      // Enviar el análisis aprobado al backend para registrar la confirmación del usuario
      await documentoService.confirmarAccion(resultado);
      // Marcar como confirmado para actualizar la UI con un mensaje de éxito
      setConfirmado(true);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al confirmar la acción.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main>
      <h1>Gestión Documental — Análisis con IA</h1>

      {/* Formulario de carga: se oculta una vez confirmado para limpiar la vista */}
      {!confirmado && (
        <FormularioDocumento onEnviar={manejarEnvio} cargando={cargando} />
      )}

      {/* Indicador de carga mientras el backend procesa el documento */}
      {cargando && (
        <p className="spinner-texto">Procesando documento, por favor espere...</p>
      )}

      {/* Mensaje de error visible para el usuario */}
      {error && (
        <p className="alerta-error" role="alert">{error}</p>
      )}

      {/* Mensaje de éxito tras la confirmación del usuario */}
      {confirmado && (
        <div className="alerta-exito" role="status">
          <strong>¡Confirmado!</strong> El análisis fue revisado y aprobado correctamente.
        </div>
      )}

      {/* Resultado del análisis de la IA — solo visible si hay datos y aún no se confirmó */}
      {resultado && !confirmado && (
        <ResultadoAnalisis
          datos={resultado}
          onConfirmar={manejarConfirmacion}
          cargando={cargando}
        />
      )}
    </main>
  );
};

export default PaginaAnalisis;
