const User = require('../models/User');
const jwt = require('jsonwebtoken');

const genererToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.inscription = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, classe, telephone, ville } = req.body;
    const existeDeja = await User.findOne({ email });
    if (existeDeja) return res.status(400).json({ succes: false, message: 'Email déjà utilisé.' });
    const utilisateur = await User.create({ nom, prenom, email, motDePasse, classe, telephone, ville });
    const token = genererToken(utilisateur._id);
    res.status(201).json({ succes: true, message: 'Inscription réussie !', token, utilisateur: { id: utilisateur._id, nom: utilisateur.nom, prenom: utilisateur.prenom, email: utilisateur.email, role: utilisateur.role, classe: utilisateur.classe } });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) return res.status(400).json({ succes: false, message: 'Email et mot de passe requis.' });
    const utilisateur = await User.findOne({ email }).select('+motDePasse');
    if (!utilisateur) return res.status(401).json({ succes: false, message: 'Email ou mot de passe incorrect.' });
    const ok = await utilisateur.comparePassword(motDePasse);
    if (!ok) return res.status(401).json({ succes: false, message: 'Email ou mot de passe incorrect.' });
    const token = genererToken(utilisateur._id);
    res.json({ succes: true, message: `Bon retour, ${utilisateur.prenom} !`, token, utilisateur: { id: utilisateur._id, nom: utilisateur.nom, prenom: utilisateur.prenom, email: utilisateur.email, role: utilisateur.role, classe: utilisateur.classe, abonnement: utilisateur.abonnement } });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.monProfil = async (req, res) => {
  try {
    const utilisateur = await User.findById(req.utilisateur._id).populate('coursInscrits', 'titre matiere thumbnail');
    res.json({ succes: true, utilisateur });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};

exports.modifierProfil = async (req, res) => {
  try {
    const champs = ['nom', 'prenom', 'telephone', 'ville', 'classe'];
    const miseAJour = {};
    champs.forEach(c => { if (req.body[c]) miseAJour[c] = req.body[c]; });
    const utilisateur = await User.findByIdAndUpdate(req.utilisateur._id, miseAJour, { new: true });
    res.json({ succes: true, utilisateur });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message });
  }
};
