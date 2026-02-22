const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty,
    searchProperties,
    getAdminProperties
} = require('../controllers/propertyController');

const {
    uploadPropertyImages,
    deletePropertyImage
} = require('../controllers/imageController');

const {
    validateCreateProperty,
    validateUpdateProperty,
    validateObjectId
} = require('../middleware/validate');

// Public routes
router.get('/', getProperties);
router.get('/search', searchProperties);

// Admin routes (must be before /:id to avoid route conflicts)
router.get('/admin', protect, authorize('admin'), getAdminProperties);

router.get('/:id', validateObjectId(), getProperty);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), validateCreateProperty, createProperty);
router.put('/:id', protect, authorize('admin'), validateUpdateProperty, updateProperty);
router.delete('/:id', protect, authorize('admin'), validateObjectId(), deleteProperty);

// Image routes
router.post(
    '/:id/images',
    protect,
    authorize('admin'),
    validateObjectId(),
    upload.array('images', 5),
    uploadPropertyImages
);
router.delete(
    '/:id/images/:imageId',
    protect,
    authorize('admin'),
    validateObjectId(),
    deletePropertyImage
);

module.exports = router;
