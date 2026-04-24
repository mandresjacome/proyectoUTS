// Punto de entrada y configuración central de Express.
// Se centraliza aquí la inicialización del servidor, middlewares globales
// y el registro de rutas, para mantener el código modular y fácil de escalar.

const express = require('express');
const cors = require('cors');

// Importar las rutas del módulo de documentos
const documentoRoutes = require('./routes/documento.routes');

// Importar el middleware de errores global (debe registrarse al final)
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Middlewares globales ---

// Permitir solicitudes desde el frontend (CORS)
// En producción se debe restringir el origen al dominio real del frontend
app.use(cors());

// Parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// --- Registro de rutas ---

// Todas las rutas relacionadas a documentos bajo el prefijo /api/documentos
app.use('/api/documentos', documentoRoutes);

// --- Middleware de errores global ---
// IMPORTANTE: debe ir al final, después de todas las rutas,
// para capturar cualquier error propagado con next(error)
app.use(errorHandler);

module.exports = app;
