const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.route('/')
    .get(getWishlist)
    .delete(clearWishlist);

router.route('/:productId')
    .post(addToWishlist)
    .delete(removeFromWishlist);

module.exports = router;
