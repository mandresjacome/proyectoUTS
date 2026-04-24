// Componente raíz de la aplicación.
// Responsabilidad: definir el enrutamiento principal entre páginas.
// En esta fase inicial solo existe la página de análisis de documentos.

import React from 'react';
import PaginaAnalisis from './pages/PaginaAnalisis';

const App = () => {
  // Por ahora no se usa un router externo; se irán agregando rutas
  // en la Fase 4 cuando la UI esté completa
  return (
    <div className="app">
      <PaginaAnalisis />
    </div>
  );
};

export default App;
