#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const {
    createBackup,
    restoreBackup,
    listBackups,
    cleanOldBackups,
    autoBackup
} = require('./utils/backup');

const connectDB = require('./config/database');

/**
 * Afficher l'aide
 */
const showHelp = () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║          SYSTÈME DE BACKUP MONGODB DATABASE                ║
╚════════════════════════════════════════════════════════════╝

UTILISATION:
   node backup-cli.js <commande> [options]

COMMANDES DISPONIBLES:

   create              Créer un nouveau backup
   restore <fichier>   Restaurer depuis un fichier de backup
   list                Lister tous les backups disponibles
   clean [nombre]      Supprimer les anciens backups (garder les N plus récents)
   auto [nombre]       Créer un backup et nettoyer automatiquement
   help                Afficher cette aide

EXEMPLES:

   # Créer un backup
   node backup-cli.js create

   # Restaurer un backup
   node backup-cli.js restore ./backups/backup-2025-12-03.json

   # Lister les backups
   node backup-cli.js list

   # Garder seulement les 3 backups les plus récents
   node backup-cli.js clean 3

   # Backup automatique (créer + nettoyer, garder 5)
   node backup-cli.js auto 5

╚════════════════════════════════════════════════════════════╝
    `);
};

/**
 * Exécuter la commande
 */
const executeCommand = () => {
    const command = process.argv[2];
    const arg1 = process.argv[3];

    if (!command || command === 'help') {
        showHelp();
        process.exit(0);
    }

    console.log(' Connexion à MongoDB...\n');

    // Connexion à la base de données
    return connectDB()
        .then(() => {
            console.log(' Connecté à MongoDB\n');

            // Exécuter la commande appropriée
            switch (command) {
                case 'create':
                    return createBackup();

                case 'restore':
                    if (!arg1) {
                        console.error(' Erreur: Veuillez spécifier le fichier de backup');
                        console.log('Usage: node backup-cli.js restore <fichier>');
                        process.exit(1);
                    }
                    return restoreBackup(arg1, true);

                case 'list':
                    return listBackups();

                case 'clean':
                    const keepCount = arg1 ? parseInt(arg1) : 5;
                    return cleanOldBackups(keepCount);

                case 'auto':
                    const autoKeepCount = arg1 ? parseInt(arg1) : 5;
                    return autoBackup('./backups', autoKeepCount);

                default:
                    console.error(` Commande inconnue: ${command}`);
                    showHelp();
                    process.exit(1);
            }
        })
        .then((result) => {
            console.log('\n Opération terminée avec succès!');
            return mongoose.connection.close();
        })
        .then(() => {
            console.log(' Connexion MongoDB fermée');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\ Erreur:', error.message);

            return mongoose.connection.close()
                .then(() => {
                    console.log(' Connexion MongoDB fermée');
                    process.exit(1);
                })
                .catch(() => {
                    process.exit(1);
                });
        });
};

// Exécuter le script
executeCommand();
