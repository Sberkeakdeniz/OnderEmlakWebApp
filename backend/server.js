const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security: HTTP headers
app.use(helmet());

// Security: CORS configuration
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // In production, reject requests with no origin (prevents CSRF via curl/Postman)
        // In development, allow no-origin for tools like Postman
        if (!origin) {
            if (process.env.NODE_ENV === 'production') {
                return callback(new Error('CORS not allowed'), false);
            }
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'), false);
        }
    },
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Security: CSRF protection via custom header check
// Cross-origin requests with custom headers trigger CORS preflight (blocked by CORS policy)
app.use((req, res, next) => {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return next();
    }
    // Allow requests with no origin in development (e.g., Postman)
    if (process.env.NODE_ENV !== 'production' && !req.headers.origin) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Forbidden: missing CSRF header'
    });
});

// Security: Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 attempts per window
    message: {
        success: false,
        message: 'Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security: General API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window
    message: {
        success: false,
        message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply general rate limit to all API routes
app.use('/api', apiLimiter);

// Apply stricter rate limits
app.use('/api/auth/admin/login', authLimiter);
app.use('/api/auth/customer/login', authLimiter);
app.use('/api/auth/customer/register', authLimiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Onder Emlak API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Define PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
