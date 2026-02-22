const Property = require('../models/Property');
const Customer = require('../models/Customer');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalProperties,
            activeProperties,
            totalCustomers,
            viewsResult
        ] = await Promise.all([
            Property.countDocuments(),
            Property.countDocuments({ isPublished: true }),
            Customer.countDocuments(),
            Property.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }])
        ]);

        const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

        res.status(200).json({
            success: true,
            data: {
                totalProperties,
                activeProperties,
                totalCustomers,
                totalViews
            }
        });
    } catch (error) {
        console.error('getDashboardStats error:', error);
        res.status(500).json({
            success: false,
            message: 'İstatistikler yüklenirken bir hata oluştu.'
        });
    }
};
