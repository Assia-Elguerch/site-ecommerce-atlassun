const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const twoFactorService = require('../services/twoFactorService');
const emailService = require('../services/emailService');
const AppError = require('../utils/AppError');

// Fonction pour générer le token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'atlassun-secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Fonction pour envoyer la réponse avec token
const sendTokenResponse = (user, statusCode, res, message) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: {
            id: user._id,
            firstName: user.prenom,
            lastName: user.nom,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isTwoFactorEnabled: user.isTwoFactorEnabled
        }
    });
};

/**
 * @desc    Inscription avec configuration 2FA (QR Code)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = (req, res, next) => {
    const { nom, prenom, email, motDePasse, telephone, role } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
        return next(new AppError('Veuillez fournir tous les champs requis', 400));
    }

    let newUser;
    let twoFactorSecret;

    // 1. Vérifier si l'utilisateur existe
    User.findOne({ email: email.toLowerCase() })
        .then(userExists => {
            if (userExists) {
                throw new AppError('Ce compte existe déjà', 409);
            }
            // 2. Générer le secret 2FA
            return twoFactorService.generateSecret(email.toLowerCase());
        })
        .then(secretData => {
            twoFactorSecret = secretData.secret;
            const otpauthUrl = secretData.otpauthUrl;

            // 3. Hasher le mot de passe
            // 3. Générer le QR code
            return twoFactorService.generateQRCode(otpauthUrl);
        })
        .then(qrCodeUrl => {
            // 4. Créer l'utilisateur (Le mot de passe sera haché par le middleware User.js)
            return User.create({
                nom: nom.trim(),
                prenom: prenom.trim(),
                email: email.toLowerCase().trim(),
                motDePasse: motDePasse, // Pass plain text
                telephone,
                role: role || 'client',
                twoFactorSecret: twoFactorSecret,
                isTwoFactorEnabled: false, // Sera activé après vérification du code
                actif: true
            }).then(user => {
                return { user, qrCodeUrl };
            });
        })
        .then(({ user, qrCodeUrl }) => {
            // 5. Renvoyer le QR Code pour configuration
            res.status(201).json({
                success: true,
                message: 'Compte créé. Veuillez scanner le QR code pour activer la 2FA',
                userId: user._id,
                email: user.email,
                qrCodeUrl: qrCodeUrl,
                secret: twoFactorSecret // Optionnel, pour saisie manuelle
            });
        })
        .catch(err => next(err));
};

/**
 * @desc    Vérifier le code 2FA pour finaliser l'inscription ou la connexion
 * @route   POST /api/auth/verify-2fa
 * @access  Public
 */
exports.verifyTwoFactor = (req, res, next) => {
    const { email, token, isSetup } = req.body; // isSetup = true si c'est la première config

    if (!email || !token) {
        return next(new AppError('Email et code 2FA requis', 400));
    }

    User.findOne({ email: email.toLowerCase() }).select('+twoFactorSecret +motDePasse')
        .then(user => {
            if (!user) {
                throw new AppError('Utilisateur non trouvé', 404);
            }

            return twoFactorService.verifyToken(token, user.twoFactorSecret)
                .then(isValid => {
                    if (!isValid) {
                        throw new AppError('Code 2FA invalide', 401);
                    }
                    return user;
                });
        })
        .then(user => {
            // Si c'est la configuration initiale, on active la 2FA
            if (isSetup && !user.isTwoFactorEnabled) {
                user.isTwoFactorEnabled = true;
                return user.save();
            }
            return user;
        })
        .then(user => {
            sendTokenResponse(user, 200, res, 'Authentification 2FA réussie');
        })
        .catch(err => next(err));
};

/**
 * @desc    Connexion avec gestion 2FA
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = (req, res, next) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        return next(new AppError('Veuillez fournir email et mot de passe', 400));
    }

    User.findOne({ email: email.toLowerCase() }).select('+motDePasse +isTwoFactorEnabled +twoFactorSecret')
        .then(user => {
            if (!user) {
                console.log(`[AUTH] Login failed: User not found (${email})`);
                throw new AppError('Identifiants incorrects', 401);
            }

            console.log(`[AUTH] Comparing password for ${email}`);
            return bcrypt.compare(motDePasse, user.motDePasse)
                .then(isMatch => {
                    if (!isMatch) {
                        console.log(`[AUTH] Login failed: Password mismatch for ${email}`);
                        throw new AppError('Identifiants incorrects', 401);
                    }
                    console.log(`[AUTH] Login success for ${email}`);
                    return user;
                });
        })
        .then(user => {
            // Si 2FA activé, demander le code
            // Note: Si le user a un secret mais pas isTwoFactorEnabled, on pourrait le forcer à configurer
            // Ici on assume que si isTwoFactorEnabled est true, alors on demande le code
            if (user.isTwoFactorEnabled) {
                res.status(200).json({
                    success: true,
                    requiresTwoFactor: true,
                    email: user.email,
                    message: 'Veuillez entrer votre code 2FA'
                });
            } else {
                // Pas de 2FA, connexion directe
                sendTokenResponse(user, 200, res, 'Connexion réussie');
            }
        })
        .catch(err => next(err));
};

/**
 * @desc    Obtenir le profil utilisateur
 */
