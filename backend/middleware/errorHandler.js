const AppError = require('../utils/AppError');

// ==================== GESTIONNAIRES D'ERREURS MONGODB ====================

// Erreur de cast MongoDB (ID invalide)
const handleCastErrorDB = (err) => {
    const message = `Ressource non trouvée. ID invalide: ${err.value}`;
    return new AppError(message, 400);
};

// Erreur de duplication MongoDB (clé unique)
const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `La valeur "${value}" existe déjà pour le champ "${field}". Veuillez utiliser une autre valeur.`;
    return new AppError(message, 409);
};

// Erreur de validation MongoDB
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Données invalides: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Erreur de connexion MongoDB
const handleMongoNetworkError = (err) => {
    const message = 'Erreur de connexion à la base de données. Veuillez réessayer plus tard.';
    console.error(' Erreur réseau MongoDB:', err.message);
    return new AppError(message, 503);
};

// Erreur de timeout MongoDB
const handleMongoTimeoutError = (err) => {
    const message = 'La requête a pris trop de temps. Veuillez réessayer.';
    console.error(' Timeout MongoDB:', err.message);
    return new AppError(message, 504);
};

// ==================== GESTIONNAIRES D'ERREURS JWT ====================

// Erreur JWT invalide
const handleJWTError = () =>
    new AppError('Token invalide. Veuillez vous reconnecter.', 401);

// Erreur JWT expiré
const handleJWTExpiredError = () =>
    new AppError('Votre session a expiré. Veuillez vous reconnecter.', 401);

// Erreur JWT malformé
const handleJWTMalformedError = () =>
    new AppError('Token malformé. Veuillez vous reconnecter.', 401);

// ==================== GESTIONNAIRES D'ERREURS HTTP ====================

// Erreur de parsing JSON
const handleSyntaxError = (err) => {
    if (err.type === 'entity.parse.failed') {
        return new AppError('JSON invalide. Vérifiez le format de vos données.', 400);
    }
    return new AppError('Erreur de syntaxe dans la requête.', 400);
};

// Erreur de payload trop grand
const handlePayloadTooLargeError = () =>
    new AppError('Les données envoyées sont trop volumineuses. Limite: 10MB.', 413);

// Erreur de type de contenu non supporté
const handleUnsupportedMediaTypeError = () =>
    new AppError('Type de contenu non supporté. Utilisez application/json.', 415);

// Erreur de méthode HTTP non autorisée
const handleMethodNotAllowedError = (req) =>
    new AppError(`La méthode ${req.method} n'est pas autorisée pour cette route.`, 405);

// ==================== GESTIONNAIRES D'ERREURS MULTER (Upload) ====================

// Erreur de fichier trop grand (Multer)
const handleMulterFileSizeError = () =>
    new AppError('Le fichier est trop volumineux. Taille maximale: 5MB.', 413);

// Erreur de type de fichier non autorisé (Multer)
const handleMulterFileTypeError = () =>
    new AppError('Type de fichier non autorisé. Formats acceptés: JPG, PNG, PDF.', 400);

// Erreur générale Multer
const handleMulterError = (err) => {
    if (err.code === 'LIMIT_FILE_SIZE') return handleMulterFileSizeError();
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return new AppError('Trop de fichiers envoyés ou champ inattendu.', 400);
    }
    return new AppError(`Erreur lors de l'upload: ${err.message}`, 400);
};

// ==================== GESTIONNAIRES D'ERREURS DE SÉCURITÉ ====================

// Erreur de rate limiting
const handleRateLimitError = () =>
    new AppError('Trop de requêtes. Veuillez réessayer dans quelques minutes.', 429);

// Erreur CORS
const handleCORSError = () =>
    new AppError('Accès refusé. Origine non autorisée.', 403);

// ==================== LOGGING DES ERREURS ====================

