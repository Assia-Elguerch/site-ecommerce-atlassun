const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 MongoDB Connected');

        const admin = await User.findOne({ role: 'admin' });

        if (admin) {
            console.log('✅ Admin FOUND:', admin.email);
            console.log('   ID:', admin._id);
        } else {
            console.log('❌ NO ADMIN FOUND in the database!');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAdmin();
