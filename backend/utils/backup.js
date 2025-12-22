const fs = require('fs'); // Bibliothèque standard File System
const fsp = fs.promises; // Utilisation de l'API Promises de fs
const { access, constants } = fs.promises; // Pour les vérifications d'accès
const path = require('path');
const mongoose = require('mongoose');

// Modèles
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');

/**
 * Créer un backup de la base de données MongoDB
 * @param {string} backupDir - Répertoire où sauvegarder le backup
 * @returns {Promise<string>} - Chemin du fichier de backup créé
 */
const createBackup = (backupDir = './backups') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFileName);

    console.log(' [FS] Vérification du répertoire de stockage...');

    // 1. fsp.mkdir : Création récursive du répertoire (si inexistant)
    // 2. fsp.writeFile : Écriture atomique du fichier JSON
    // 3. fsp.stat : Récupération des métadonnées du fichier créé
    return fsp.mkdir(backupDir, { recursive: true })
        .then(() => {
            console.log(' Répertoire de backup créé/vérifié');

            // Récupérer toutes les données des collections
            return Promise.all([
                User.find({}).lean(),
                Product.find({}).lean(),
                Cart.find({}).lean(),
                Order.find({}).lean(),
                Wishlist.find({}).lean()
            ]);
        })
        .then(([users, products, carts, orders, wishlists]) => {
            console.log(` Données récupérées:`);
            console.log(`   - Utilisateurs: ${users.length}`);
            console.log(`   - Produits: ${products.length}`);
            console.log(`   - Paniers: ${carts.length}`);
            console.log(`   - Commandes: ${orders.length}`);
            console.log(`   - Wishlists: ${wishlists.length}`);

            // Créer l'objet de backup
            const backupData = {
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '1.0',
                    database: mongoose.connection.name,
                    collections: {
                        users: users.length,
                        products: products.length,
                        carts: carts.length,
                        orders: orders.length,
                        wishlists: wishlists.length
                    }
                },
                data: {
                    users,
                    products,
                    carts,
                    orders,
                    wishlists
                }
            };

            // Écrire le backup dans un fichier JSON
            const jsonData = JSON.stringify(backupData, null, 2);
            return fsp.writeFile(backupPath, jsonData, 'utf8');
        })
        .then(() => {
            // Vérifier la taille du fichier
            return fsp.stat(backupPath);
        })
        .then((stats) => {
            const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(` Backup créé avec succès!`);
            console.log(` Fichier: ${backupPath}`);
            console.log(` Taille: ${sizeInMB} MB`);

            return backupPath;
        })
        .catch((error) => {
            console.error(' Erreur lors du backup:', error.message);
            throw error;
        });
};

/**
 * Restaurer la base de données depuis un fichier de backup
 * @param {string} backupFilePath - Chemin du fichier de backup
 * @param {boolean} clearBeforeRestore - Vider les collections avant la restauration
 * @returns {Promise<object>} - Statistiques de restauration
 */
const restoreBackup = (backupFilePath, clearBeforeRestore = false) => {
    console.log(' Démarrage de la restauration...');

    // Lire le fichier de backup
    return fsp.readFile(backupFilePath, 'utf8')
        .then((data) => {
            console.log(' Fichier de backup lu');
            return JSON.parse(data);
        })
        .then((backupData) => {
            console.log(' Métadonnées du backup:');
            console.log(`   - Date: ${backupData.metadata.timestamp}`);
            console.log(`   - Base de données: ${backupData.metadata.database}`);
            console.log(`   - Collections: ${JSON.stringify(backupData.metadata.collections)}`);

            // Vider les collections si demandé
            if (clearBeforeRestore) {
                console.log('  Suppression des données existantes...');
                return Promise.all([
                    User.deleteMany({}),
                    Product.deleteMany({}),
                    Cart.deleteMany({}),
                    Order.deleteMany({}),
                    Wishlist.deleteMany({})
                ])
                    .then(() => {
                        console.log(' Collections vidées');
                        return backupData;
                    });
            }
            return backupData;
        })
        .then((backupData) => {
            console.log(' Restauration des données...');

            // Restaurer les données
            const stats = { users: 0, products: 0, carts: 0, orders: 0, wishlists: 0 };
            const promises = [];

            if (backupData.data.users && backupData.data.users.length > 0) {
                promises.push(User.insertMany(backupData.data.users).then(res => stats.users = res.length));
            }

            if (backupData.data.products && backupData.data.products.length > 0) {
                promises.push(Product.insertMany(backupData.data.products).then(res => stats.products = res.length));
            }

            if (backupData.data.carts && backupData.data.carts.length > 0) {
                promises.push(Cart.insertMany(backupData.data.carts).then(res => stats.carts = res.length));
            }

            if (backupData.data.orders && backupData.data.orders.length > 0) {
                promises.push(Order.insertMany(backupData.data.orders).then(res => stats.orders = res.length));
            }

            if (backupData.data.wishlists && backupData.data.wishlists.length > 0) {
                promises.push(Wishlist.insertMany(backupData.data.wishlists).then(res => stats.wishlists = res.length));
            }

            return Promise.all(promises).then(() => stats);
        })
        .then((stats) => {
            console.log(' Restauration terminée avec succès!');
            console.log(` Données restaurées:`);
            console.log(`   - Utilisateurs: ${stats.users}`);
            console.log(`   - Produits: ${stats.products}`);
            console.log(`   - Paniers: ${stats.carts}`);
            console.log(`   - Commandes: ${stats.orders}`);
            console.log(`   - Wishlists: ${stats.wishlists}`);

            return stats;
        })
        .catch((error) => {
            console.error(' Erreur lors de la restauration:', error.message);
            throw error;
        });
};

