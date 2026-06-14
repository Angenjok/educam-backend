const mongoose = require('mongoose');

const LeconSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  dureeMinutes: { type: Number, default: 0 },
  ordre: { type: Number, default: 1 },
  gratuit: { type: Boolean, default: false }
});

const CourseSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  matiere: { type: String, required: true },
  niveau: { type: String, required: true },
  systeme: { type: String, default: 'Francophone' },
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lecons: [LeconSchema],
  thumbnail: { type: String, default: '' },
  prix: { type: Number, default: 0 },
  devise: { type: String, default: 'XAF' },
  nombreInscrits: { type: Number, default: 0 },
  note: {
    moyenne: { type: Number, default: 0 },
    nombreAvis: { type: Number, default: 0 }
  },
  publie: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
