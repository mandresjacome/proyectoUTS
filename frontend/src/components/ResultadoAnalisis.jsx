// Componente para mostrar el resultado del análisis de la IA.
// Responsabilidad: presentar los datos devueltos por el backend y
// ofrecer al usuario el botón de confirmación (Human-in-the-Loop).
// NUNCA ejecuta acciones finales por sí solo — solo notifica al padre.

import React from 'react';

/**
 * ResultadoAnalisis
 * Props:
 *   - datos: objeto con el resultado del análisis (tipo, datosRelevantes, sugerenciaRespuesta)
 *   - onConfirmar: función del componente padre que maneja la acción final
 *   - cargando: boolean que deshabilita el botón mientras hay una petición en curso
 */
const ResultadoAnalisis = ({ datos, onConfirmar, cargando }) => {
  return (
    <section aria-label="Resultado del análisis">
      <h2>Resultado del Análisis</h2>

      {/* Mostrar el mensaje orientativo del backend */}
      {datos.mensaje && <p>{datos.mensaje}</p>}

      {/* Sección de datos extraídos por la IA — se completará en Fase 4 */}
      {datos.datos && (
        <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
          {JSON.stringify(datos.datos, null, 2)}
        </pre>
      )}

      {/* Botón de confirmación HITL:
          El usuario debe revisar el resultado y decidir si confirma la acción.
          Este botón es la única vía para ejecutar la acción final — nunca es automático. */}
      <button onClick={onConfirmar} disabled={cargando}>
        Confirmar y continuar
      </button>
    </section>
  );
};

export default ResultadoAnalisis;
