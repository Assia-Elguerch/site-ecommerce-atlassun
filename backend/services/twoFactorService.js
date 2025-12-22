const otplib = require('otplib');
const qrcode = require('qrcode');
const { authenticator } = otplib;

/**
 * Service de gestion de l'authentification à deux facteurs (2FA)
 * Utilise otplib pour la génération/vérification et qrcode pour l'affichage
 */
class TwoFactorService {

    /**
     * Génère un secret unique pour un utilisateur
     * @param {string} email - Email de l'utilisateur pour l'identifiant
     * @returns {Promise<{secret: string, otpauthUrl: string}>}
     */
    generateSecret(email) {
        return new Promise((resolve, reject) => {
            try {
                const secret = authenticator.generateSecret();
                const otpauthUrl = authenticator.keyuri(email, 'AtlasSun Ecommerce', secret);
                resolve({ secret, otpauthUrl });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Génère une image QR Code à partir de l'URL OTPAuth
     * @param {string} otpauthUrl 
     * @returns {Promise<string>} Data URL du QR Code
     */
    generateQRCode(otpauthUrl) {
        return new Promise((resolve, reject) => {
            qrcode.toDataURL(otpauthUrl, (err, imageUrl) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(imageUrl);
            });
        });
    }

    /**
     * Vérifie un token TOTP
     * @param {string} token - Code soumis par l'utilisateur
     * @param {string} secret - Secret stocké en base
     * @returns {Promise<boolean>}
     */
    verifyToken(token, secret) {
        return new Promise((resolve, reject) => {
            try {
                const isValid = authenticator.verify({ token, secret });
                resolve(isValid);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new TwoFactorService();
