const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: String, required: true },   // ej: 'bike', 'vegan', 'recycle'…
  name:    { type: String },                   // nombre legible del hábito (opcional, el front lo resuelve por habitId)
  value:   { type: Number, required: true },   // cantidad registrada
  unit:    { type: String },                   // unidad: km, comidas, kg…
  co2:     { type: Number, required: true },   // kg CO₂ ahorrados
  date:    { type: String, required: true },   // formato YYYY-MM-DD para facilitar filtros por día/semana
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
