const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' }); // Adjust path to .env

const createAdmin = () => {
    console.log('Connecting to database...');
    // Use path relative to script execution or absolute path logic if needed
    // But since we run from backend root usually, let's adjust config path

    // Connect DB
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atlassun')
        .then(() => {
            console.log('Connected to MongoDB');
            return User.findOne({ email: 'admin@atlassun.com' });
        })
        .then(existingAdmin => {
            if (existingAdmin) {
                console.log('Admin user already exists.');
                // Update password if needed? Let's just reset it to be sure.
                existingAdmin.motDePasse = 'Admin123!';
                existingAdmin.role = 'admin';
                existingAdmin.isTwoFactorEnabled = false; // Disable 2FA for easy access
                return existingAdmin.save();
            } else {
                console.log('Creating new admin user...');
                const newAdmin = new User({
                    nom: 'Admin',
                    prenom: 'System',
                    email: 'admin@atlassun.com',
                    motDePasse: 'Admin123!',
                    role: 'admin',
                    telephone: '0600000000',
                    isTwoFactorEnabled: false
                });
                return newAdmin.save();
            }
        })
        .then(() => {
            console.log('Admin user ready.');
            console.log('Email: admin@atlassun.com');
            console.log('Password: Admin123!');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error creating admin:', err);
            process.exit(1);
        });
};

createAdmin();
