const Course = require('../models/Course');
const User = require('../models/User');

exports.listerCours = async (req, res) => {
  try {
    const { matiere, niveau } = req.query;
    const filtre = { publie: true };
    if (matiere) filtre.matiere = matiere;
    if (niveau) filtre.niveau = niveau;
    const cours = await Course.find(filtre).populate('professeur', 'nom prenom').select('-lecons').sort('-createdAt');
    res.json({ succes: true, total: cours.length, cours });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.detailCours = async (req, res) => {
  try {
    const cours = await Course.findById(req.params.id).populate('professeur', 'nom prenom ville');
    if (!cours || !cours.publie) return res.status(404).json({ succes: false, message: 'Cours introuvable.' });
    res.json({ succes: true, cours });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.creerCours = async (req, res) => {
  try {
    req.body.professeur = req.utilisateur._id;
    const cours = await Course.create(req.body);
    res.status(201).json({ succes: true, message: 'Cours créé !', cours });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.modifierCours = async (req, res) => {
  try {
    const cours = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ succes: true, cours });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.sInscrire = async (req, res) => {
  try {
    const cours = await Course.findById(req.params.id);
    if (!cours) return res.status(404).json({ succes: false, message: 'Cours introuvable.' });
    if (cours.prix > 0) return res.status(400).json({ succes: false, message: 'Cours payant.' });
    await User.findByIdAndUpdate(req.utilisateur._id, { $addToSet: { coursInscrits: cours._id } });
    await Course.findByIdAndUpdate(cours._id, { $inc: { nombreInscrits: 1 } });
    res.json({ succes: true, message: 'Inscription réussie !' });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.supprimerCours = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ succes: true, message: 'Cours supprimé.' });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.ajouterLecon = async (req, res) => {
  try {
    const cours = await Course.findById(req.params.id);
    if (!cours) return res.status(404).json({ succes: false, message: 'Cours introuvable.' });
    cours.lecons.push({ ...req.body, ordre: cours.lecons.length + 1 });
    await cours.save();
    res.status(201).json({ succes: true, cours });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};
