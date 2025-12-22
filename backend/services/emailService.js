const nodemailer = require('nodemailer');

/**
 * Service d'envoi d'emails avec Nodemailer
 * Configure Gmail SMTP pour envoyer les OTP et notifications
 */
class EmailService {
  constructor() {
    // Configuration Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'votre-email@gmail.com', // À configurer
        pass: process.env.EMAIL_PASSWORD || 'votre-mot-de-passe-app' // Mot de passe d'application Gmail
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: {
        name: 'AtlasSun',
        address: process.env.EMAIL_USER || 'noreply@atlassun.ma'
      },
      to: options.email,
      subject: options.subject,
      html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Generic email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Envoyer un code OTP par email
   */
  async sendOTP(email, otpCode, firstName = '') {
    const mailOptions = {
      from: {
        name: 'AtlasSun',
        address: process.env.EMAIL_USER || 'noreply@atlassun.ma'
      },
      to: email,
      subject: '🔐 Votre code de vérification AtlasSun',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #1A4C8B, #C0392B);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: rgba(212, 166, 80, 0.3);
              border-radius: 50%;
              margin: 0 auto 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              font-weight: bold;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #2A2A2A;
              margin-bottom: 20px;
            }
            .message {
              color: #666;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .otp-container {
              background: linear-gradient(135deg, #FAF7F0, #F5F5F5);
              border: 2px dashed #D4A650;
              border-radius: 12px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-label {
              color: #999;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            .otp-code {
              font-size: 42px;
              font-weight: 700;
              color: #1A4C8B;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .otp-validity {
              color: #C0392B;
              font-size: 14px;
              margin-top: 15px;
            }
            .warning {
              background: #FFF3CD;
              border-left: 4px solid #F39C12;
              padding: 15px 20px;
              margin: 25px 0;
              border-radius: 4px;
              color: #856404;
              font-size: 14px;
            }
            .footer {
              background: #F8F9FA;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #E0E0E0;
            }
            .footer-text {
              color: #999;
              font-size: 13px;
              margin: 0 0 15px;
            }
            .social-links {
              margin: 15px 0;
            }
            .social-links a {
              display: inline-block;
              width: 35px;
              height: 35px;
              background: #1A4C8B;
              border-radius: 50%;
              margin: 0 5px;
              color: white;
              text-decoration: none;
              line-height: 35px;
            }
            .btn {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #C0392B, #D4392B);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo">AS</div>
              <h1>AtlasSun</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">
                ${firstName ? `Bonjour ${firstName},` : 'Bonjour,'}
              </div>

              <div class="message">
                Merci de vous être inscrit sur <strong>AtlasSun</strong>, votre destination premium pour l'artisanat marocain authentique.
              </div>

              <div class="message">
                Pour finaliser votre inscription, veuillez utiliser le code de vérification ci-dessous :
              </div>

              <!-- OTP Box -->
              <div class="otp-container">
                <div class="otp-label">Code de vérification</div>
                <div class="otp-code">${otpCode}</div>
                <div class="otp-validity">⏰ Valide pendant 2 minutes</div>
              </div>

              <!-- Warning -->
              <div class="warning">
                <strong>⚠️ Important :</strong> Ne partagez jamais ce code avec qui que ce soit. L'équipe AtlasSun ne vous demandera jamais votre code de vérification.
              </div>

              <div class="message">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
              </div>

              <a href="http://localhost:4200/auth/register" class="btn">Continuer mon inscription</a>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-text">
                © 2025 AtlasSun - Artisanat Marocain Premium
              </div>
              <div class="footer-text">
                📧 contact@atlassun.ma | 📞 +212 5XX-XXXXXX
              </div>
              <div class="social-links">
                <a href="#">f</a>
                <a href="#">📷</a>
                <a href="#">🐦</a>
              </div>
              <div class="footer-text" style="margin-top: 20px; font-size: 11px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Envoyer un email de bienvenue
   */
  async sendWelcomeEmail(email, firstName) {
    const mailOptions = {
      from: {
        name: 'AtlasSun',
        address: process.env.EMAIL_USER || 'noreply@atlassun.ma'
      },
      to: email,
      subject: '🎉 Bienvenue sur AtlasSun !',
      html: `
        <h1>Bienvenue ${firstName} !</h1>
        <p>Votre compte AtlasSun a été créé avec succès.</p>
        <p>Découvrez notre collection exclusive de produits artisanaux marocains.</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(email, otpCode, firstName = '') {
    const mailOptions = {
      from: {
        name: 'AtlasSun',
        address: process.env.EMAIL_USER || 'noreply@atlassun.ma'
      },
      to: email,
      subject: '🔑 Réinitialisation de votre mot de passe AtlasSun',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>${firstName ? `Bonjour ${firstName},` : 'Bonjour,'}</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Votre code de vérification est : <strong style="font-size: 24px; color: #1A4C8B;">${otpCode}</strong></p>
        <p>Ce code est valable pendant 10 minutes.</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe avec lien
   */
  async sendPasswordResetLinkEmail(email, resetUrl, firstName = '') {
    const mailOptions = {
      from: {
        name: 'AtlasSun',
        address: process.env.EMAIL_USER || 'noreply@atlassun.ma'
      },
      to: email,
      subject: '🔑 Réinitialisation de votre mot de passe AtlasSun',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1A4C8B, #C0392B); padding: 40px 30px; text-align: center; color: white; }
            .logo { width: 60px; height: 60px; background: rgba(212, 166, 80, 0.3); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; }
            .content { padding: 40px 30px; }
            .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #C0392B, #D4392B); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #F8F9FA; padding: 30px; text-align: center; border-top: 1px solid #E0E0E0; font-size: 13px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">AS</div>
              <h1>AtlasSun</h1>
            </div>
            <div class="content">
              <p>${firstName ? `Bonjour ${firstName},` : 'Bonjour,'}</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
              <p>Cliquez sur le lien ci-dessous pour changer votre mot de passe :</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
              </div>
              
              <p>Ce lien est valide pendant 10 minutes.</p>
              <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
            </div>
            <div class="footer">
              © 2025 AtlasSun - Artisanat Marocain Premium
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Tester la configuration email
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
