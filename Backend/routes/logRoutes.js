const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/authMiddleware');
const logController = require('../controllers/logController');

// Todas las rutas requieren token JWT
router.get('/',            auth, logController.getUserLogs);
router.post('/',           auth, logController.createLog);
router.patch('/badges',    auth, logController.updateBadges);
router.patch('/challenges',auth, logController.updateChallenges);

module.exports = router;
