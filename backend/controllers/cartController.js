const Cart = require('../models/Cart');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Obtenir le panier de l'utilisateur
// @route   GET /api/cart
// @access  Private
exports.getCart = catchAsync((req, res, next) => {
    return Cart.findOne({ utilisateur: req.user._id })
        .populate('articles.produit')
        .then(cart => {
            if (!cart) {
                return Cart.create({ utilisateur: req.user._id, articles: [] });
            }
            return cart;
        })
        .then(cart => {
            res.status(200).json({
                status: 'success',
                data: {
                    cart
                }
            });
        });
});

// @desc    Ajouter un article au panier
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = catchAsync((req, res, next) => {
    const { produitId, quantite } = req.body;

    if (!produitId || !quantite) {
        return next(new AppError('Veuillez fournir l\'ID du produit et la quantité', 400));
    }

    if (quantite < 1) {
        return next(new AppError('La quantité doit être supérieure à 0', 400));
    }

    let productData;

    // Vérifier que le produit existe
    return Product.findById(produitId)
        .then(product => {
            if (!product) {
                return next(new AppError('Produit non trouvé', 404));
            }

            if (!product.actif) {
                return next(new AppError('Ce produit n\'est plus disponible', 410));
            }

            if (product.stock < quantite) {
                return next(new AppError(`Stock insuffisant. Disponible: ${product.stock}`, 400));
            }

            productData = product;

            // Trouver ou créer le panier
            return Cart.findOne({ utilisateur: req.user._id });
        })
        .then(cart => {
            if (!cart) {
                return Cart.create({
                    utilisateur: req.user._id,
                    articles: [{ produit: produitId, quantite }]
                });
            } else {
                // Vérifier si le produit est déjà dans le panier
                const articleIndex = cart.articles.findIndex(
                    item => item.produit.toString() === produitId
                );

                if (articleIndex > -1) {
                    // Mettre à jour la quantité
                    const nouvelleQuantite = cart.articles[articleIndex].quantite + quantite;

                    if (productData.stock < nouvelleQuantite) {
                        return next(new AppError(`Stock insuffisant. Disponible: ${productData.stock}`, 400));
                    }

                    cart.articles[articleIndex].quantite = nouvelleQuantite;
                } else {
                    // Ajouter le nouveau produit
                    cart.articles.push({ produit: produitId, quantite });
                }

                return cart.save();
            }
        })
        .then(cart => {
            // Repopuler le panier
            return cart.populate('articles.produit');
        })
        .then(cart => {
            res.status(200).json({
                status: 'success',
                message: 'Produit ajouté au panier',
                data: {
                    cart
                }
            });
        });
});

// @desc    Mettre à jour la quantité d'un article
// @route   PATCH /api/cart/update/:produitId
// @access  Private
exports.updateCartItem = catchAsync((req, res, next) => {
    const { quantite } = req.body;

    if (!quantite || quantite < 0) {
        return next(new AppError('Quantité invalide', 400));
    }

    let cartData;

    return Cart.findOne({ utilisateur: req.user._id })
        .then(cart => {
            if (!cart) {
                return next(new AppError('Panier non trouvé', 404));
            }

            const articleIndex = cart.articles.findIndex(
                item => item.produit.toString() === req.params.produitId
            );

            if (articleIndex === -1) {
                return next(new AppError('Produit non trouvé dans le panier', 404));
            }

            if (quantite === 0) {
                // Supprimer l'article si quantité = 0
                cart.articles.splice(articleIndex, 1);
                cartData = cart;
                return cart.save();
            } else {
                cartData = cart;
                // Vérifier le stock
                return Product.findById(req.params.produitId)
                    .then(product => {
                        if (product.stock < quantite) {
                            return next(new AppError(`Stock insuffisant. Disponible: ${product.stock}`, 400));
                        }

                        cart.articles[articleIndex].quantite = quantite;
                        return cart.save();
                    });
            }
        })
        .then(cart => {
            return cart.populate('articles.produit');
        })
        .then(cart => {
            res.status(200).json({
                status: 'success',
                message: 'Panier mis à jour',
                data: {
                    cart
                }
            });
        });
});

// @desc    Supprimer un article du panier
// @route   DELETE /api/cart/remove/:produitId
// @access  Private
exports.removeFromCart = catchAsync((req, res, next) => {
    return Cart.findOne({ utilisateur: req.user._id })
        .then(cart => {
            if (!cart) {
                return next(new AppError('Panier non trouvé', 404));
            }

            cart.articles = cart.articles.filter(
                item => item.produit.toString() !== req.params.produitId
            );

            return cart.save();
        })
        .then(cart => {
            return cart.populate('articles.produit');
        })
        .then(cart => {
            res.status(200).json({
                status: 'success',
                message: 'Produit retiré du panier',
                data: {
                    cart
                }
            });
        });
});

// @desc    Vider le panier
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = catchAsync((req, res, next) => {
    return Cart.findOne({ utilisateur: req.user._id })
        .then(cart => {
            if (!cart) {
                return next(new AppError('Panier non trouvé', 404));
            }

            cart.articles = [];
            return cart.save();
        })
        .then(cart => {
            res.status(200).json({
                status: 'success',
                message: 'Panier vidé',
                data: {
                    cart
                }
            });
        });
});