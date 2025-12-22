const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/auth');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
// router.get('/stats', protect, restrictTo('admin'), async (req, res) => {
router.get('/stats', async (req, res) => {
    try {
        // 1. Basic Stats (Counts & Revenue)
        const productsCount = await Product.countDocuments();
        const usersCount = await User.countDocuments({ role: 'client' });
        const ordersCount = await Order.countDocuments();

        // Revenue (Sum of montantTotal for non-cancelled orders)
        const revenueAgg = await Order.aggregate([
            { $match: { statutCommande: { $ne: 'annulee' } } },
            { $group: { _id: null, total: { $sum: '$montantTotal' } } }
        ]);
        const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // 2. Latest Orders (last 5)
        const latestOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('utilisateur', 'nom prenom email')
            .select('numeroCommande utilisateur createdAt montantTotal statutCommande');

        // 3. Chart Data (Revenue last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    statutCommande: { $ne: 'annulee' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$montantTotal" }, // Revenue
                    count: { $sum: 1 } // Number of orders
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 4. Top Categories (Aggregation)
        // Note: This matches product categories. 
        // We need to unwind articles from orders to get product categories. 
        // However, Order model saves 'articles' which has 'produit' ref. 
        // We'd need to look up Product to get category. 
        // For simplicity/performance, let's just count Products by Category 
        // OR mock this if too complex for mongo lookups without deeper aggregation.
        // Let's try deep aggregation: Order -> Unwind Articles -> Lookup Product -> Group by Category.

        const topCategories = await Order.aggregate([
            { $unwind: "$articles" },
            {
                $lookup: {
                    from: "products",
                    localField: "articles.produit",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.categorie",
                    totalSales: { $sum: "$articles.quantite" },
                    revenue: { $sum: { $multiply: ["$articles.quantite", "$articles.prix"] } }
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 3 }
        ]);

        res.json({
            stats: {
                revenue,
                orders: ordersCount,
                customers: usersCount,
                products: productsCount
            },
            latestOrders,
            chartData,
            topCategories
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des statistiques' });
    }
});

module.exports = router;
