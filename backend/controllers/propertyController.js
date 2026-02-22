const Property = require('../models/Property');
const { escapeRegex } = require('../utils/helpers');

const VALID_TYPES = ['apartment', 'house', 'villa', 'office', 'land'];
const VALID_STATUSES = ['for-sale', 'for-rent', 'sold', 'rented'];

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Admin only)
exports.createProperty = async (req, res) => {
    try {
        // Add the admin ID as owner
        req.body.owner = req.user.id;

        const property = await Property.create(req.body);

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('createProperty error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan oluşturulurken bir hata oluştu.'
        });
    }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12));
        const skip = (page - 1) * limit;

        // Sort
        let sortObj = { createdAt: -1 };
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price_asc': sortObj = { price: 1 }; break;
                case 'price_desc': sortObj = { price: -1 }; break;
                case 'newest': sortObj = { createdAt: -1 }; break;
                case 'oldest': sortObj = { createdAt: 1 }; break;
                case 'most_viewed': sortObj = { views: -1 }; break;
            }
        }

        const total = await Property.countDocuments({ isPublished: true });
        const properties = await Property.find({ isPublished: true })
            .populate('owner', 'firstName lastName email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: properties
        });
    } catch (error) {
        console.error('getProperties error:', error);
        res.status(500).json({
            success: false,
            message: 'İlanlar yüklenirken bir hata oluştu.'
        });
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('owner', 'firstName lastName email');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('getProperty error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan yüklenirken bir hata oluştu.'
        });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin only)
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('updateProperty error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan güncellenirken bir hata oluştu.'
        });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin only)
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        await property.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('deleteProperty error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan silinirken bir hata oluştu.'
        });
    }
};

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
exports.searchProperties = async (req, res) => {
    try {
        const { type, status, city, minPrice, maxPrice } = req.query;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12));
        const skip = (page - 1) * limit;

        const query = { isPublished: true };

        if (type) {
            if (!VALID_TYPES.includes(type)) {
                return res.status(400).json({ success: false, message: 'Geçersiz emlak tipi' });
            }
            query.type = type;
        }
        if (status) {
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({ success: false, message: 'Geçersiz ilan durumu' });
            }
            query.status = status;
        }
        if (city) query['location.city'] = new RegExp(escapeRegex(city), 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                const min = Number(minPrice);
                if (isNaN(min)) {
                    return res.status(400).json({ success: false, message: 'Geçersiz minimum fiyat' });
                }
                query.price.$gte = min;
            }
            if (maxPrice) {
                const max = Number(maxPrice);
                if (isNaN(max)) {
                    return res.status(400).json({ success: false, message: 'Geçersiz maksimum fiyat' });
                }
                query.price.$lte = max;
            }
        }

        // Sort
        let sortObj = { createdAt: -1 };
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price_asc': sortObj = { price: 1 }; break;
                case 'price_desc': sortObj = { price: -1 }; break;
                case 'newest': sortObj = { createdAt: -1 }; break;
                case 'oldest': sortObj = { createdAt: 1 }; break;
                case 'most_viewed': sortObj = { views: -1 }; break;
            }
        }

        const total = await Property.countDocuments(query);
        const properties = await Property.find(query)
            .populate('owner', 'firstName lastName email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: properties
        });
    } catch (error) {
        console.error('searchProperties error:', error);
        res.status(500).json({
            success: false,
            message: 'Arama sırasında bir hata oluştu.'
        });
    }
};

// @desc    Get all properties for admin (including unpublished)
// @route   GET /api/properties/admin
// @access  Private (Admin only)
exports.getAdminProperties = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const total = await Property.countDocuments();
        const properties = await Property.find()
            .populate('owner', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: properties
        });
    } catch (error) {
        console.error('getAdminProperties error:', error);
        res.status(500).json({
            success: false,
            message: 'İlanlar yüklenirken bir hata oluştu.'
        });
    }
};
