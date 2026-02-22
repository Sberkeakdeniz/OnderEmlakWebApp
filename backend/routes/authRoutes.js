const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { verifyCaptcha } = require('../middleware/captcha');
const {
    registerAdmin,
    loginAdmin,
    registerCustomer,
    loginCustomer,
    logout,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const {
    validateAdminLogin,
    validateAdminRegister,
    validateCustomerRegister,
    validateCustomerLogin,
    validateProfileUpdate,
    validatePasswordChange
} = require('../middleware/validate');

// Admin routes
router.post('/admin/create', protect, authorize('admin'), validateAdminRegister, registerAdmin);
router.post('/admin/login', verifyCaptcha, validateAdminLogin, loginAdmin);

// Customer routes
router.post('/customer/register', verifyCaptcha, validateCustomerRegister, registerCustomer);
router.post('/customer/login', verifyCaptcha, validateCustomerLogin, loginCustomer);

// Logout
router.post('/logout', protect, logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);

module.exports = router;
