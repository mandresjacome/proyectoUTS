// Componente para mostrar el resultado del análisis de la IA.
// Responsabilidad: presentar de forma legible los datos estructurados
// devueltos por Gemini y ofrecer al usuario el botón de confirmación (HITL).
// NUNCA ejecuta acciones finales por sí solo — solo notifica al padre.

import React from 'react';

/**
 * ResultadoAnalisis
 * Props:
 *   - datos: objeto del backend con forma { mensaje, datos: { tipo, resumen, datosRelevantes, sugerenciaRespuesta } }
 *   - onConfirmar: función del componente padre que ejecuta la acción final tras revisión del usuario
 *   - cargando: boolean que deshabilita el botón mientras hay una petición en curso
 */
const ResultadoAnalisis = ({ datos, onConfirmar, cargando }) => {
  // Extraer el análisis de Gemini del objeto de respuesta del backend
  const analisis = datos.datos || {};

  return (
    <section className="card" aria-label="Resultado del análisis">
      <h2>Resultado del Análisis</h2>

      {/* Tipo de documento detectado por Gemini */}
      {analisis.tipo && (
        <div className="ficha-resultado">
          <h3>Tipo de documento</h3>
          <span className="badge-tipo">{analisis.tipo}</span>
        </div>
      )}

      {/* Resumen del contenido del documento */}
      {analisis.resumen && (
        <div className="ficha-resultado">
          <h3>Resumen</h3>
          <p>{analisis.resumen}</p>
        </div>
      )}

      {/* Datos relevantes detectados en el documento */}
      {analisis.datosRelevantes?.descripcion && (
        <div className="ficha-resultado">
          <h3>Datos relevantes</h3>
          <p>{analisis.datosRelevantes.descripcion}</p>
        </div>
      )}

      {/* Sugerencia de respuesta generada por la IA para revisión del usuario.
          Este es el insumo principal del flujo HITL: el usuario lee la sugerencia
          y decide si la aprueba antes de ejecutar cualquier acción. */}
      {analisis.sugerenciaRespuesta && analisis.sugerenciaRespuesta !== 'null' && (
        <div className="ficha-resultado">
          <h3>Sugerencia de respuesta (generada por IA — revise antes de confirmar)</h3>
          <p>{analisis.sugerenciaRespuesta}</p>
        </div>
      )}

      {/* Botón de confirmación HITL:
          Solo el usuario puede disparar la acción final.
          El texto es explícito sobre lo que ocurrirá al confirmar. */}
      <button
        className="btn-confirmar"
        onClick={onConfirmar}
        disabled={cargando}
      >
        ✓ He revisado el análisis — Confirmar y guardar
      </button>
    </section>
  );
};

export default ResultadoAnalisis;
