const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const listProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom-db');
        console.log('Connecté...');

        const products = await Product.find({}, 'nom');
        console.log(`Trouvé ${products.length} produits :`);
        products.forEach(p => console.log(`- ${p.nom}`));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listProducts();
