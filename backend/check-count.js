const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const checkCount = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const count = await Product.countDocuments();
        console.log('Total Products in DB:', count);

        if (count > 0) {
            const products = await Product.find().limit(5);
            console.log('Sample Products:', products.map(p => p.nom));
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCount();
