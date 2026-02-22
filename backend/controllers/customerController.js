const Customer = require('../models/Customer');
const Property = require('../models/Property');
const { escapeRegex } = require('../utils/helpers');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (Admin only)
exports.getCustomers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        let query = {};
        if (search) {
            const escaped = escapeRegex(search);
            query = {
                $or: [
                    { firstName: new RegExp(escaped, 'i') },
                    { lastName: new RegExp(escaped, 'i') },
                    { email: new RegExp(escaped, 'i') },
                    { phoneNumber: new RegExp(escaped, 'i') }
                ]
            };
        }

        const total = await Customer.countDocuments(query);
        const customers = await Customer.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: customers.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: customers
        });
    } catch (error) {
        console.error('getCustomers error:', error);
        res.status(500).json({
            success: false,
            message: 'Müşteriler yüklenirken bir hata oluştu.'
        });
    }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private (Admin only)
exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .select('-password')
            .populate('favorites');

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Müşteri bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('getCustomer error:', error);
        res.status(500).json({
            success: false,
            message: 'Müşteri bilgileri yüklenirken bir hata oluştu.'
        });
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin only)
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Müşteri bulunamadı'
            });
        }

        await customer.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('deleteCustomer error:', error);
        res.status(500).json({
            success: false,
            message: 'Müşteri silinirken bir hata oluştu.'
        });
    }
};

// @desc    Get customer favorites
// @route   GET /api/customers/me/favorites
// @access  Private (Customer)
exports.getFavorites = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate('favorites');

        res.status(200).json({
            success: true,
            data: customer.favorites
        });
    } catch (error) {
        console.error('getFavorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Favoriler yüklenirken bir hata oluştu.'
        });
    }
};

// @desc    Add property to favorites
// @route   POST /api/customers/me/favorites/:propertyId
// @access  Private (Customer)
exports.addFavorite = async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (customer.favorites.includes(req.params.propertyId)) {
            return res.status(400).json({
                success: false,
                message: 'Bu ilan zaten favorilerinizde'
            });
        }

        customer.favorites.push(req.params.propertyId);
        await customer.save();

        res.status(200).json({
            success: true,
            data: customer.favorites
        });
    } catch (error) {
        console.error('addFavorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Favorilere eklenirken bir hata oluştu.'
        });
    }
};

// @desc    Remove property from favorites
// @route   DELETE /api/customers/me/favorites/:propertyId
// @access  Private (Customer)
exports.removeFavorite = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id);

        customer.favorites = customer.favorites.filter(
            fav => fav.toString() !== req.params.propertyId
        );
        await customer.save();

        res.status(200).json({
            success: true,
            data: customer.favorites
        });
    } catch (error) {
        console.error('removeFavorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Favorilerden çıkarılırken bir hata oluştu.'
        });
    }
};
