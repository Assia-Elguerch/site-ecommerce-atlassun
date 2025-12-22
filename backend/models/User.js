const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Veuillez fournir un email valide']
    },
    motDePasse: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false // Ne pas retourner le mot de passe par défaut
    },
    telephone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v) || /^[0-9]{10,15}$/.test(v);
            },
            message: 'Le numéro de téléphone doit contenir 10 chiffres'
        }
    },
    adresse: {
        rue: String,
        ville: String,
        codePostal: String,
        pays: { type: String, default: 'Maroc' }
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg'
    },
    actif: {
        type: Boolean,
        default: true,
        select: false
    },
    twoFactorSecret: {
        type: String,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isTwoFactorEnabled: {
        type: Boolean,
        default: false
    },
    dateInscription: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index pour recherche rapide
userSchema.index({ email: 1 });

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', function (next) {
    if (!this.isModified('motDePasse')) {
        return next();
    }

    // Definitive safeguard: Check if it's already a bcrypt hash
    // (starts with $2a$ or $2b$ and length is typically 60)
    if (this.motDePasse &&
        (this.motDePasse.startsWith('$2a$') || this.motDePasse.startsWith('$2b$')) &&
        this.motDePasse.length === 60) {
        console.log(`[USER MODEL] Skipping hash for already-hashed password of ${this.email}`);
        return next();
    }

    console.log(`[USER MODEL] Hashing new plain-text password for ${this.email}`);
    const bcrypt = require('bcryptjs');
    bcrypt.genSalt(12)
        .then(salt => bcrypt.hash(this.motDePasse, salt))
        .then(hash => {
            this.motDePasse = hash;
            next();
        })
        .catch(err => {
            console.error(`[USER MODEL] Hashing failed for ${this.email}:`, err);
            next(err);
        });
});

// Méthode pour comparer les mots de passe (Promise based)
userSchema.methods.matchPassword = function (enteredPassword) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(enteredPassword, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);