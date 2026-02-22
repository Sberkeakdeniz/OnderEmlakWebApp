const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// Multer config with randomized filenames
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const randomName = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${randomName}${ext}`);
    }
});

// File filter: check both mimetype and extension
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!file.mimetype.startsWith('image')) {
        return cb(new Error('Not an image! Please upload only images.'), false);
    }

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(new Error(`File extension not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
    }

    cb(null, true);
};

// Export multer config
module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});
