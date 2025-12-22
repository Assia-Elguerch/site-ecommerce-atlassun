#!/usr/bin/env node

/**
 * Script de backup automatique quotidien
 * 
 * Ce script peut être exécuté par un cron job ou un planificateur de tâches
 * pour créer automatiquement des backups de votre base de données.
 * 
 * Utilisation:
 *   node auto-backup-scheduler.js
 * 
 * Configuration:
 *   - Modifiez les constantes ci-dessous selon vos besoins
 */

require('dotenv').config();
const { autoBackup } = require('./utils/backup');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

// ========== CONFIGURATION ==========
const BACKUP_DIR = './backups';
const KEEP_COUNT = 7; // Nombre de backups à conserver
const BACKUP_HOUR = 2; // Heure du backup (2h du matin)
// ===================================

/**
 * Exécuter le backup automatique
 */
const runAutoBackup = () => {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     BACKUP AUTOMATIQUE - E-COMMERCE DATABASE           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(` Date: ${new Date().toLocaleString('fr-FR')}`);
    console.log(` Répertoire: ${BACKUP_DIR}`);
    console.log(` Backups à conserver: ${KEEP_COUNT}\n`);

    return connectDB()
        .then(() => {
            console.log(' Connexion à MongoDB établie\n');
            return autoBackup(BACKUP_DIR, KEEP_COUNT);
        })
        .then((backupPath) => {
            console.log('\n╔════════════════════════════════════════════════════════╗');
            console.log('║              BACKUP TERMINÉ AVEC SUCCÈS                ║');
            console.log('╚════════════════════════════════════════════════════════╝');
            console.log(`\n Backup créé: ${backupPath}`);
            console.log(` Opération terminée à: ${new Date().toLocaleString('fr-FR')}\n`);

            return mongoose.connection.close();
        })
        .then(() => {
            console.log(' Connexion MongoDB fermée');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n╔════════════════════════════════════════════════════════╗');
            console.error('║                  ERREUR DE BACKUP                      ║');
            console.error('╚════════════════════════════════════════════════════════╝');
            console.error(`\n Erreur: ${error.message}`);
            console.error(` Heure de l'erreur: ${new Date().toLocaleString('fr-FR')}\n`);

            if (error.stack) {
                console.error('Stack trace:');
                console.error(error.stack);
            }

            return mongoose.connection.close()
                .then(() => {
                    console.log('\n Connexion MongoDB fermée');
                    process.exit(1);
                })
                .catch(() => {
                    process.exit(1);
                });
        });
};

/**
 * Planifier le backup quotidien
 */
const scheduleDailyBackup = () => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(BACKUP_HOUR, 0, 0, 0);

    // Si l'heure est déjà passée aujourd'hui, planifier pour demain
    if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilBackup = scheduledTime - now;
    const hoursUntil = Math.floor(timeUntilBackup / (1000 * 60 * 60));
    const minutesUntil = Math.floor((timeUntilBackup % (1000 * 60 * 60)) / (1000 * 60));

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        PLANIFICATEUR DE BACKUP AUTOMATIQUE             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(` Heure actuelle: ${now.toLocaleString('fr-FR')}`);
    console.log(` Prochain backup: ${scheduledTime.toLocaleString('fr-FR')}`);
    console.log(` Temps restant: ${hoursUntil}h ${minutesUntil}min\n`);
    console.log(' Le planificateur est actif. Appuyez sur Ctrl+C pour arrêter.\n');

    setTimeout(() => {
        runAutoBackup()
            .then(() => {
                // Planifier le prochain backup dans 24 heures
                console.log('\n Planification du prochain backup dans 24 heures...\n');
                setTimeout(scheduleDailyBackup, 24 * 60 * 60 * 1000);
            });
    }, timeUntilBackup);
};

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2);
const mode = args[0] || 'once';

if (mode === 'schedule') {
    // Mode planificateur continu
    console.log(' Démarrage du planificateur de backup...\n');
    scheduleDailyBackup();
} else if (mode === 'once') {
    // Mode exécution unique
    console.log(' Exécution du backup unique...\n');
    runAutoBackup();
} else {
    console.log(' Mode inconnu. Utilisez "once" ou "schedule"');
    console.log('\nUtilisation:');
    console.log('  node auto-backup-scheduler.js once      # Exécuter un backup immédiatement');
    console.log('  node auto-backup-scheduler.js schedule  # Planifier des backups quotidiens');
    process.exit(1);
}
