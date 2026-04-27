# Bitácora de Avance — Proyecto de Grado UTS
**Aplicación web con IA para la gestión documental en Mipymes de Bucaramanga**

- **Tech Lead:** ProyectoMarioJacome
- **Repositorio:** https://github.com/mandresjacome/proyectoUTS
- **Fecha de última actualización:** 27 de abril de 2026
- **Fase actual:** Fases 1–4 completadas ✅ — Sistema end-to-end funcional en producción local

---

## Estado General de la Hoja de Ruta

| # | Fase | Estado |
|---|------|--------|
| 1 | Análisis de documentos | ✅ Completada |
| 2 | Estructura y Arquitectura | ✅ Completada |
| 3 | OCR con Google Cloud Document AI | ✅ Completada |
| 4 | Integración Gemini API y UI React | ✅ Completada |
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
├── package.json               ← raíz del monorepo (npm workspaces)
├── package-lock.json
├── AVANCE.md
├── .github/
│   ├── agents/
│   │   └── dev-uts.agent.md
│   ├── instructions/
│   │   ├── backend.instructions.md
│   │   └── react.instructions.md
│   └── instrucciones.md
├── backend/
│   ├── package.json
│   ├── .env                   ← credenciales reales (en .gitignore)
│   ├── .env.example
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   │   └── documento.routes.js
│   ├── controllers/
│   │   └── documento.controller.js
│   ├── services/
│   │   ├── ocr.service.js     ← implementado con Document AI ✅
│   │   └── gemini.service.js  ← implementado con Gemini API ✅
│   ├── middlewares/
│   │   ├── validarArchivo.js
│   │   └── errorHandler.js
│   └── credenciales/          ← carpeta en .gitignore (solo .gitkeep en repo)
│       └── gen-lang-client-*.json
└── frontend/
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.jsx
        ├── App.jsx
        ├── pages/
        │   └── PaginaAnalisis.jsx
        ├── components/
        │   ├── FormularioDocumento.jsx
        │   └── ResultadoAnalisis.jsx
        └── services/
            └── documento.service.js
