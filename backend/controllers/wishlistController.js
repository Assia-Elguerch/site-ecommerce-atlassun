const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
        }

        res.status(200).json({
            success: true,
            count: wishlist.products.length,
            data: wishlist.products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError('Produit non trouvé', 404));
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
        } else {
            // Check if product already in wishlist
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        // Populate for response
        await wishlist.populate('products');

        res.status(200).json({
            success: true,
            count: wishlist.products.length,
            data: wishlist.products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
            await wishlist.populate('products');
        }

        res.status(200).json({
            success: true,
            count: wishlist ? wishlist.products.length : 0,
            data: wishlist ? wishlist.products : []
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }

        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    } catch (err) {
        next(err);
    }
};
