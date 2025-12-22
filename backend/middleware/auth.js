const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Protéger les routes (authentification requise)
const protect = catchAsync((req, res, next) => {
    // 1. Récupérer le token
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Vous devez être connecté pour accéder à cette ressource', 401));
    }

    // 2. Vérifier le token
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    reject(new AppError('Votre session a expiré. Veuillez vous reconnecter', 401));
                } else if (err.name === 'JsonWebTokenError') {
                    reject(new AppError('Token invalide', 401));
                } else {
                    reject(new AppError('Erreur d\'authentification', 401));
                }
            } else {
                resolve(decoded);
            }
        });
    })
        .then(decoded => {
            // 3. Vérifier si l'utilisateur existe toujours
            return User.findById(decoded.id).select('+actif');
        })
        .then(user => {
            if (!user) {
                return next(new AppError('L\'utilisateur n\'existe plus', 401));
            }

            // 4. Vérifier si l'utilisateur est actif
            if (!user.actif) {
                return next(new AppError('Ce compte a été désactivé', 403));
            }

            // 5. Ajouter l'utilisateur à la requête
            req.user = user;
            next();
        });
});

// Restreindre l'accès par rôle
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403)
            );
        }
        next();
    };
};

module.exports = { protect, restrictTo };