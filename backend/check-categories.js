const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const caftans = await Product.countDocuments({ sousCategorie: 'Caftans' });
        const jellabas = await Product.countDocuments({ sousCategorie: 'Jellabas' });
        const chaussures = await Product.countDocuments({ sousCategorie: 'Chaussures' });
        const bijoux = await Product.countDocuments({ sousCategorie: 'Bijoux' });

        console.log('--- RESULTATS EXACTS EN BASE DE DONNEES ---');
        console.log(`Caftans: ${caftans}`);
        console.log(`Jellabas: ${jellabas}`);
        console.log(`TOTAL "Caftans & Jellabas": ${caftans + jellabas}`);
        console.log(`Chaussures: ${chaussures}`);
        console.log(`Bijoux: ${bijoux}`);
        console.log('-------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
