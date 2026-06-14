const express = require('express');
const router = express.Router();
const { proteger } = require('../middleware/auth');
const { payerMTN, payerOrange, webhookMTN, historique } = require('../controllers/paiementController');

router.post('/mtn', proteger, payerMTN);
router.post('/orange', proteger, payerOrange);
router.post('/webhook/mtn', webhookMTN);
router.get('/historique', proteger, historique);

module.exports = router;
