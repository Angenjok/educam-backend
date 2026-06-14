const User = require('../models/User');
const Course = require('../models/Course');
const Paiement = require('../models/Paiement');

exports.dashboard = async (req, res) => {
  try {
    const [totalEleves, totalProfs, totalCours, paiements] = await Promise.all([
      User.countDocuments({ role: 'eleve' }),
      User.countDocuments({ role: 'professeur' }),
      Course.countDocuments({ publie: true }),
      Paiement.find({ statut: 'reussi' })
    ]);
    const revenuTotal = paiements.reduce((s, p) => s + p.montant, 0);
    res.json({ succes: true, stats: { totalEleves, totalProfs, totalCours, revenuTotal } });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.listerUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await User.find().select('-motDePasse').sort('-createdAt');
    res.json({ succes: true, total: utilisateurs.length, utilisateurs });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.changerRole = async (req, res) => {
  try {
    const utilisateur = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-motDePasse');
    res.json({ succes: true, utilisateur });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.togglePublierCours = async (req, res) => {
  try {
    const cours = await Course.findById(req.params.id);
    if (!cours) return res.status(404).json({ succes: false, message: 'Cours introuvable.' });
    cours.publie = !cours.publie;
    await cours.save();
    res.json({ succes: true, publie: cours.publie });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.tousLesPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find().populate('utilisateur', 'nom prenom email').populate('cours', 'titre').sort('-createdAt');
    res.json({ succes: true, paiements });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.supprimerUtilisateur = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ succes: true, message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};
