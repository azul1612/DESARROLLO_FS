const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '🌱' },          // emoji de avatar elegido al registrarse
  unlockedBadges: { type: [String], default: [] },  // IDs de medallas desbloqueadas
  challenges: { type: Map, of: Boolean, default: {} }, // estado de desafíos { challengeId: true/false }
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