// Logger les erreurs avec détails
const logError = (err, req) => {
    const timestamp = new Date().toISOString();
    console.error('\n╔════════════════════════════════════════════════════════╗');
    console.error('║                    ERREUR DÉTECTÉE                     ║');
    console.error('╚════════════════════════════════════════════════════════╝');
    console.error(` Timestamp: ${timestamp}`);
    console.error(` Méthode: ${req.method}`);
    console.error(` URL: ${req.originalUrl}`);
    console.error(` IP: ${req.ip || req.connection.remoteAddress}`);
    console.error(` Status: ${err.statusCode || 500}`);
    console.error(` Message: ${err.message}`);
    console.error(` Type: ${err.name}`);

    if (err.stack) {
        console.error('\n Stack Trace:');
        console.error(err.stack);
    }

    if (req.body && Object.keys(req.body).length > 0) {
        console.error('\n Body:', JSON.stringify(req.body, null, 2));
    }

    console.error('╚════════════════════════════════════════════════════════╝\n');
};

// ==================== ENVOI DES RÉPONSES D'ERREUR ====================

// Envoyer l'erreur en développement (détails complets)
const sendErrorDev = (err, req, res) => {
    logError(err, req);

    res.status(err.statusCode).json({
        status: err.status,
        error: {
            name: err.name,
            message: err.message,
            statusCode: err.statusCode,
            isOperational: err.isOperational
        },
        message: err.message,
        stack: err.stack,
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            params: req.params,
            query: req.query
        }
    });
};

// Envoyer l'erreur en production (sécurisé)
const sendErrorProd = (err, req, res) => {
    // Erreur opérationnelle de confiance : envoyer le message au client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
    // Erreur de programmation ou inconnue : ne pas exposer les détails
    else {
        logError(err, req);

        res.status(500).json({
            status: 'error',
            message: 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
            timestamp: new Date().toISOString()
        });
    }
};

// ==================== MIDDLEWARE PRINCIPAL ====================

// Middleware principal de gestion des erreurs
const errorHandler = (err, req, res, next) => {
    // Définir les valeurs par défaut
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Mode développement : tout afficher
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    // Mode production : transformer et sécuriser
    else {
        let error = Object.create(err);
        error.message = err.message;
        error.name = err.name;
        error.statusCode = err.statusCode;
        error.status = err.status;
        error.isOperational = err.isOperational;

        // ===== Erreurs MongoDB =====
        if (err.name === 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
        if (err.name === 'MongoNetworkError') error = handleMongoNetworkError(err);
        if (err.name === 'MongoTimeoutError') error = handleMongoTimeoutError(err);
        if (err.name === 'MongoServerError' && err.code === 11000) error = handleDuplicateFieldsDB(err);

        // ===== Erreurs JWT =====
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (err.name === 'NotBeforeError') error = handleJWTMalformedError();

        // ===== Erreurs HTTP =====
        if (err.name === 'SyntaxError') error = handleSyntaxError(err);
        if (err.type === 'entity.too.large') error = handlePayloadTooLargeError();
        if (err.status === 415) error = handleUnsupportedMediaTypeError();
        if (err.status === 405) error = handleMethodNotAllowedError(req);

        // ===== Erreurs Multer (Upload) =====
        if (err.name === 'MulterError') error = handleMulterError(err);

        // ===== Erreurs de sécurité =====
        if (err.status === 429) error = handleRateLimitError();
        if (err.name === 'ForbiddenError') error = handleCORSError();

        // ===== Erreurs de connexion réseau =====
        if (err.code === 'ECONNREFUSED') {
            error = new AppError('Impossible de se connecter au service. Veuillez réessayer.', 503);
        }
        if (err.code === 'ETIMEDOUT') {
            error = new AppError('La requête a expiré. Veuillez réessayer.', 504);
        }

        sendErrorProd(error, req, res);
    }
};

// ==================== MIDDLEWARE 404 ====================

// Middleware pour routes non trouvées (404)
const notFound = (req, res, next) => {
    const error = new AppError(
        `Route ${req.originalUrl} non trouvée sur ce serveur`,
        404
    );
    next(error);
};

// ==================== EXPORTS ====================

module.exports = { errorHandler, notFound };