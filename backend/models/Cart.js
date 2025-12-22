const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    articles: [{
        produit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantite: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }],
    montantTotal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculer le montant total avant sauvegarde
cartSchema.pre('save', function (next) {
    if (this.articles && this.articles.length > 0) {
        this.populate('articles.produit')
            .then(() => {
                this.montantTotal = this.articles.reduce((total, item) => {
                    const prix = item.produit.enPromotion && item.produit.prixPromo
                        ? item.produit.prixPromo
                        : item.produit.prix;
                    return total + (prix * item.quantite);
                }, 0);
                next();
            })
            .catch(err => next(err));
    } else {
        this.montantTotal = 0;
        next();
    }
});

module.exports = mongoose.model('Cart', cartSchema);