```

### 2.4 Detalle de archivos implementados

#### Backend

| Archivo | Responsabilidad |
|---------|----------------|
| `server.js` | Arranque del servidor; separado de `app.js` para permitir tests |
| `app.js` | Configuración central de Express, registro de rutas y errorHandler global |
| `routes/documento.routes.js` | Mapeo de endpoints a controladores; sin lógica de negocio |
| `controllers/documento.controller.js` | Orquestación del flujo req/res; delega a servicios |
| `services/ocr.service.js` | Implementado con Google Cloud Document AI ✅ |
| `services/gemini.service.js` | Implementado con Google Gemini API ✅ |
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
- `multer` ^2.1.1 *(actualizado desde 1.x por vulnerabilidades de seguridad)*
- `cors` ^2.8.5
- `dotenv` ^16.0.0
- `@google-cloud/documentai` *(instalado en Fase 3)*
- `@google/genai` *(instalado en Fase 4)*
- `nodemon` ^3.0.0 (dev)

**Frontend (`frontend/package.json`):**
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `vite` ^5.0.0 (dev)
- `@vitejs/plugin-react` ^4.0.0 (dev)

---

## Fase 3 — OCR con Google Cloud Document AI ✅

### Configuración GCP realizada

| Parámetro | Valor |
|-----------|-------|
| Project ID | `1056737479696` |
| Processor ID | `37b66121a8efb8f2` |
| Processor Name | `ocr-mipymes` |
| Tipo | Document OCR |
| Región | `us` |

### Variables configuradas en `backend/.env`

```
GOOGLE_APPLICATION_CREDENTIALS=./credenciales/gen-lang-client-*.json
DOCUMENT_AI_PROJECT_ID=1056737479696
DOCUMENT_AI_LOCATION=us
DOCUMENT_AI_PROCESSOR_ID=37b66121a8efb8f2
```

### Implementación de `ocr.service.js`

- Recibe el `buffer` en memoria desde `multer.memoryStorage()` — nunca se escribe en disco.
- Codifica el buffer en **base64** (formato requerido por la API de Document AI).
- Envía la petición al procesador OCR en GCP mediante el SDK `@google-cloud/documentai`.
- Extrae y devuelve el texto completo del documento procesado.
- Lanza error descriptivo si no se detecta texto legible en el documento.

---

## Fase 4 — Integración Gemini API y UI React ✅

### 4.1 Backend — Gemini API ✅

**Variable configurada en `backend/.env`:**
```
GEMINI_API_KEY=*** (configurada localmente, no en repositorio)
```

**Implementación de `gemini.service.js`:**
- Recibe el texto extraído por el servicio OCR.
- Envía un prompt estructurado a `gemini-2.5-flash` mediante el SDK `@google/genai`.
- El prompt instruye al modelo a responder **solo con JSON válido** (sin markdown) con esta estructura:
  ```json
  {
    "tipo": "categoría del documento",
    "resumen": "descripción breve del contenido",
    "datosRelevantes": { "descripcion": "campos clave detectados" },
    "sugerenciaRespuesta": "borrador de respuesta profesional o null"
  }
  ```
- La respuesta se limpia de bloques markdown antes del parseo (algunos modelos los incluyen
  a pesar de que el prompt lo prohíbe) y se parsea con `JSON.parse()`.
- El resultado **siempre va al frontend para revisión del usuario** antes de cualquier acción (HITL).

**Nota:** Se requirió recargar créditos en AI Studio (plan de pago) para habilitar el acceso.
El modelo `gemini-2.0-flash` fue deprecado para nuevos usuarios; se migró a `gemini-2.5-flash`.

### 4.2 Frontend — UI React ✅

Todos los componentes implementados y probados con flujo end-to-end exitoso:

| Componente | Estado |
|-----------|--------|
| `PaginaAnalisis.jsx` | ✅ Flujo HITL completo (subida → análisis → confirmación) |
| `FormularioDocumento.jsx` | ✅ Validación en cliente + subida multipart |
| `ResultadoAnalisis.jsx` | ✅ Fichas de análisis + botón confirmar HITL |
| `documento.service.js` | ✅ Fetch a `/analizar` y `/confirmar` |
| `index.css` | ✅ Estilos completos con diseño UTS |

### 4.3 Prueba end-to-end exitosa ✅ — 27 de abril de 2026

**Documento de prueba:** PQRS — Derecho de Petición (Carlos Arturo Gómez, C.C. 13.555.444)

**Flujo validado:**
1. Usuario sube PDF en `http://localhost:5173`
2. Backend recibe el archivo en buffer RAM (Zero Storage)
3. OCR extrae el texto completo del documento
4. Gemini analiza y devuelve JSON estructurado
5. Frontend muestra: tipo `PQRS (Petición/Reclamo)`, resumen, datos relevantes y carta de respuesta profesional completa
6. Usuario revisa y puede confirmar con el botón HITL

---

## Entorno del Monorepo

Se configuró **npm workspaces** con un `package.json` raíz para gestionar ambos proyectos desde un solo lugar:

| Comando | Acción |
|---------|--------|
| `npm install --workspaces` | Instala dependencias de backend y frontend |
| `npm run dev:backend` | Arranca el backend con nodemon |
| `npm run dev:frontend` | Arranca el frontend con Vite |
| `npm run dev` | Arranca ambos simultáneamente |
| `npm run build:frontend` | Genera build de producción del frontend |

---

## Próximos pasos — Fase 5 (Evaluación)

1. Preparar documentos de prueba variados (facturas, contratos, cartas).
2. Evaluar precisión del OCR y calidad de las respuestas de Gemini.
3. Documentar resultados de la evaluación en esta bitácora.

---

## Comandos para arrancar el proyecto

```bash
# Desde la raíz del monorepo — instala todo de una vez
npm install --workspaces

# Arrancar backend (terminal 1)
npm run dev:backend

# Arrancar frontend (terminal 2)
npm run dev:frontend
```

El backend corre en `http://localhost:3001` y el frontend en `http://localhost:5173` (por defecto en Vite).
