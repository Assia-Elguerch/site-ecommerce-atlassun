const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    numeroCommande: {
        type: String,
        unique: true,
        required: true
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'La commande doit appartenir à un utilisateur']
    },
    articles: [{
        produit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        nom: String,
        quantite: {
            type: Number,
            required: true,
            min: 1
        },
        prix: {
            type: Number,
            required: true
        },
        image: String
    }],
    adresseLivraison: {
        nom: { type: String, required: true },
        rue: { type: String, required: true },
        ville: { type: String, required: true },
        codePostal: { type: String, required: true },
        pays: { type: String, default: 'Maroc' },
        telephone: { type: String, required: true }
    },
    montantArticles: {
        type: Number,
        required: true
    },
    fraisLivraison: {
        type: Number,
        default: 0
    },
    taxe: {
        type: Number,
        default: 0
    },
    montantTotal: {
        type: Number,
        required: true
    },
    methodePaiement: {
        type: String,
        enum: ['carte', 'paypal', 'especes', 'virement', 'cod', 'paiement_livraison'],
        default: 'especes'
    },
    statutPaiement: {
        type: String,
        enum: ['en_attente', 'paye', 'echoue', 'rembourse'],
        default: 'en_attente'
    },
    statutCommande: {
        type: String,
        enum: ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'],
        default: 'en_attente'
    },
    datePaiement: Date,
    dateLivraison: Date,
    notes: String
}, {
    timestamps: true
});

// Générer un numéro de commande unique avant la sauvegarde
orderSchema.pre('save', function (next) {
    if (!this.numeroCommande) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.numeroCommande = `CMD-${year}${month}${day}-${random}`;
    }
    next();
});

// Index pour recherche rapide
orderSchema.index({ utilisateur: 1, createdAt: -1 });
orderSchema.index({ numeroCommande: 1 });

module.exports = mongoose.model('Order', orderSchema);