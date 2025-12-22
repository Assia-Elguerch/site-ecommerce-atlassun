const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom du produit est requis'],
        trim: true,
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    description: {
        type: String,
        required: [true, 'La description est requise'],
        maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
    },
    prix: {
        type: Number,
        required: [true, 'Le prix est requis'],
        min: [0, 'Le prix ne peut pas être négatif']
    },
    prixPromo: {
        type: Number,
        validate: {
            validator: function (val) {
                return !val || val < this.prix;
            },
            message: 'Le prix promotionnel doit être inférieur au prix normal'
        }
    },
    categorie: {
        type: String,
        required: [true, 'La catégorie est requise'],
        enum: {
            values: ['electronique', 'vetements', 'alimentation', 'maison', 'sport', 'livres', 'jouets', 'beaute', 'autre', 'chaussures', 'bijoux'],
            message: 'Catégorie non valide'
        }
    },
    sousCategorie: {
        type: String
    },
    marque: {
        type: String
    },
    stock: {
        type: Number,
        required: [true, 'Le stock est requis'],
        min: [0, 'Le stock ne peut pas être négatif'],
        default: 0
    },
    images: [{
        type: String
    }],
    imagePrincipale: {
        type: String,
        default: 'default-product.jpg'
    },
    note: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    nombreAvis: {
        type: Number,
        default: 0
    },
    caracteristiques: [{
        nom: String,
        valeur: String
    }],
    enPromotion: {
        type: Boolean,
        default: false
    },
    nouveaute: {
        type: Boolean,
        default: false
    },
    actif: {
        type: Boolean,
        default: true
    },
    vendeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ventes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour recherche et tri
productSchema.index({ nom: 'text', description: 'text' });
productSchema.index({ prix: 1, note: -1 });
productSchema.index({ categorie: 1 });

// Propriété virtuelle pour le prix final
productSchema.virtual('prixFinal').get(function () {
    return this.enPromotion && this.prixPromo ? this.prixPromo : this.prix;
});

// Propriété virtuelle pour le pourcentage de réduction
productSchema.virtual('pourcentageReduction').get(function () {
    if (this.enPromotion && this.prixPromo) {
        return Math.round(((this.prix - this.prixPromo) / this.prix) * 100);
    }
    return 0;
});

module.exports = mongoose.model('Product', productSchema);