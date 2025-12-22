const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getBrands,
    getPromotions,
    getNouveautes,
    getBestsellers
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getAllProducts);
router.get('/categories/list', getCategories);
router.get('/brands/list', getBrands);
router.get('/promotions/list', getPromotions);
router.get('/nouveautes/list', getNouveautes);
router.get('/bestsellers/list', getBestsellers);
router.get('/:id', getProductById);

// Routes protégées (Admin seulement)
router.post('/', protect, restrictTo('admin'), createProduct);
router.patch('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;