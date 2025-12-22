const express = require('express');
const router = express.Router();
const {
    createBackup,
    restoreBackup,
    listBackups,
    cleanOldBackups,
    autoBackup
} = require('../utils/backup');
const { protect, restrictTo } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Toutes les routes nécessitent une authentification admin
router.use(protect);
router.use(restrictTo('admin'));

// @desc    Créer un nouveau backup
// @route   POST /api/backup/create
// @access  Private (Admin)
router.post('/create', catchAsync((req, res, next) => {
    return createBackup()
        .then((backupPath) => {
            res.status(201).json({
                status: 'success',
                message: 'Backup créé avec succès',
                data: {
                    backupPath
                }
            });
        });
}));

// @desc    Créer un backup automatique avec nettoyage
// @route   POST /api/backup/auto
// @access  Private (Admin)
router.post('/auto', catchAsync((req, res, next) => {
    const keepCount = req.body.keepCount || 5;

    return autoBackup('./backups', keepCount)
        .then((backupPath) => {
            res.status(201).json({
                status: 'success',
                message: 'Backup automatique créé avec succès',
                data: {
                    backupPath,
                    keepCount
                }
            });
        });
}));

// @desc    Lister tous les backups
// @route   GET /api/backup/list
// @access  Private (Admin)
router.get('/list', catchAsync((req, res, next) => {
    return listBackups()
        .then((backups) => {
            res.status(200).json({
                status: 'success',
                results: backups.length,
                data: {
                    backups
                }
            });
        });
}));

// @desc    Restaurer un backup
// @route   POST /api/backup/restore
// @access  Private (Admin)
router.post('/restore', catchAsync((req, res, next) => {
    const { backupPath, clearBeforeRestore } = req.body;

    if (!backupPath) {
        return next(new AppError('Veuillez fournir le chemin du fichier de backup', 400));
    }

    return restoreBackup(backupPath, clearBeforeRestore || false)
        .then((stats) => {
            res.status(200).json({
                status: 'success',
                message: 'Backup restauré avec succès',
                data: {
                    stats
                }
            });
        });
}));

// @desc    Nettoyer les anciens backups
// @route   DELETE /api/backup/clean
// @access  Private (Admin)
router.delete('/clean', catchAsync((req, res, next) => {
    const keepCount = req.body.keepCount || 5;

    return cleanOldBackups(keepCount)
        .then((deletedCount) => {
            res.status(200).json({
                status: 'success',
                message: `${deletedCount} backup(s) supprimé(s)`,
                data: {
                    deletedCount,
                    keepCount
                }
            });
        });
}));

module.exports = router;
