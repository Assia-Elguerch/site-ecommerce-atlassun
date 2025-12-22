const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Obtenir tous les produits avec filtres et pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = catchAsync((req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Construction du filtre
    const filter = { actif: true };

    // Filtre par catégorie
    if (req.query.categorie) {
        filter.categorie = req.query.categorie;
    }

    // Filtre par sous-catégorie
    if (req.query.sousCategorie) {
        filter.sousCategorie = req.query.sousCategorie;
    }

    // Filtre par marque
    if (req.query.marque) {
        filter.marque = req.query.marque;
    }

    // Filtre par prix
    if (req.query.prixMin || req.query.prixMax) {
        filter.prix = {};
        if (req.query.prixMin) filter.prix.$gte = parseFloat(req.query.prixMin);
        if (req.query.prixMax) filter.prix.$lte = parseFloat(req.query.prixMax);
    }

    // Filtre promotion
    if (req.query.enPromotion === 'true') {
        filter.enPromotion = true;
    }

    // Filtre nouveautés
    if (req.query.nouveaute === 'true') {
        filter.nouveaute = true;
    }

    // Filtre par disponibilité en stock
    if (req.query.enStock === 'true') {
        filter.stock = { $gt: 0 };
    }

    // Recherche textuelle
    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }

    // Construction du tri
    let sort = {};
    if (req.query.sort) {
        const sortFields = req.query.sort.split(',');
        sortFields.forEach(field => {
            if (field.startsWith('-')) {
                sort[field.substring(1)] = -1;
            } else {
                sort[field] = 1;
            }
        });
    } else {
        sort = { createdAt: -1 }; // Par défaut, les plus récents en premier
    }

    // Exécution de la requête avec Promise
    const productsPromise = Product.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('vendeur', 'nom prenom');

    const countPromise = Product.countDocuments(filter);

    // Attendre les deux promesses
    return Promise.all([productsPromise, countPromise])
        .then(([products, total]) => {
            // Calculer le nombre total de pages
            const totalPages = Math.ceil(total / limit);

            res.status(200).json({
                status: 'success',
                results: products.length,
                data: {
                    products,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages,
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1
                    }
                }
            });
        });
});

// @desc    Obtenir un produit par ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = catchAsync((req, res, next) => {
    return Product.findById(req.params.id)
        .populate('vendeur', 'nom prenom email')
        .then(product => {
            if (!product) {
                return next(new AppError('Produit non trouvé', 404));
            }

            if (!product.actif) {
                return next(new AppError('Ce produit n\'est plus disponible', 410));
            }

            res.status(200).json({
                status: 'success',
                data: {
                    product
                }
            });
        });
});

// @desc    Créer un nouveau produit
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = catchAsync((req, res, next) => {
    const {
        nom,
        description,
        prix,
        prixPromo,
        categorie,
        sousCategorie,
        marque,
        stock,
        images,
        imagePrincipale,
        caracteristiques,
        enPromotion,
        nouveaute
    } = req.body;

    // Validation des champs requis
    if (!nom || !description || !prix || !categorie || stock === undefined) {
        return next(new AppError('Veuillez fournir tous les champs requis', 400));
    }

    // Vérifier si le prix promo est valide
    if (enPromotion && prixPromo && prixPromo >= prix) {
        return next(new AppError('Le prix promotionnel doit être inférieur au prix normal', 400));
    }

    // Créer le produit
    return Product.create({
        nom,
        description,
        prix,
        prixPromo,
        categorie,
        sousCategorie,
        marque,
        stock,
        images: images || [],
        imagePrincipale: imagePrincipale || 'default-product.jpg',
        caracteristiques: caracteristiques || [],
        enPromotion: enPromotion || false,
        nouveaute: nouveaute || false,
        vendeur: req.user._id
    })
        .then(product => {
            res.status(201).json({
                status: 'success',
                message: 'Produit créé avec succès',
                data: {
                    product
                }
            });
        });
});

// @desc    Mettre à jour un produit
// @route   PATCH /api/products/:id
// @access  Private (Admin)
exports.updateProduct = catchAsync((req, res, next) => {
    return Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                return next(new AppError('Produit non trouvé', 404));
            }

            // Champs autorisés pour la mise à jour
            const allowedFields = [
                'nom', 'description', 'prix', 'prixPromo', 'categorie', 'sousCategorie',
                'marque', 'stock', 'images', 'imagePrincipale', 'caracteristiques',
                'enPromotion', 'nouveaute', 'actif'
            ];

            const updates = {};
            Object.keys(req.body).forEach(key => {
                if (allowedFields.includes(key)) {
                    updates[key] = req.body[key];
                }
            });

            if (Object.keys(updates).length === 0) {
                return next(new AppError('Aucune mise à jour fournie', 400));
            }

            // Validation du prix promo
            if (updates.prixPromo && updates.prixPromo >= (updates.prix || product.prix)) {
                return next(new AppError('Le prix promotionnel doit être inférieur au prix normal', 400));
            }

            return Product.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true, runValidators: true }
            );
        })
        .then(updatedProduct => {
            res.status(200).json({
                status: 'success',
                message: 'Produit mis à jour avec succès',
                data: {
                    product: updatedProduct
                }
            });
        });
});

// @desc    Supprimer un produit (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = catchAsync((req, res, next) => {
    return Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                return next(new AppError('Produit non trouvé', 404));
            }

            // Soft delete - marquer comme inactif
            return Product.findByIdAndUpdate(req.params.id, { actif: false });
        })
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Produit supprimé avec succès',
                data: null
            });
        });
});

// @desc    Obtenir les catégories disponibles
// @route   GET /api/products/categories/list
// @access  Public
exports.getCategories = catchAsync((req, res, next) => {
    return Product.distinct('categorie', { actif: true })
        .then(categories => {
            res.status(200).json({
                status: 'success',
                data: {
                    categories
                }
            });
        });
});

// @desc    Obtenir les marques disponibles
// @route   GET /api/products/brands/list
// @access  Public
exports.getBrands = catchAsync((req, res, next) => {
    return Product.distinct('marque', { actif: true, marque: { $ne: null } })
        .then(marques => {
            res.status(200).json({
                status: 'success',
                data: {
                    marques
                }
            });
        });
});

// @desc    Obtenir les produits en promotion
// @route   GET /api/products/promotions/list
// @access  Public
exports.getPromotions = catchAsync((req, res, next) => {
    const limit = parseInt(req.query.limit) || 8;

    return Product.find({
        actif: true,
        enPromotion: true,
        stock: { $gt: 0 }
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(products => {
            res.status(200).json({
                status: 'success',
                results: products.length,
                data: {
                    products
                }
            });
        });
});

// @desc    Obtenir les nouveautés
// @route   GET /api/products/nouveautes/list
// @access  Public
exports.getNouveautes = catchAsync((req, res, next) => {
    const limit = parseInt(req.query.limit) || 8;

    return Product.find({
        actif: true,
        nouveaute: true,
        stock: { $gt: 0 }
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(products => {
            res.status(200).json({
                status: 'success',
                results: products.length,
                data: {
                    products
                }
            });
        });
});

// @desc    Obtenir les produits les plus vendus
// @route   GET /api/products/bestsellers/list
// @access  Public
exports.getBestsellers = catchAsync((req, res, next) => {
    const limit = parseInt(req.query.limit) || 8;

    return Product.find({
        actif: true,
        stock: { $gt: 0 }
    })
        .sort({ ventes: -1, note: -1 })
        .limit(limit)
        .then(products => {
            res.status(200).json({
                status: 'success',
                results: products.length,
                data: {
                    products
                }
            });
        });
});