const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const users = await User.find({}).select('+motDePasse');
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`User: ${user.email}`);
            console.log(`Hash: ${user.motDePasse}`);

            // Try to see if it matches common test passwords
            const testPasswords = ['123456', 'password', 'atlassun2025'];
            for (const pw of testPasswords) {
                const isMatch = await bcrypt.compare(pw, user.motDePasse);
                if (isMatch) {
                    console.log(`  MATCH with "${pw}"`);
                }
            }

            // Check if it looks like a double-hashed bcrypt
            // A double hash of a bcrypt hash would also start with $2a$ or $2b$
            // but the content would be different.
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
