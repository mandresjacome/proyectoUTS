# Bitácora de Avance — Proyecto de Grado UTS
**Aplicación web con IA para la gestión documental en Mipymes de Bucaramanga**

- **Tech Lead:** ProyectoMarioJacome
- **Fecha de última actualización:** 24 de abril de 2026
- **Fase actual:** 2 — Estructura y Arquitectura ✅ Completada

---

## Estado General de la Hoja de Ruta

| # | Fase | Estado |
|---|------|--------|
| 1 | Análisis de documentos | ✅ Completada |
| 2 | Estructura y Arquitectura | ✅ Completada |
| 3 | OCR con Google Cloud Document AI | ⏳ Pendiente |
| 4 | Integración Gemini API y UI React | ⏳ Pendiente |
| 5 | Evaluación | ⏳ Pendiente |

---

## Fase 1 — Análisis de Documentos ✅

Se definieron los requerimientos funcionales y no funcionales del sistema, el stack tecnológico obligatorio y los principios arquitectónicos innegociables del proyecto.

### Stack tecnológico definido

| Capa | Tecnología |
|------|-----------|
| Frontend | React (componentes funcionales + Hooks) |
| Backend | Node.js con Express |
| OCR | Google Cloud Document AI |
| IA / Análisis | Google Gemini API |

### Principios arquitectónicos definidos

**Zero Storage:** ningún archivo físico se guarda en servidor ni en la nube. El flujo es: `cliente → buffer en RAM (multer.memoryStorage()) → OCR → descarte inmediato`.

**Human-in-the-Loop (HITL):** el sistema no es autónomo. Siempre devuelve el resultado de la IA al frontend para que el usuario lo revise y confirme antes de ejecutar cualquier acción final.

---

## Fase 2 — Estructura y Arquitectura ✅

### 2.1 Configuración del agente de desarrollo

Se creó el agente personalizado de GitHub Copilot para el proyecto:

- **Archivo:** `.github/agents/dev-uts.agent.md`
- **Propósito:** agente con la identidad completa del proyecto (stack, reglas Zero Storage, HITL, comentarios en español). Se activa desde el selector de agentes de Copilot.

### 2.2 Instrucciones de código automáticas

Se crearon dos archivos de instrucciones que Copilot aplica automáticamente al trabajar con los archivos correspondientes:

| Archivo | Se activa para | Cubre |
|---------|---------------|-------|
| `.github/instructions/backend.instructions.md` | `backend/**`, `server/**` | multer memoryStorage, validación de archivos, try/catch + next(error), estructura modular, convenciones de nombrado |
| `.github/instructions/react.instructions.md` | `frontend/**`, `**/*.jsx`, `**/*.tsx` | componentes funcionales, validación en cliente, estados cargando/error/resultado, capa services, flujo HITL en UI |

### 2.3 Estructura del proyecto creada

```
proyectoUTS/
├── .gitignore
├── .github/
│   ├── agents/
│   │   └── dev-uts.agent.md
│   ├── instructions/
│   │   ├── backend.instructions.md
│   │   └── react.instructions.md
│   └── instrucciones.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js               ← arranque del servidor
│   ├── app.js                  ← configuración Express + rutas + errorHandler
│   ├── routes/
│   │   └── documento.routes.js
│   ├── controllers/
│   │   └── documento.controller.js
│   ├── services/
│   │   ├── ocr.service.js        ← stub para Fase 3
│   │   └── gemini.service.js     ← stub para Fase 4
│   └── middlewares/
│       ├── validarArchivo.js  ← multer memoryStorage + validación tipo/tamaño
│       └── errorHandler.js    ← manejo centralizado de errores
└── frontend/
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.jsx
        ├── App.jsx
        ├── pages/
        │   └── PaginaAnalisis.jsx   ← orquesta el flujo HITL completo
        ├── components/
        │   ├── FormularioDocumento.jsx  ← validación en cliente
        │   └── ResultadoAnalisis.jsx   ← muestra IA + botón confirmación
        └── services/
            └── documento.service.js    ← fetch al backend
```

### 2.4 Detalle de archivos implementados

#### Backend

| Archivo | Responsabilidad |
|---------|----------------|
| `server.js` | Arranque del servidor; separado de `app.js` para permitir tests |
| `app.js` | Configuración central de Express, registro de rutas y errorHandler global |
| `routes/documento.routes.js` | Mapeo de endpoints a controladores; sin lógica de negocio |
| `controllers/documento.controller.js` | Orquestación del flujo req/res; delega a servicios |
| `services/ocr.service.js` | Stub documentado; listo para conectar con Document AI en Fase 3 |
| `services/gemini.service.js` | Stub documentado; listo para conectar con Gemini API en Fase 4 |
| `middlewares/validarArchivo.js` | multer memoryStorage + fileFilter (tipo MIME) + límite 10 MB |
| `middlewares/errorHandler.js` | Middleware de errores global (4 parámetros), respuestas JSON consistentes |

#### Frontend

| Archivo | Responsabilidad |
|---------|----------------|
| `src/index.jsx` | Punto de entrada; monta `<App />` en el DOM |
| `src/App.jsx` | Enrutamiento raíz; renderiza `PaginaAnalisis` |
| `pages/PaginaAnalisis.jsx` | Orquesta el flujo HITL completo: subida → resultado → confirmación |
| `components/FormularioDocumento.jsx` | Captura el archivo, valida tipo/tamaño en cliente antes del fetch |
| `components/ResultadoAnalisis.jsx` | Muestra el análisis de la IA y el botón de confirmación explícita |
| `services/documento.service.js` | Capa de fetch al backend; centraliza las llamadas HTTP |

### 2.5 Endpoints definidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/documentos/analizar` | Recibe documento, ejecuta OCR + Gemini, devuelve resultado para revisión HITL |
| `POST` | `/api/documentos/confirmar` | Acción final — solo se llama tras confirmación explícita del usuario |

### 2.6 Dependencias del proyecto

**Backend (`backend/package.json`):**
- `express` ^4.18.0
- `multer` ^1.4.5-lts.1
- `cors` ^2.8.5
- `dotenv` ^16.0.0
- `nodemon` ^3.0.0 (dev)

**Frontend (`frontend/package.json`):**
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `vite` ^5.0.0 (dev)
- `@vitejs/plugin-react` ^4.0.0 (dev)

---

## Próximos pasos — Fase 3

Para implementar el OCR se necesita:

1. Crear un proyecto en Google Cloud Platform y habilitar la API de Document AI.
2. Crear un procesador de tipo **Document OCR** en la consola de GCP.
3. Generar una cuenta de servicio y descargar el archivo de credenciales JSON.
4. Configurar las variables en `backend/.env`:
   - `GOOGLE_APPLICATION_CREDENTIALS`
   - `DOCUMENT_AI_PROJECT_ID`
   - `DOCUMENT_AI_LOCATION`
   - `DOCUMENT_AI_PROCESSOR_ID`
5. Instalar el SDK: `npm install @google-cloud/documentai`.
6. Implementar `backend/services/ocr.service.js` reemplazando el stub actual.

---

## Comandos para arrancar el proyecto

```bash
# Instalar dependencias del backend
cd backend
npm install

# Copiar variables de entorno y completarlas
cp .env.example .env

# Arrancar el backend en modo desarrollo
npm run dev
```

```bash
# Instalar dependencias del frontend (en otra terminal)
cd frontend
npm install

# Copiar variables de entorno
cp .env.example .env

# Arrancar el frontend
npm run dev
```

El backend corre en `http://localhost:3001` y el frontend en `http://localhost:5173` (por defecto en Vite).
