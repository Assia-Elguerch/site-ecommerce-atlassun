/**
 * Utilitaires pour la génération et gestion des codes OTP
 */

/**
 * Générer un code OTP aléatoire
 * @param {number} length - Longueur du code (par défaut 6)
 * @returns {string} Code OTP
 */
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
}

/**
 * Créer un objet OTP avec expiration
 * @param {number} expiryMinutes - Durée de validité en minutes (par défaut 2)
 * @returns {Object} { code, expiresAt }
 */
function createOTP(expiryMinutes = 2) {
    const code = generateOTP(6);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    return {
        code,
        expiresAt,
        createdAt: new Date()
    };
}

/**
 * Vérifier si un OTP est expiré
 * @param {Date} expiresAt - Date d'expiration
 * @returns {boolean}
 */
function isOTPExpired(expiresAt) {
    return new Date() > new Date(expiresAt);
}

/**
 * Vérifier si un OTP correspond
 * @param {string} inputCode - Code saisi par l'utilisateur
 * @param {string} storedCode - Code stocké
 * @param {Date} expiresAt - Date d'expiration
 * @returns {Object} { valid, message }
 */
function verifyOTP(inputCode, storedCode, expiresAt) {
    if (!inputCode || !storedCode) {
        return { valid: false, message: 'Code OTP manquant' };
    }

    if (isOTPExpired(expiresAt)) {
        return { valid: false, message: 'Code OTP expiré' };
    }

    if (inputCode !== storedCode) {
        return { valid: false, message: 'Code OTP invalide' };
    }

    return { valid: true, message: 'Code OTP valide' };
}

/**
 * Formater le code OTP pour l'affichage (avec espaces)
 * @param {string} otp - Code OTP
 * @returns {string} Code formaté
 */
function formatOTP(otp) {
    return otp.match(/.{1,3}/g).join(' ');
}

module.exports = {
    generateOTP,
    createOTP,
    isOTPExpired,
    verifyOTP,
    formatOTP
};
