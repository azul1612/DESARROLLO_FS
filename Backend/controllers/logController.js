const Log  = require('../models/Log');
const User = require('../models/User');

// ─── GET /api/logs ────────────────────────────────────────────
// Devuelve todos los logs del usuario + badges y challenges guardados en User
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.usuario.userId }).sort({ date: 1 });
    const user = await User.findById(req.usuario.userId).select('unlockedBadges challenges');

    res.json({
      logs,
      unlockedBadges: user.unlockedBadges || [],
      challenges:     user.challenges ? Object.fromEntries(user.challenges) : {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
};

// ─── POST /api/logs ───────────────────────────────────────────
// Crea un nuevo log de hábito
exports.createLog = async (req, res) => {
  try {
    const { habitId, name, value, unit, co2, date } = req.body;

    const nuevoLog = new Log({
      user: req.usuario.userId,
      habitId,
      name,
      value,
      unit,
      co2,
      date,
    });

    const guardado = await nuevoLog.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al guardar el hábito' });
  }
};

// ─── PATCH /api/logs/badges ───────────────────────────────────
// Actualiza las medallas desbloqueadas del usuario
exports.updateBadges = async (req, res) => {
  try {
    const { unlockedBadges } = req.body;

    await User.findByIdAndUpdate(
      req.usuario.userId,
      { unlockedBadges },
      { new: true }
    );

    res.json({ message: 'Badges actualizados', unlockedBadges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar badges' });
  }
};

// ─── PATCH /api/logs/challenges ───────────────────────────────
// Actualiza los desafíos a los que el usuario se ha unido
exports.updateChallenges = async (req, res) => {
  try {
    const { challenges } = req.body; // { noplastic: true, bikeweek: false, ... }

    await User.findByIdAndUpdate(
      req.usuario.userId,
      { challenges },
      { new: true }
    );

    res.json({ message: 'Desafíos actualizados', challenges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar desafíos' });
  }
};
