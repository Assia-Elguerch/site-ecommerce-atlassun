const mongoose = require('mongoose');

const connectDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then((conn) => {
                console.log(` MongoDB connecté: ${conn.connection.host}`);
                resolve(conn);
            })
            .catch((error) => {
                console.error('Erreur de connexion MongoDB:', error.message);
                reject(error);
            });
    });
};


mongoose.connection.on('disconnected', () => {
    console.log(' MongoDB déconnecté');
});

mongoose.connection.on('error', (err) => {
    console.error('Erreur MongoDB:', err);
});

module.exports = connectDB;