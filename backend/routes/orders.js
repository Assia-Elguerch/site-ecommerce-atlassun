const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

// @desc    Créer une nouvelle commande
// @route   POST /api/commandes
// @access  Public / Private
router.post('/', catchAsync(async (req, res, next) => {
    console.log('📦 [ORDER] Nouvelle tentative de commande reçue');

    // 1. Extraire les données
    const {
        email,
        adresseLivraison,
        articles,
        montantArticles,
        fraisLivraison,
        montantTotal,
        methodePaiement,
        utilisateur
    } = req.body;

    console.log(`📝 [ORDER] Email: ${email}, Utilisateur: ${utilisateur}, Articles count: ${articles?.length}`);

    // Validation de base
    if (!articles || !articles.length) {
        console.warn('⚠️ [ORDER] Panier vide');
        return next(new AppError('Votre panier est vide', 400));
    }
    if (!adresseLivraison || !email) {
        console.warn('⚠️ [ORDER] Manque adresse ou email');
        return next(new AppError('Informations de livraison incomplètes', 400));
    }

    // Validation des articles
    for (const item of articles) {
        if (!item.produit) {
            console.error('❌ [ORDER] ID produit manquant dans un article:', item);
            return next(new AppError('Un ou plusieurs produits sont manquants', 400));
        }
    }

    // 2. Identifier ou Créer l'utilisateur (Guest Workflow)
    let orderUser;

    try {
        if (utilisateur && mongoose.Types.ObjectId.isValid(utilisateur)) {
            orderUser = await User.findById(utilisateur);
            console.log(`👤 [ORDER] Utilisateur trouvé par ID: ${utilisateur}`);
        } else if (req.user) {
            orderUser = req.user;
            console.log(`👤 [ORDER] Utilisateur d'après session: ${orderUser._id}`);
        } else {
            orderUser = await User.findOne({ email });

            if (!orderUser) {
                console.log(`👤 [ORDER] Création d'un compte invité pour: ${email}`);
                const plainPassword = Math.random().toString(36).slice(-10);
                const fullName = adresseLivraison.nom || 'Client Invité';
                const nameParts = fullName.split(' ');
                const nom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];
                const prenom = nameParts.length > 1 ? nameParts[0] : 'Client';

                orderUser = await User.create({
                    nom: nom || 'Atlas',
                    prenom: prenom || 'Client',
                    email: email,
                    motDePasse: plainPassword,
                    role: 'client',
                    telephone: adresseLivraison.telephone || '0000000000',
                    adresse: {
                        rue: adresseLivraison.rue,
                        ville: adresseLivraison.ville,
                        codePostal: adresseLivraison.codePostal,
                        pays: adresseLivraison.pays || 'Maroc'
                    }
                });
                console.log(`👤 [ORDER] Nouveau compte invité créé: ${orderUser._id}`);
            } else {
                console.log(`👤 [ORDER] Utilisateur trouvé par email: ${email}`);
            }
        }
    } catch (userErr) {
        console.error('❌ [ORDER] Erreur lors de la gestion utilisateur:', userErr);
        return next(new AppError(`Erreur utilisateur: ${userErr.message}`, 400));
    }

    if (!orderUser) {
        return next(new AppError('Impossible d\'identifier l\'utilisateur pour cette commande', 400));
    }

    // 3. Préparer la commande
    const count = await Order.countDocuments();
    const now = new Date();
    const numeroCommande = `CMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(5, '0')}`;

    console.log(`📝 [ORDER] Création de la commande ${numeroCommande} pour l'utilisateur ${orderUser._id}`);

    try {
        const newOrder = await Order.create({
            numeroCommande,
            utilisateur: orderUser._id,
            articles,
            adresseLivraison,
            montantArticles,
            fraisLivraison: fraisLivraison || 0,
            montantTotal,
            methodePaiement: methodePaiement || 'especes',
            statutCommande: 'en_attente'
        });

        console.log(`✅ [ORDER] Commande créée avec succès: ${newOrder.numeroCommande}`);

        res.status(201).json({
            status: 'success',
            data: newOrder
        });
    } catch (orderErr) {
        console.error('❌ [ORDER] ÉCHEC lors de Order.create:', orderErr);
        return next(orderErr);
    }
}));

// @desc    Obtenir toutes les commandes (Admin)
// @route   GET /api/commandes
// @access  Private/Admin
router.get('/', protect, catchAsync(async (req, res, next) => {
    // Seuls les admins voient tout
    if (req.user.role !== 'admin') {
        const clientOrders = await Order.find({ utilisateur: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, content: clientOrders });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.size) || 12;
    const skip = page * limit;

    const orders = await Order.find()
        .populate('utilisateur', 'nom prenom email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments();

    res.status(200).json({
        success: true,
        content: orders,
        totalElements: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit
    });
}));

// @desc    Obtenir une commande par son numéro
// @route   GET /api/commandes/numero/:numero
router.get('/numero/:numero', catchAsync(async (req, res, next) => {
    const order = await Order.findOne({ numeroCommande: req.params.numero })
        .populate('utilisateur', 'nom prenom email telephone');

    if (!order) {
        return next(new AppError('Commande non trouvée', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
}));

module.exports = router;
