const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updates = [
    { name: 'Caftan Brodé Fassi', image: 'assets/images/produits/Caftan Brodé Fassi.jpg', category: 'Vêtements' },
    { name: 'Jellaba Laine Premium', image: 'assets/images/produits/Jellaba Laine Premium.jpg', category: 'Vêtements' },
    { name: 'Caftan Velours Royal', image: 'assets/images/produits/Caftan Velours Royal.jpg', category: 'Vêtements' },

    { name: 'Balgha Cuir Naturel', image: 'assets/images/produits/Balgha Cuir Naturel.jpg', category: 'Chaussures' },
    { name: 'Cherbil Rouge Mariage', image: 'assets/images/produits/Cherbil Rouge Mariage.jpg', category: 'Chaussures' },
    { name: 'Babouche Cuir Souple', image: 'assets/images/produits/Babouche Cuir Souple.jpg', category: 'Chaussures' },

    { name: 'Bracelet Amazigh', image: 'assets/images/produits/Bracelet Amazigh.jpg', category: 'Bijoux' },
    { name: 'Collier Berbère Argent', image: 'assets/images/produits/Collier Berbère Argent.jpg', category: 'Bijoux' },
    { name: "Boucles d'Oreilles Filigrane", image: "assets/images/produits/Boucles d'Oreilles Filigrane.jpg", category: 'Bijoux' }
];

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom-db');
        console.log('Connecté à MongoDB...');

        for (const item of updates) {
            // Update or Create the product if it doesn't exist (Upsert)
            // But preferably update existing ones to keep IDs if possible, 
            // or just update by name.

            const result = await Product.findOneAndUpdate(
                { nom: item.name },
                {
                    $set: {
                        imageUrl: item.image,
                        categorie: item.category // Ensure category matches just in case
                    }
                },
                { new: true }
            );

            if (result) {
                console.log(`✅ Image mise à jour pour : ${item.name}`);
            } else {
                console.log(`⚠️ Produit non trouvé (ignoré) : ${item.name}`);
            }
        }

        console.log('Mise à jour terminée !');
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

updateImages();
