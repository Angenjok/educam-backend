const express = require('express');
const router = express.Router();
const { proteger, autoriser } = require('../middleware/auth');
const { listerCours, detailCours, creerCours, modifierCours, ajouterLecon, sInscrire, supprimerCours } = require('../controllers/coursController');

router.get('/', listerCours);
router.get('/:id', detailCours);
router.post('/', proteger, autoriser('professeur', 'admin'), creerCours);
router.put('/:id', proteger, autoriser('professeur', 'admin'), modifierCours);
router.post('/:id/lecons', proteger, autoriser('professeur', 'admin'), ajouterLecon);
router.post('/:id/inscription', proteger, sInscrire);
router.delete('/:id', proteger, autoriser('admin'), supprimerCours);

module.exports = router;
