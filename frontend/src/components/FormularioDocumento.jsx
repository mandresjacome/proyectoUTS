// Componente de formulario para la carga de documentos.
// Responsabilidad: capturar el archivo del usuario, validarlo en el cliente
// (antes de cualquier llamada al servidor) y notificar al componente padre.

import React, { useState } from 'react';

// Tipos de archivo aceptados — deben coincidir con los validados en el backend
const TIPOS_PERMITIDOS = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff'];
const TAMANO_MAXIMO = 10 * 1024 * 1024; // 10 MB en bytes

/**
 * validarArchivo — valida tipo y tamaño antes de llamar al backend.
 * Retorna un mensaje de error o null si el archivo es válido.
 */
const validarArchivo = (archivo) => {
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return 'Tipo de archivo no permitido. Solo se aceptan PDF, PNG, JPEG o TIFF.';
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return 'El archivo supera el tamaño máximo permitido de 10 MB.';
  }
  return null; // null indica que el archivo es válido
};

/**
 * FormularioDocumento
 * Props:
 *   - onEnviar(archivo): función del componente padre que procesa el archivo válido
 *   - cargando: boolean que deshabilita el formulario mientras hay una petición en curso
 */
const FormularioDocumento = ({ onEnviar, cargando }) => {
  // Archivo seleccionado por el usuario
  const [archivo, setArchivo] = useState(null);

  // Error de validación del lado del cliente
  const [errorValidacion, setErrorValidacion] = useState(null);

  /**
   * manejarCambioArchivo — se dispara cuando el usuario selecciona un archivo.
   * Valida inmediatamente para dar feedback rápido antes del envío.
   */
  const manejarCambioArchivo = (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    if (!archivoSeleccionado) return;

    const mensajeError = validarArchivo(archivoSeleccionado);
    if (mensajeError) {
      // Mostrar el error y limpiar la selección para evitar confusiones
      setErrorValidacion(mensajeError);
      setArchivo(null);
      return;
    }

    // El archivo pasó la validación: limpiar error y guardar en estado
    setErrorValidacion(null);
    setArchivo(archivoSeleccionado);
  };

  /**
   * manejarEnvio — se dispara al hacer clic en "Analizar".
   * Solo propaga el archivo al padre si pasó la validación.
   */
  const manejarEnvio = (evento) => {
    evento.preventDefault();
    if (!archivo) return;
    onEnviar(archivo);
  };

  return (
    <form onSubmit={manejarEnvio}>
      <label htmlFor="documento">Seleccionar documento (PDF, PNG, JPEG, TIFF — máx. 10 MB):</label>
      <input
        id="documento"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif"
        onChange={manejarCambioArchivo}
        disabled={cargando}
      />

      {/* Error de validación del cliente */}
      {errorValidacion && <p role="alert" style={{ color: 'red' }}>{errorValidacion}</p>}

      <button type="submit" disabled={!archivo || cargando}>
        {cargando ? 'Analizando...' : 'Analizar documento'}
      </button>
    </form>
  );
};

export default FormularioDocumento;
