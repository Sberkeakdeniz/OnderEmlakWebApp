const { body, param, validationResult } = require('express-validator');

// Password complexity regex: at least 1 uppercase, 1 lowercase, 1 digit
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const PASSWORD_MSG = 'Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir';

// Middleware to check validation results
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    }
    next();
};

// MongoDB ObjectId param validation
const validateObjectId = (paramName = 'id') => [
    param(paramName).isMongoId().withMessage('Geçersiz ID formatı'),
    handleValidation
];

// Auth validations
const validateAdminLogin = [
    body('email')
        .notEmpty().withMessage('E-posta adresi gerekli')
        .isEmail().withMessage('Geçerli bir e-posta adresi girin'),
    body('password')
        .notEmpty().withMessage('Şifre gerekli'),
    handleValidation
];

const validateAdminRegister = [
    body('username')
        .notEmpty().withMessage('Kullanıcı adı gerekli')
        .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı')
        .trim(),
    body('email')
        .notEmpty().withMessage('E-posta adresi gerekli')
        .isEmail().withMessage('Geçerli bir e-posta adresi girin')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Şifre gerekli')
        .isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalı')
        .matches(PASSWORD_REGEX).withMessage(PASSWORD_MSG),
    body('firstName')
        .notEmpty().withMessage('Ad gerekli')
        .trim(),
    body('lastName')
        .notEmpty().withMessage('Soyad gerekli')
        .trim(),
    handleValidation
];

const validateCustomerRegister = [
    body('username')
        .notEmpty().withMessage('Kullanıcı adı gerekli')
        .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı')
        .trim(),
    body('email')
        .notEmpty().withMessage('E-posta adresi gerekli')
        .isEmail().withMessage('Geçerli bir e-posta adresi girin')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Şifre gerekli')
        .isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalı')
        .matches(PASSWORD_REGEX).withMessage(PASSWORD_MSG),
    body('firstName')
        .notEmpty().withMessage('Ad gerekli')
        .trim(),
    body('lastName')
        .notEmpty().withMessage('Soyad gerekli')
        .trim(),
    body('phoneNumber')
        .notEmpty().withMessage('Telefon numarası gerekli')
        .matches(/^[0-9\s()+-]{10,}$/).withMessage('Geçerli bir telefon numarası girin'),
    handleValidation
];

const validateCustomerLogin = [
    body('email')
        .notEmpty().withMessage('E-posta adresi gerekli')
        .isEmail().withMessage('Geçerli bir e-posta adresi girin'),
    body('password')
        .notEmpty().withMessage('Şifre gerekli'),
    handleValidation
];

// Property validations
const validateCreateProperty = [
    body('title')
        .notEmpty().withMessage('İlan başlığı gerekli')
        .isLength({ min: 3, max: 200 }).withMessage('Başlık 3-200 karakter olmalı')
        .trim(),
    body('description')
        .notEmpty().withMessage('Açıklama gerekli')
        .isLength({ min: 10 }).withMessage('Açıklama en az 10 karakter olmalı'),
    body('type')
        .notEmpty().withMessage('Emlak tipi gerekli')
        .isIn(['apartment', 'house', 'villa', 'office', 'land']).withMessage('Geçersiz emlak tipi'),
    body('status')
        .notEmpty().withMessage('İlan durumu gerekli')
        .isIn(['for-sale', 'for-rent', 'sold', 'rented']).withMessage('Geçersiz ilan durumu'),
    body('price')
        .notEmpty().withMessage('Fiyat gerekli')
        .isFloat({ min: 0 }).withMessage('Fiyat sıfırdan büyük olmalı'),
    body('location.address')
        .notEmpty().withMessage('Adres gerekli')
        .trim(),
    body('location.city')
        .notEmpty().withMessage('Şehir gerekli')
        .trim(),
    body('location.state')
        .notEmpty().withMessage('İlçe/Bölge gerekli')
        .trim(),
    body('features.area')
        .notEmpty().withMessage('Alan (m²) gerekli')
        .isFloat({ min: 1 }).withMessage('Alan sıfırdan büyük olmalı'),
    body('sahibindenUrl')
        .optional({ values: 'falsy' })
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Geçerli bir URL girin (http veya https)'),
    handleValidation
];

const validateUpdateProperty = [
    param('id').isMongoId().withMessage('Geçersiz ilan ID'),
    body('title')
        .optional()
        .isLength({ min: 3, max: 200 }).withMessage('Başlık 3-200 karakter olmalı')
        .trim(),
    body('description')
        .optional()
        .isLength({ min: 10 }).withMessage('Açıklama en az 10 karakter olmalı'),
    body('type')
        .optional()
        .isIn(['apartment', 'house', 'villa', 'office', 'land']).withMessage('Geçersiz emlak tipi'),
    body('status')
        .optional()
        .isIn(['for-sale', 'for-rent', 'sold', 'rented']).withMessage('Geçersiz ilan durumu'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Fiyat sıfırdan büyük olmalı'),
    body('sahibindenUrl')
        .optional({ values: 'falsy' })
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Geçerli bir URL girin (http veya https)'),
    handleValidation
];

// Profile update validation
const validateProfileUpdate = [
    body('firstName')
        .optional()
        .isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalı')
        .trim(),
    body('lastName')
        .optional()
        .isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalı')
        .trim(),
    body('email')
        .optional()
        .isEmail().withMessage('Geçerli bir e-posta adresi girin')
        .normalizeEmail(),
    handleValidation
];

// Password change validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty().withMessage('Mevcut şifre gerekli'),
    body('newPassword')
        .notEmpty().withMessage('Yeni şifre gerekli')
        .isLength({ min: 8 }).withMessage('Yeni şifre en az 8 karakter olmalı')
        .matches(PASSWORD_REGEX).withMessage(PASSWORD_MSG),
    handleValidation
];

module.exports = {
    handleValidation,
    validateObjectId,
    validateAdminLogin,
    validateAdminRegister,
    validateCustomerRegister,
    validateCustomerLogin,
    validateCreateProperty,
    validateUpdateProperty,
    validateProfileUpdate,
    validatePasswordChange
};
