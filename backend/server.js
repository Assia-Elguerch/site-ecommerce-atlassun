const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const backupRoutes = require('./routes/backup');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware global
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging en développement
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Route de santé avec Promise
app.get('/health', (req, res) => {
    Promise.resolve()
        .then(() => {
            const dbState = mongoose.connection.readyState;
            const dbStatus = dbState === 1 ? 'connecté' : 'déconnecté';

            return {
                status: 'success',
                message: 'Le serveur fonctionne correctement',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                database: dbStatus
            };
        })
        .then(healthData => {
            res.status(200).json(healthData);
        })
        .catch(error => {
            res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la vérification de santé',
                error: error.message
            });
        });
});

// Route GET /
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Bienvenue sur l’API e-commerce 🛍️',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});


// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/backup', backupRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/commandes', require('./routes/orders'));



// Gestion des routes non trouvées (404)
app.use(notFound);

// Middleware de gestion centralisée des erreurs
app.use(errorHandler);

// Fonction de démarrage du serveur avec Promises
const startServer = () => {
    return new Promise((resolve, reject) => {
        const PORT = process.env.PORT || 5000;

        connectDB()
            .then(() => {
                console.log(' Étape 1/2: Base de données connectée');

                return new Promise((resolveServer, rejectServer) => {
                    const server = app.listen(PORT, () => {
                        console.log(` Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
                        console.log(` API disponible sur http://localhost:${PORT}`);
                        console.log(' Étape 2/2: Serveur Express démarré');
                        resolveServer(server);
                    });

                    server.on('error', (error) => {
                        rejectServer(error);
                    });
                });
            })
            .then((server) => {
                console.log(' Démarrage complet du serveur réussi !');
                resolve(server);
                setupProcessHandlers(server);
            })
            .catch((error) => {
                console.error(' Erreur lors du démarrage du serveur:', error.message);
                reject(error);
                process.exit(1);
            });
    });
};

// Fonction pour gérer les événements du processus avec Promises
const setupProcessHandlers = (server) => {
    process.on('unhandledRejection', (reason, promise) => {
        console.error(' UNHANDLED REJECTION!');
        console.error('Raison:', reason);
        console.error('Promise:', promise);

        gracefulShutdown(server, 'unhandledRejection')
            .then(() => process.exit(1))
            .catch(() => process.exit(1));
    });

    process.on('uncaughtException', (error) => {
        console.error(' UNCAUGHT EXCEPTION!');
        console.error('Nom:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    });

    process.on('SIGTERM', () => {
        console.log('  SIGTERM reçu. Arrêt gracieux du serveur...');
        gracefulShutdown(server, 'SIGTERM')
            .then(() => {
                console.log(' Arrêt gracieux terminé');
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

    process.on('SIGINT', () => {
        console.log('\n  SIGINT reçu (Ctrl+C). Arrêt gracieux du serveur...');
        gracefulShutdown(server, 'SIGINT')
            .then(() => {
                console.log(' Arrêt gracieux terminé');
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });
};

// Fonction d'arrêt gracieux avec Promises
const gracefulShutdown = (server, signal) => {
    return new Promise((resolve, reject) => {
        console.log(` Fermeture des connexions en cours... (Signal: ${signal})`);

        server.close((err) => {
            if (err) {
                console.error(' Erreur lors de la fermeture du serveur:', err);
                reject(err);
                return;
            }

            console.log(' Serveur HTTP fermé');

            mongoose.connection.close(false)
                .then(() => {
                    console.log(' Connexion MongoDB fermée');
                    resolve();
                })
                .catch((error) => {
                    console.error(' Erreur lors de la fermeture de MongoDB:', error);
                    reject(error);
                });
        });

        setTimeout(() => {
            console.error('  Timeout: Forcer l\'arrêt du serveur');
            reject(new Error('Shutdown timeout'));
        }, 10000);
    });
};

// Fonction pour vérifier la santé du serveur avec Promise
const checkServerHealth = () => {
    return new Promise((resolve, reject) => {
        const checks = {
            mongodb: mongoose.connection.readyState === 1,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };

        if (checks.mongodb) {
            resolve(checks);
        } else {
            reject(new Error('MongoDB non connecté'));
        }
    });
};

// Vérification périodique de la santé (optionnel)
const startHealthCheck = () => {
    setInterval(() => {
        checkServerHealth()
            .then((health) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(' Vérification de santé:', {
                        database: health.mongodb ? 'OK' : 'KO',
                        uptime: `${Math.floor(health.uptime)}s`
                    });
                }
            })
            .catch((error) => {
                console.error(' Problème de santé détecté:', error.message);
            });
    }, 60000);
};

// Démarrer le serveur avec gestion des erreurs
console.log(' Démarrage du serveur e-commerce...');

startServer()
    .then((server) => {
        console.log(' Serveur prêt à recevoir des requêtes');

        if (process.env.NODE_ENV === 'development') {
            startHealthCheck();
        }
    })
    .catch((error) => {
        console.error(' Impossible de démarrer le serveur:', error.message);
        process.exit(1);
    });

module.exports = app;