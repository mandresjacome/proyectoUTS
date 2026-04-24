// Página principal: Análisis de Documentos.
// Orquesta el flujo completo de la UI:
//   1. El usuario selecciona y sube un documento.
//   2. Se muestra el resultado del análisis de la IA.
//   3. El usuario revisa y confirma la acción (Human-in-the-Loop).

import React, { useState } from 'react';
import FormularioDocumento from '../components/FormularioDocumento';
import ResultadoAnalisis from '../components/ResultadoAnalisis';
import documentoService from '../services/documento.service';

const PaginaAnalisis = () => {
  // Estado de carga: controla el spinner y deshabilita el botón de envío
  const [cargando, setCargando] = useState(false);

  // Estado de error: mensaje visible al usuario si algo falla
  const [error, setError] = useState(null);

  // Estado del resultado: datos devueltos por el backend tras el análisis
  const [resultado, setResultado] = useState(null);

  /**
   * manejarEnvio — se ejecuta cuando el usuario envía el formulario con su archivo.
   * Valida el archivo, llama al servicio y actualiza los estados correspondientes.
   */
  const manejarEnvio = async (archivo) => {
    // Limpiar estados previos antes de iniciar una nueva petición
    setError(null);
    setResultado(null);
    setCargando(true);

    try {
      const datos = await documentoService.analizarDocumento(archivo);
      // Guardar el resultado para que el usuario lo revise (HITL)
      setResultado(datos);
    } catch (err) {
      // Mostrar el mensaje de error al usuario de forma comprensible
      setError(err.message || 'Ocurrió un error al analizar el documento.');
    } finally {
      // Siempre detener el indicador de carga, independientemente del resultado
      setCargando(false);
    }
  };

  /**
   * manejarConfirmacion — se ejecuta SOLO si el usuario aprueba explícitamente la acción.
   * Implementación pendiente para la Fase 4.
   */
  const manejarConfirmacion = async () => {
    // TODO Fase 4: llamar a documentoService.confirmar(resultado) tras aprobación del usuario
    console.log('Usuario confirmó la acción. Pendiente implementación Fase 4.');
  };

  return (
    <main>
      <h1>Gestión Documental — Análisis con IA</h1>

      {/* Formulario de carga del documento */}
      <FormularioDocumento onEnviar={manejarEnvio} cargando={cargando} />

      {/* Mensaje de error visible para el usuario */}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {/* Resultado del análisis: solo se muestra si hay datos y no está cargando */}
      {resultado && (
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