exports.getMe = (req, res, next) => {
    User.findById(req.user.id)
        .then(user => {
            res.status(200).json({
                success: true,
                data: user
            });
        })
        .catch(err => next(err));
};

exports.updateProfil = (req, res, next) => {
    const allowedFields = ['nom', 'prenom', 'telephone', 'adresse', 'avatar'];
    const updates = {};

    console.log('[AUTH UPDATE] Request Body Fields:', Object.keys(req.body));
    console.log('[AUTH UPDATE] User ID:', req.user?._id || req.user?.id);

    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        console.warn('[AUTH UPDATE] No allowed fields provided for update');
        return next(new AppError('Aucune mise à jour fournie', 400));
    }

    console.log('[AUTH UPDATE] Fields to update:', Object.keys(updates));
    if (updates.avatar) {
        console.log('[AUTH UPDATE] Avatar update detected (Length:', updates.avatar.length, ')');
    }

    User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
        .then(user => {
            if (!user) {
                console.error('[AUTH UPDATE] User not found during update');
                throw new AppError('Utilisateur non trouvé', 404);
            }
            console.log('[AUTH UPDATE] Update successful for:', user.email);

            // Format response to match frontend model (mapping _id to id)
            const formattedUser = {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                telephone: user.telephone,
                role: user.role,
                avatar: user.avatar,
                actif: user.actif,
                dateInscription: user.dateInscription
            };

            res.status(200).json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: { user: formattedUser }
            });
        })
        .catch(err => next(err));
};

exports.changePassword = (req, res, next) => {
    const { motDePasseActuel, nouveauMotDePasse, oldPassword, newPassword } = req.body;
    const currentPwd = motDePasseActuel || oldPassword;
    const newPwd = nouveauMotDePasse || newPassword;

    if (!currentPwd || !newPwd) {
        return next(new AppError('Veuillez fournir l\'ancien et le nouveau mot de passe', 400));
    }

    if (newPwd.length < 6) {
        return next(new AppError('Le nouveau mot de passe doit contenir au moins 6 caractères', 400));
    }

    let userFromDb;

    User.findById(req.user.id).select('+motDePasse')
        .then(user => {
            userFromDb = user;
            return bcrypt.compare(currentPwd, user.motDePasse);
        })
        .then(isMatch => {
            if (!isMatch) {
                throw new AppError('Mot de passe actuel incorrect', 401);
            }
            // Assign original password and let middleware hash it
            userFromDb.motDePasse = newPwd;
            return userFromDb.save();
        })
        .then(user => {
            sendTokenResponse(user, 200, res, 'Mot de passe modifié avec succès');
        })
        .catch(err => next(err));
};

exports.verifyToken = (req, res, next) => {
    res.status(200).json({
        success: true,
        valid: true,
        data: {
            user: {
                id: req.user._id,
                nom: req.user.nom,
                prenom: req.user.prenom,
                email: req.user.email,
                role: req.user.role
            }
        }
    });
};

exports.getProfil = exports.getMe;

exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;
    const crypto = require('crypto');
    const EmailServiceClass = require('../services/emailService');

    let user;

    if (!email) {
        return next(new AppError('Veuillez fournir un email', 400));
    }

    User.findOne({ email })
        .then(foundUser => {
            if (!foundUser) {
                throw new AppError('Aucun utilisateur trouvé avec cet email', 404);
            }
            user = foundUser;

            const resetToken = crypto.randomBytes(20).toString('hex');

            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

            return user.save({ validateBeforeSave: false })
                .then(() => resetToken);
        })
        .then(resetToken => {
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/auth/reset-password/${resetToken}`;
            const message = `Vous avez demandé la réinitialisation de votre mot de passe.\n\nLien: ${resetUrl}`;

            // DEV MODE: Retourner le lien dans la réponse pour test
            const responsePayload = {
                success: true,
                message: 'Email de réinitialisation envoyé'
            };

            if (process.env.NODE_ENV === 'development') {
                responsePayload.debug_resetLink = resetUrl;
                console.log('RESET LINK (DEV):', resetUrl);
            }

            return emailService.sendPasswordResetLinkEmail(user.email, resetUrl, user.prenom)
                .then(() => {
                    return res.status(200).json(responsePayload);
                })
                .catch(err => {
                    console.error('Email send failed:', err.message);
                    // Fallback to simulation mode to unblock user
                    return res.status(200).json({
                        ...responsePayload,
                        message: 'Email simulé (Lien prêt, email non envoyé)',
                        debug_resetLink: resetUrl
                    });
                });
        })
        .catch(err => next(err));
};

exports.resetPassword = (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
        .then(user => {
            if (!user) {
                throw new AppError('Token invalide ou expiré', 400);
            }

            user.motDePasse = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            return user.save();
        })
        .then(user => {
            sendTokenResponse(user, 200, res, 'Mot de passe réinitialisé avec succès');
        })
        .catch(err => next(err));
};

// Garder les exports pour la compatibilité avec les routes existantes si nécessaire
// Mais on remplace logiquement les anciennes méthodes par celles-ci
exports.inscription = exports.register;
exports.connexion = exports.login;
exports.registerDirect = exports.register;
