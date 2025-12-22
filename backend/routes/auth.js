const express = require('express');
const {
    register,
    login,
    getMe,
    getProfil,
    updateProfil,
    changePassword,
    verifyToken,
    verifyTwoFactor,
    forgotPassword,
    resetPassword,
    // Aliases
    inscription,
    connexion,
    registerDirect
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes publiques - Inscription & Connexion avec 2FA
router.post('/register', register);
router.post('/inscription', inscription); // Alias
router.post('/verify-2fa', verifyTwoFactor); // Verification 2FA (setup ou login)

// Connexion
router.post('/connexion', connexion);
router.post('/login', login);

// Routes reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Routes protégées
router.use(protect); // Toutes les routes suivantes nécessitent une authentification

router.get('/profil', getProfil);
router.get('/profile', getProfil); // Alias
router.patch('/profil', updateProfil);
router.patch('/profile', updateProfil); // Alias
router.post('/change-password', changePassword);
router.get('/verify-token', verifyToken);
router.get('/me', getMe);

module.exports = router;