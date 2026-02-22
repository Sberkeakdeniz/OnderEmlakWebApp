const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Property = require('../models/Property');

// Magic byte signatures for allowed image types
const MAGIC_BYTES = {
    jpeg: [Buffer.from([0xFF, 0xD8, 0xFF])],
    png: [Buffer.from([0x89, 0x50, 0x4E, 0x47])],
    webp: [Buffer.from('RIFF')], // RIFF header (WebP also has WEBP at offset 8)
};

function validateMagicBytes(filePath) {
    const buffer = Buffer.alloc(12);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    // Check JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
    // Check PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
    // Check WebP: RIFF....WEBP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true;
    // Check AVIF: ....ftypavif (ftyp at offset 4)
    if (buffer.toString('ascii', 4, 8) === 'ftyp') return true;

    return false;
}

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private (Admin only)
exports.uploadPropertyImages = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        // Validate magic bytes for each file
        for (const file of req.files) {
            if (!validateMagicBytes(file.path)) {
                // Clean up all uploaded files
                for (const f of req.files) {
                    try { fs.unlinkSync(f.path); } catch {}
                }
                return res.status(400).json({
                    success: false,
                    message: 'Invalid image file detected. File content does not match an allowed image format.'
                });
            }
        }

        const uploadPromises = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'properties',
                use_filename: false
            });

            // Clean up temp file after upload
            try { fs.unlinkSync(file.path); } catch {}

            return {
                url: result.secure_url,
                caption: ''
            };
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Add new images to property
        property.images.push(...uploadedImages);
        await property.save();

        res.status(200).json({
            success: true,
            data: property.images
        });
    } catch (error) {
        // Clean up temp files on error
        if (req.files) {
            for (const f of req.files) {
                try { fs.unlinkSync(f.path); } catch {}
            }
        }
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private (Admin only)
exports.deletePropertyImage = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        const imageIndex = property.images.findIndex(
            img => img._id.toString() === req.params.imageId
        );

        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Get image public ID from URL
        const publicId = property.images[imageIndex].url.split('/').pop().split('.')[0];

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(`properties/${publicId}`);

        // Remove from property
        property.images.splice(imageIndex, 1);
        await property.save();

        res.status(200).json({
            success: true,
            data: property.images
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
