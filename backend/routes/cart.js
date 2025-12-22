const express = require('express');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes du panier nécessitent une authentification
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/update/:produitId', updateCartItem);
router.delete('/remove/:produitId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;