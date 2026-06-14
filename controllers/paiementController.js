const Paiement = require('../models/Paiement');
const User = require('../models/User');
const Course = require('../models/Course');

const genererReference = () => `EDUCAM-${Date.now()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

async function activerAcces(userId, coursId, typePaiement) {
  if (typePaiement === 'cours' && coursId) {
    await User.findByIdAndUpdate(userId, { $addToSet: { coursInscrits: coursId } });
    await Course.findByIdAndUpdate(coursId, { $inc: { nombreInscrits: 1 } });
  } else if (typePaiement === 'abonnement_mensuel') {
    const fin = new Date(); fin.setMonth(fin.getMonth() + 1);
    await User.findByIdAndUpdate(userId, { 'abonnement.type': 'mensuel', 'abonnement.dateDebut': new Date(), 'abonnement.dateFin': fin, 'abonnement.actif': true });
  } else if (typePaiement === 'abonnement_annuel') {
    const fin = new Date(); fin.setFullYear(fin.getFullYear() + 1);
    await User.findByIdAndUpdate(userId, { 'abonnement.type': 'annuel', 'abonnement.dateDebut': new Date(), 'abonnement.dateFin': fin, 'abonnement.actif': true });
  }
}

exports.payerMTN = async (req, res) => {
  try {
    const { numeroPaiement, coursId, typePaiement } = req.body;
    let montant = typePaiement === 'abonnement_mensuel' ? 2500 : typePaiement === 'abonnement_annuel' ? 20000 : 0;
    let coursRef = null;
    if (typePaiement === 'cours' && coursId) {
      const cours = await Course.findById(coursId);
      if (!cours) return res.status(404).json({ succes: false, message: 'Cours introuvable.' });
      montant = cours.prix; coursRef = cours._id;
    }
    const reference = genererReference();
    await Paiement.create({ utilisateur: req.utilisateur._id, cours: coursRef, montant, operateur: 'MTN', numeroPaiement, typePaiement, referenceTransaction: reference, statut: 'reussi' });
    await activerAcces(req.utilisateur._id, coursRef, typePaiement);
    res.json({ succes: true, message: '✅ Paiement MTN réussi !', reference, statut: 'reussi' });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.payerOrange = async (req, res) => {
  try {
    const { numeroPaiement, coursId, typePaiement } = req.body;
    let montant = typePaiement === 'abonnement_mensuel' ? 2500 : typePaiement === 'abonnement_annuel' ? 20000 : 0;
    let coursRef = null;
    if (typePaiement === 'cours' && coursId) {
      const cours = await Course.findById(coursId);
      if (!cours) return res.status(404).json({ succes: false, message: 'Cours introuvable.' });
      montant = cours.prix; coursRef = cours._id;
    }
    const reference = genererReference();
    await Paiement.create({ utilisateur: req.utilisateur._id, cours: coursRef, montant, operateur: 'Orange', numeroPaiement, typePaiement, referenceTransaction: reference, statut: 'reussi' });
    await activerAcces(req.utilisateur._id, coursRef, typePaiement);
    res.json({ succes: true, message: '✅ Paiement Orange Money réussi !', reference, statut: 'reussi' });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.webhookMTN = async (req, res) => res.status(200).json({ message: 'OK' });

exports.historique = async (req, res) => {
  try {
    const paiements = await Paiement.find({ utilisateur: req.utilisateur._id }).populate('cours', 'titre').sort('-createdAt');
    res.json({ succes: true, paiements });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};
