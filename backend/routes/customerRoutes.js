const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getCustomers,
    getCustomer,
    deleteCustomer,
    getFavorites,
    addFavorite,
    removeFavorite
} = require('../controllers/customerController');
const { validateObjectId } = require('../middleware/validate');

// Customer self-service routes (must be before /:id)
router.get('/me/favorites', protect, authorize('customer'), getFavorites);
router.post('/me/favorites/:propertyId', protect, authorize('customer'), addFavorite);
router.delete('/me/favorites/:propertyId', protect, authorize('customer'), removeFavorite);

// Admin routes
router.get('/', protect, authorize('admin'), getCustomers);
router.get('/:id', protect, authorize('admin'), validateObjectId(), getCustomer);
router.delete('/:id', protect, authorize('admin'), validateObjectId(), deleteCustomer);

module.exports = router;
