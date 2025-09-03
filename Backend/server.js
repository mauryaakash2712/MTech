const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mtech-secret-maurya-enterprises-2025';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for development
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://maurya.enterprises',
        'https://www.maurya.enterprises'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'mtech_store.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Initialize database tables
initializeDatabase();

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ');

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'MTech API',
        company: 'Maurya Enterprises',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        copyright: '© 2025 Maurya Enterprises. All rights reserved.'
    });
});

// Products API
app.get('/api/products', (req, res) => {
    const { category, search, sort, limit, offset } = req.query;
    let query = 'SELECT * FROM products WHERE in_stock = 1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    switch (sort) {
        case 'price-low':
            query += ' ORDER BY price ASC';
            break;
        case 'price-high':
            query += ' ORDER BY price DESC';
            break;
        case 'rating':
            query += ' ORDER BY rating DESC';
            break;
        case 'newest':
            query += ' ORDER BY created_at DESC';
            break;
        case 'name':
        default:
            query += ' ORDER BY name ASC';
    }

    if (limit) {
        query += ' LIMIT ?';
        params.push(parseInt(limit));

        if (offset) {
            query += ' OFFSET ?';
            params.push(parseInt(offset));
        }
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.json({
            products: rows,
            total: rows.length,
            message: 'Products retrieved successfully'
        });
    });
});

// Single product
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    db.get('SELECT * FROM products WHERE id = ? AND in_stock = 1', [productId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            product: row,
            message: 'Product retrieved successfully'
        });
    });
});

// Categories API
app.get('/api/categories', (req, res) => {
    const query = `
        SELECT 
            category,
            COUNT(*) as count,
            AVG(rating) as avg_rating,
            MIN(price) as min_price,
            MAX(price) as max_price
        FROM products 
        WHERE in_stock = 1 
        GROUP BY category
        ORDER BY count DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const categories = rows.map(row => ({
            id: row.category,
            name: formatCategoryName(row.category),
            count: row.count,
            avgRating: parseFloat(row.avg_rating || 0).toFixed(1),
            priceRange: {
                min: row.min_price,
                max: row.max_price
            }
        }));

        res.json({
            categories: categories,
            total: categories.length,
            message: 'Categories retrieved successfully'
        });
    });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET);
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, name, email }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        try {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Helper functions
function formatCategoryName(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            original_price DECIMAL(10,2),
            image TEXT,
            rating DECIMAL(3,2) DEFAULT 0,
            reviews_count INTEGER DEFAULT 0,
            description TEXT,
            specifications TEXT,
            in_stock BOOLEAN DEFAULT 1,
            stock_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert sample data
        insertSampleData();
    });
}

function insertSampleData() {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err || row.count > 0) return;

        const products = [
            [1, 'Arduino UNO R3 Original', 'arduino', 1844.00, 2000.00, 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300', 4.8, 342, 'The Arduino UNO R3 is a microcontroller board based on the ATmega328P. Perfect for learning electronics and programming.', '{}', 1, 156],
            [2, 'Raspberry Pi 4 Model B 8GB', 'raspberry-pi', 8500.00, null, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300', 4.9, 289, 'Latest Raspberry Pi 4 with 8GB RAM for advanced computing projects.', '{}', 1, 89],
            [3, 'ESP32 DevKit V1 WiFi + Bluetooth', 'development-boards', 650.00, null, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300', 4.7, 456, 'ESP32 development board with WiFi and Bluetooth capabilities.', '{}', 1, 245],
            [4, 'HC-SR04 Ultrasonic Sensor', 'sensors', 85.00, null, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', 4.6, 567, 'Ultrasonic distance sensor for Arduino projects.', '{}', 1, 389],
            [5, 'SG90 Micro Servo Motor', 'motors', 120.00, null, 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=300', 4.5, 234, '9g micro servo motor for robotics projects.', '{}', 1, 456],
            [6, 'DHT22 Temperature Sensor', 'sensors', 280.00, null, 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=300', 4.7, 312, 'High precision temperature and humidity sensor.', '{}', 1, 178]
        ];

        const stmt = db.prepare('INSERT INTO products (id, name, category, price, original_price, image, rating, reviews_count, description, specifications, in_stock, stock_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        products.forEach(product => stmt.run(product));
        stmt.finalize();

        console.log('✅ Sample data inserted');
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('MTech API Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        service: 'MTech API by Maurya Enterprises'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        service: 'MTech API by Maurya Enterprises'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MTech API Server running on port ${PORT}`);
    console.log('🏢 © 2025 Maurya Enterprises. All rights reserved.');
    console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
