const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.proteger = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ succes: false, message: 'Accès refusé.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ succes: false, message: 'Token invalide.' });
  }
};

exports.autoriser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({ succes: false, message: 'Accès interdit.' });
    }
    next();
  };
};