/**
 * Lister tous les backups disponibles
 * @param {string} backupDir - Répertoire des backups
 * @returns {Promise<Array>} - Liste des backups avec leurs métadonnées
 */
const listBackups = (backupDir = './backups') => {
    return fsp.readdir(backupDir)
        .then((files) => {
            // Filtrer uniquement les fichiers JSON
            const backupFiles = files.filter(file => file.endsWith('.json'));

            // Récupérer les informations de chaque backup
            const promises = backupFiles.map(file => {
                const filePath = path.join(backupDir, file);

                return fsp.stat(filePath)
                    .then((stats) => {
                        return fsp.readFile(filePath, 'utf8')
                            .then((data) => {
                                const backupData = JSON.parse(data);
                                return {
                                    filename: file,
                                    path: filePath,
                                    size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
                                    created: stats.birthtime,
                                    metadata: backupData.metadata
                                };
                            });
                    })
                    .catch(() => {
                        // Si erreur de lecture, retourner info basique
                        return fsp.stat(filePath)
                            .then((stats) => ({
                                filename: file,
                                path: filePath,
                                size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
                                created: stats.birthtime,
                                metadata: null
                            }));
                    });
            });

            return Promise.all(promises);
        })
        .then((backups) => {
            // fsp.readdir : Lecture du contenu du répertoire
            // fsp.readFile : Lecture asynchrone pour extraire les métadonnées
            console.log(` [FS] ${backups.length} backup(s) trouvé(s) via readdir:`);
            backups.forEach((backup, index) => {
                console.log(`\n${index + 1}. ${backup.filename}`);
                console.log(`   Taille: ${backup.size}`);
                console.log(`   Date: ${backup.created.toLocaleString()}`);
                if (backup.metadata) {
                    console.log(`   Collections: ${JSON.stringify(backup.metadata.collections)}`);
                }
            });

            return backups;
        })
        .catch((error) => {
            if (error.code === 'ENOENT') {
                console.log(' Aucun backup trouvé (répertoire inexistant)');
                return [];
            }
            console.error(' Erreur lors de la liste des backups:', error.message);
            throw error;
        });
};

/**
 * Supprimer les anciens backups (garder seulement les N plus récents)
 * @param {number} keepCount - Nombre de backups à conserver
 * @param {string} backupDir - Répertoire des backups
 * @returns {Promise<number>} - Nombre de backups supprimés
 */
const cleanOldBackups = (keepCount = 5, backupDir = './backups') => {
    return listBackups(backupDir)
        .then((backups) => {
            if (backups.length <= keepCount) {
                console.log(` Aucun backup à supprimer (${backups.length} backups, limite: ${keepCount})`);
                return 0;
            }

            // Trier par date (plus récent en premier)
            backups.sort((a, b) => b.created - a.created);

            // Garder seulement les N plus récents
            const backupsToDelete = backups.slice(keepCount);

            console.log(`  Suppression de ${backupsToDelete.length} ancien(s) backup(s)...`);

            // Supprimer les anciens backups
            const deletePromises = backupsToDelete.map(backup => {
                return fsp.unlink(backup.path)
                    .then(() => {
                        console.log(`  Supprimé: ${backup.filename}`);
                    });
            });

            return Promise.all(deletePromises)
                .then(() => backupsToDelete.length);
        })
        .then((deletedCount) => {
            console.log(` ${deletedCount} backup(s) supprimé(s)`);
            return deletedCount;
        })
        .catch((error) => {
            console.error(' Erreur lors du nettoyage:', error.message);
            throw error;
        });
};

/**
 * Créer un backup automatique avec nettoyage des anciens
 * @param {string} backupDir - Répertoire des backups
 * @param {number} keepCount - Nombre de backups à conserver
 * @returns {Promise<string>} - Chemin du backup créé
 */
const autoBackup = (backupDir = './backups', keepCount = 5) => {
    return createBackup(backupDir)
        .then((backupPath) => {
            console.log('\n Nettoyage des anciens backups...');
            return cleanOldBackups(keepCount, backupDir)
                .then(() => backupPath);
        });
};

module.exports = {
    createBackup,
    restoreBackup,
    listBackups,
    cleanOldBackups,
    autoBackup
};
