const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const createInitialAdmin = async () => {
    try {
        // Check if any admin exists
        const adminExists = await Admin.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Create admin
        const admin = await Admin.create({
            username: 'admin',
            email: 'admin@onderEmlak.com',
            password: process.env.INITIAL_ADMIN_PASSWORD || 'admin123!@#',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        });

        console.log('Initial admin created:', admin.email);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createInitialAdmin(); 