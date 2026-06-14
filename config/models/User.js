const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  telephone: { type: String, trim: true },
  motDePasse: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['eleve', 'professeur', 'admin'], default: 'eleve' },
  classe: { type: String, default: 'autre' },
  ville: { type: String, default: '' },
  coursInscrits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  abonnement: {
    type: { type: String, enum: ['gratuit','mensuel','annuel'], default: 'gratuit' },
    dateDebut: Date,
    dateFin: Date,
    actif: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

UserSchema.methods.comparePassword = async function(mdp) {
  return await bcrypt.compare(mdp, this.motDePasse);
};

module.exports = mongoose.model('User', UserSchema);
