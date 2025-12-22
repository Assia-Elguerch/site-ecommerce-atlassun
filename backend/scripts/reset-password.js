const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const resetPassword = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atlassun');
        console.log('Connected.');

        const email = 'assiaelguerch08@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        console.log(`Found user: ${user.email}`);
        user.motDePasse = '123456'; // Will be hashed by pre-save hook
        await user.save();

        console.log('Password reset to: 123456');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
