const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Property description is required']
    },
    type: {
        type: String,
        required: [true, 'Property type is required'],
        enum: ['apartment', 'house', 'villa', 'office', 'land']
    },
    status: {
        type: String,
        required: [true, 'Property status is required'],
        enum: ['for-sale', 'for-rent', 'sold', 'rented']
    },
    price: {
        type: Number,
        required: [true, 'Property price is required']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Property address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    features: {
        bedrooms: {
            type: Number,
            required: function() {
                return ['apartment', 'house', 'villa'].includes(this.type);
            }
        },
        bathrooms: {
            type: Number,
            required: function() {
                return ['apartment', 'house', 'villa'].includes(this.type);
            }
        },
        area: {
            type: Number,
            required: [true, 'Property area is required']
        },
        parking: {
            type: Boolean,
            default: false
        },
        furnished: {
            type: Boolean,
            default: false
        }
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        caption: String
    }],
    amenities: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    sahibindenUrl: {
        type: String,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add index for search functionality
propertySchema.index({
    title: 'text',
    description: 'text',
    'location.address': 'text',
    'location.city': 'text'
});

// Add indexes for frequently queried fields
propertySchema.index({ isPublished: 1, createdAt: -1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ price: 1 });

module.exports = mongoose.model('Property', propertySchema); 