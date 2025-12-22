const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    // VÊTEMENTS (Caftans & Jellabas)
    {
        nom: 'Caftan Brodé Fassi',
        description: 'Magnifique Caftan traditionnel avec broderie Fassi authentique. Tissu en crêpe de soie de haute qualité, idéal pour les grandes occasions.',
        prix: 2500,
        categorie: 'vetements',
        categorieProduit: 'Caftans',
        marque: 'AtlasSun Couture',
        stock: 10,
        imagePrincipale: '/assets/images/produits/caftan-brode-fassi.jpg',
        images: ['/assets/images/produits/caftan-brode-fassi.jpg'],
        enPromotion: false,
        actif: true
    },
    {
        nom: 'Jellaba Laine Premium',
        description: 'Jellaba d\'hiver en laine pure, tissée à la main. Confort thermique exceptionnel et coupe moderne respectant la tradition.',
        prix: 1200,
        categorie: 'vetements',
        categorieProduit: 'Jellabas',
        marque: 'AtlasSun Couture',
        stock: 15,
        imagePrincipale: '/assets/images/produits/jellaba-laine-premium.jpg',
        images: ['/assets/images/produits/jellaba-laine-premium.jpg'],
        enPromotion: true,
        prixPromo: 950,
        actif: true
    },
    {
        nom: 'Caftan Velours Royal',
        description: 'Caftan luxueux en velours, orné de "Sfifa" et "Aakad" en fil d\'or. Une pièce maîtresse pour votre garde-robe traditionnelle.',
        prix: 3800,
        categorie: 'vetements',
        categorieProduit: 'Caftans',
        marque: 'AtlasSun Couture',
        stock: 5,
        imagePrincipale: '/assets/images/produits/caftan-velours-royal.jpg',
        images: ['/assets/images/produits/caftan-velours-royal.jpg'],
        enPromotion: false,
        actif: true
    },

    // CHAUSSURES (Balgha & Cherbil)
    {
        nom: 'Balgha Cuir Naturel',
        description: 'Babouches pour hommes en cuir véritable tanné naturellement. Semelle rigide pour un usage quotidien alliant confort et durabilité.',
        prix: 350,
        categorie: 'chaussures',
        categorieProduit: 'Babouches Homme',
        marque: 'AtlasSun Artisanat',
        stock: 50,
        imagePrincipale: '/assets/images/produits/balgha-cuir-naturel.jpg',
        images: ['/assets/images/produits/balgha-cuir-naturel.jpg'],
        enPromotion: false,
        actif: true
    },
    {
        nom: 'Cherbil Rouge Mariage',
        description: 'Cherbil traditionnel pour femmes, brodé au fil d\'or. Le complément parfait pour vos tenues de cérémonie.',
        prix: 450,
        categorie: 'chaussures',
        categorieProduit: 'Babouches Femme',
        marque: 'AtlasSun Artisanat',
        stock: 30,
        imagePrincipale: '/assets/images/produits/cherbil-rouge-mariage.jpg',
        images: ['/assets/images/produits/cherbil-rouge-mariage.jpg'],
        enPromotion: false,
        actif: true
    },
    {
        nom: 'Babouche Cuir Souple',
        description: 'Babouches mixtes en cuir souple, idéales pour l\'intérieur. Disponibles en plusieurs coloris naturels.',
        prix: 200,
        categorie: 'chaussures',
        categorieProduit: 'Babouches',
        marque: 'AtlasSun Artisanat',
        stock: 100,
        imagePrincipale: '/assets/images/produits/babouche-cuir-souple.jpg',
        images: ['/assets/images/produits/babouche-cuir-souple.jpg'],
        enPromotion: true,
        prixPromo: 180,
        actif: true
    },

    // BIJOUX (Argenterie)
    {
        nom: 'Bracelet Amazigh',
        description: 'Bracelet rigide en argent massif avec motifs berbères gravés à la main. Un symbole d\'élégance intemporelle.',
        prix: 850,
        categorie: 'bijoux',
        categorieProduit: 'Bracelets',
        marque: 'AtlasSun Bijoux',
        stock: 20,
        imagePrincipale: '/assets/images/produits/bracelet-amazigh.jpg',
        images: ['/assets/images/produits/bracelet-amazigh.jpg'],
        enPromotion: false,
        actif: true
    },
    {
        nom: 'Collier Berbère Argent',
        description: 'Collier plastron traditionnel en argent et émail coloré. Une pièce unique issue du savoir-faire de Tiznit.',
        prix: 1500,
        categorie: 'bijoux',
        categorieProduit: 'Colliers',
        marque: 'AtlasSun Bijoux',
        stock: 12,
        imagePrincipale: '/assets/images/produits/collier-berbere-argent.jpg',
        images: ['/assets/images/produits/collier-berbere-argent.jpg'],
        enPromotion: false,
        actif: true
    },
    {
        nom: "Boucles d'Oreilles Filigrane",
        description: "Paire de boucles d'oreilles pendantes travaillées en filigrane d'argent. Légères et raffinées.",
        prix: 400,
        categorie: 'bijoux',
        categorieProduit: 'Boucles d\'oreilles',
        marque: 'AtlasSun Bijoux',
        stock: 25,
        imagePrincipale: "/assets/images/produits/boucles-oreilles-filigrane.jpg",
        images: ["/assets/images/produits/boucles-oreilles-filigrane.jpg"],
        enPromotion: true,
        prixPromo: 350,
        actif: true
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atlassun');
        console.log('Connecté à MongoDB...');

        for (const p of products) {
            await Product.findOneAndUpdate(
                { nom: p.nom },
                p,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`✅ Produit traité : ${p.nom}`);
        }

        console.log('--- SEED TERMINE ---');
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

seedProducts();
