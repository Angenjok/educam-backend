const express = require('express');
const router = express.Router();
const { inscription, connexion, monProfil, modifierProfil } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

router.post('/inscription', inscription);
router.post('/connexion', connexion);
router.get('/moi', proteger, monProfil);
router.put('/profil', proteger, modifierProfil);

module.exports = router;
