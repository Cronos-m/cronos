/**
 * Servidor Node.js para Cronos Magia.
 * Gestiona tanto los archivos estáticos (Frontend) como las rutas de API (Backend).
 * 
 * Instrucciones de instalación:
 * 1. Abre la terminal en la carpeta 'backend'.
 * 2. Ejecuta: npm init -y
 * 3. Ejecuta: npm install express cookie-parser
 * 4. Ejecuta: node server.js
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

// =========================================
// MIDDLEWARES GLOBALES
// =========================================

// 1. Parsear cookies de las peticiones entrantes
app.use(cookieParser());

// 2. Parsear cuerpos de formularios (JSON y URL-encoded)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Servir archivos estáticos (Frontend)
// Le decimos a Express que busque los archivos HTML/CSS/JS en la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// =========================================
// RUTAS DE API (BACKEND)
// =========================================

/**
 * Ruta de Login (Simulada)
 * Establece una cookie de sesión segura.
 */
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    if (usuario === 'cronos' && password === 'magia123') {
        const sessionToken = crypto.randomBytes(32).toString('hex');

        const cookieOptions = {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'strict',  
            maxAge: 1000 * 60 * 60 * 24 // 24 horas
        };

        res.cookie('session_token', sessionToken, cookieOptions);
        res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
});

/**
 * Ruta protegida de ejemplo
 */
app.get('/api/panel-mago', (req, res) => {
    const token = req.cookies.session_token;

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado.' });
    }
    
    res.status(200).json({ message: 'Bienvenido al panel privado, Cronos.' });
});

/**
 * Ruta de Logout
 */
app.post('/api/logout', (req, res) => {
    res.clearCookie('session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Sesión cerrada.' });
});

// =========================================
// RUTAS DE FALLBACK (FRONTEND)
// =========================================

// Para cualquier otra ruta que no sea /api, servimos el index.html
// Esto permite que las rutas internas del frontend funcionen correctamente.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =========================================
// INICIO DEL SERVIDOR
// =========================================
app.listen(PORT, () => {
    console.log(`[Servidor] Corriendo en http://localhost:${PORT}`);
    console.log('[Servidor] Frontend servido desde la carpeta /frontend');
    console.log('[Servidor] API disponible en /api/...');
});