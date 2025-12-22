const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 MongoDB Connected');

        // 1. Clean up Clients and Orders (Keep Admin and Products)
        await User.deleteMany({ role: 'client' });
        await Order.deleteMany({});
        console.log('🧹 Cleaned old clients and orders');

        // 2. Create Clients with Correct Schema
        const clients = [];
        const password = await bcrypt.hash('123456', 10);

        for (let i = 1; i <= 5; i++) {
            clients.push({
                nom: `Client${i}`,
                prenom: `Test`,
                email: `client${i}@test.com`,
                motDePasse: password,
                role: 'client',
                telephone: `060000000${i}`,
                adresse: {
                    rue: '123 Rue Exemplaire',
                    ville: 'Casablanca',
                    codePostal: '20000',
                    pays: 'Maroc'
                }
            });
        }
        const createdClients = await User.insertMany(clients);
        console.log(`👥 Created ${createdClients.length} Clients`);

        // 3. Get Products for Orders
        const products = await Product.find();
        if (products.length === 0) {
            console.log('⚠️ No products found! Run seed-products.js first.');
            process.exit(1);
        }

        // 4. Create Orders (Realistic Data for Charts)
        const orders = [];
        const statuses = ['en_attente', 'confirmee', 'expediee', 'livree'];

        // Generate orders
        for (let i = 0; i < 20; i++) {
            const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const price = randomProduct.prix;
            const total = price * quantity;

            // Random date within last 7 days for better Dashboard Chart visualization
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 7));

            orders.push({
                numeroCommande: `CMD-${2024000 + i}`,
                utilisateur: randomClient._id,
                articles: [{
                    produit: randomProduct._id,
                    nom: randomProduct.nom,
                    quantite: quantity,
                    prix: price,
                    image: randomProduct.imagePrincipale
                }],
                adresseLivraison: {
                    nom: randomClient.nom + ' ' + randomClient.prenom,
                    rue: randomClient.adresse.rue,
                    ville: randomClient.adresse.ville,
                    codePostal: randomClient.adresse.codePostal,
                    pays: randomClient.adresse.pays,
                    telephone: randomClient.telephone
                },
                montantArticles: total,
                fraisLivraison: 0,
                montantTotal: total,
                statutCommande: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: date, // For chart
                updatedAt: date
            });
        }

        await Order.insertMany(orders);
        console.log(`📦 Created ${orders.length} Orders`);

        console.log('✅ SEEDING COMPLETE! Dashboard should now show realistic data.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error details:', error);
        process.exit(1);
    }
};

seedData();
