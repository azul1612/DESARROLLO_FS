const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── REGISTRO ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Verificar si el correo ya existe
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Este correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatar || '🌱',
    });

    const guardado = await nuevoUsuario.save();

    const token = jwt.sign(
      { userId: guardado._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id:    guardado._id,
        name:   guardado.name,
        email:  guardado.email,
        avatar: guardado.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'No existe una cuenta con este correo' });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id:    usuario._id,
        name:   usuario.name,
        email:  usuario.email,
        avatar: usuario.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al hacer login' });
  }
});

// ─── RECUPERAR CONTRASEÑA (stub) ─────────────────────────────
//Esta parte no quedó del todo completa :(
// Implementa el envío real de email con nodemailer u otro servicio.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await User.findOne({ email });
    // Respondemos siempre 200 para no revelar si el email existe o no.
    if (!usuario) {
      return res.json({ message: 'Si el correo existe, recibirás un enlace de recuperación' });
    }
    // TODO: generar token temporal y enviar email
    res.json({ message: 'Si el correo existe, recibirás un enlace de recuperación' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
