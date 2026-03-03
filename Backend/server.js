const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forzamos uso de DNS de Google

require('dotenv').config();

// ... resto de tu código
// ─── CONFIGURACIÓN E IMPORTACIONES ───────────────────────────
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
// const path = require('path');

// Esto le dice al servidor que busque los archivos en la carpeta Frontend
// Usamos '../' porque desde 'Backend' tenemos que salir una carpeta para entrar a 'Frontend'
app.use(express.static(path.join(__dirname, '../Frontend')));

// Esto asegura que cualquier ruta que no sea de API, cargue tu index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});
// GOOGLE
const passport = require('passport'); // <--- AÑADE ESTO AQUÍ
const GoogleStrategy = require('passport-google-oauth20').Strategy; // <--- AÑADE ESTO AQUÍ
const session = require('express-session'); // <--- AÑADE ESTO AQUÍ
// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    const allowed = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map(o => o.trim());

    // --- AGREGA ESTO PARA DEPURAR ---
    console.log("Origen detectado:", origin);
    console.log("Orígenes permitidos:", allowed);
    // --------------------------------

    if (!origin) return callback(null, true);

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
// ... tus otros middlewares (cors, json, etc)

app.use(session({
    secret: 'tu_secreto_super_seguro', 
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Aquí va la ESTRATEGIA DE PASSPORT (el bloque largo que te pasé antes)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ─── RUTAS DE LA API ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://127.0.0.1:5500/Frontend/index.html'); // Tu página de inicio
    }
);

// ─── CONEXIÓN A MONGODB ───────────────────────────────────────
console.log("Intentando conectar a:", process.env.MONGO_URI); // Debug para asegurar que carga

mongoose
  .connect(process.env.MONGO_URI, { 
    family: 4, // <--- ESTO ES LO QUE SOLUCIONA EL ERROR ECONNREFUSED
    serverSelectionTimeoutMS: 5000 // Tiempo de espera por si la red es lenta
  })
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });