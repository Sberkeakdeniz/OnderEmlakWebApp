const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Helper: set httpOnly cookie and send response
const sendTokenResponse = (res, statusCode, token, userData) => {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.domain = '.onderemlakmarmaris.com';
    }

    res.cookie('token', token, cookieOptions);

    res.status(statusCode).json({
        success: true,
        data: userData
    });
};

// @desc    Register admin
// @route   POST /api/auth/admin/register
// @access  Private (Admin only)
exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: 'Bu e-posta adresi veya kullanıcı adı zaten kayıtlı'
            });
        }

        const admin = await Admin.create({
            username,
            email,
            password,
            firstName,
            lastName
        });

        const token = generateToken(admin._id);

        sendTokenResponse(res, 201, token, {
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role
        });
    } catch (error) {
        console.error('registerAdmin error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt sırasında bir hata oluştu.'
        });
    }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz e-posta veya şifre'
            });
        }

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz e-posta veya şifre'
            });
        }

        const token = generateToken(admin._id);

        sendTokenResponse(res, 200, token, {
            _id: admin._id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role
        });
    } catch (error) {
        console.error('loginAdmin error:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında bir hata oluştu.'
        });
    }
};

// @desc    Register customer
// @route   POST /api/auth/customer/register
// @access  Public
exports.registerCustomer = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phoneNumber } = req.body;

        const customerExists = await Customer.findOne({ $or: [{ email }, { username }] });
        if (customerExists) {
            return res.status(400).json({
                success: false,
                message: 'Bu e-posta adresi veya kullanıcı adı zaten kayıtlı'
            });
        }

        const customer = await Customer.create({
            username,
            email,
            password,
            firstName,
            lastName,
            phoneNumber
        });

        const token = generateToken(customer._id);

        sendTokenResponse(res, 201, token, {
            _id: customer._id,
            username: customer.username,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            role: customer.role
        });
    } catch (error) {
        console.error('registerCustomer error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt sırasında bir hata oluştu.'
        });
    }
};

// @desc    Login customer
// @route   POST /api/auth/customer/login
// @access  Public
exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email }).select('+password');
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz e-posta veya şifre'
            });
        }

        const isMatch = await customer.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz e-posta veya şifre'
            });
        }

        const token = generateToken(customer._id);

        sendTokenResponse(res, 200, token, {
            _id: customer._id,
            username: customer.username,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            role: customer.role
        });
    } catch (error) {
        console.error('loginCustomer error:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında bir hata oluştu.'
        });
    }
};

// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.domain = '.onderemlakmarmaris.com';
    }

    res.cookie('token', '', cookieOptions);

    res.status(200).json({
        success: true,
        message: 'Çıkış yapıldı'
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgileri alınırken bir hata oluştu.'
        });
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body;
        const updateData = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;

        if (email && email !== req.user.email) {
            const Model = req.user.role === 'admin' ? Admin : Customer;
            const existing = await Model.findOne({ email });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu e-posta adresi zaten kullanılıyor'
                });
            }
            updateData.email = email;
        }

        const Model = req.user.role === 'admin' ? Admin : Customer;
        const user = await Model.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profil güncellenirken bir hata oluştu.'
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const Model = req.user.role === 'admin' ? Admin : Customer;
        const user = await Model.findById(req.user._id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mevcut şifre hatalı'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Şifre başarıyla güncellendi'
        });
    } catch (error) {
        console.error('changePassword error:', error);
        res.status(500).json({
            success: false,
            message: 'Şifre değiştirilirken bir hata oluştu.'
        });
    }
};
