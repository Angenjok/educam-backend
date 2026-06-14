const mongoose = require('mongoose');

const PaiementSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cours: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  montant: { type: Number, required: true },
  devise: { type: String, default: 'XAF' },
  operateur: { type: String, enum: ['MTN', 'Orange', 'carte_bancaire'], required: true },
  numeroPaiement: { type: String, required: true },
  typePaiement: { type: String, enum: ['cours', 'abonnement_mensuel', 'abonnement_annuel'], required: true },
  statut: { type: String, enum: ['en_attente', 'reussi', 'echoue', 'rembourse'], default: 'en_attente' },
  referenceTransaction: { type: String, default: '' },
  referenceOperateur: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Paiement', PaiementSchema);
