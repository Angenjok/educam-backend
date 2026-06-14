const express = require('express');
const router = express.Router();
const { proteger, autoriser } = require('../middleware/auth');
const { dashboard, listerUtilisateurs, changerRole, togglePublierCours, tousLesPaiements, supprimerUtilisateur } = require('../controllers/adminController');

router.use(proteger, autoriser('admin'));
router.get('/dashboard', dashboard);
router.get('/utilisateurs', listerUtilisateurs);
router.put('/utilisateurs/:id/role', changerRole);
router.delete('/utilisateurs/:id', supprimerUtilisateur);
router.put('/cours/:id/publier', togglePublierCours);
router.get('/paiements', tousLesPaiements);

module.exports = router;
