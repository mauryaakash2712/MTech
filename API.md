# 📡 MTech API Documentation

Complete API documentation for MTech Electronics Store by Maurya Enterprises.

## 🔗 Base URL
- **Production**: `https://mtech-api.herokuapp.com/api`
- **Development**: `http://localhost:3000/api`

## 🔐 Authentication
Some endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🌟 API Endpoints

### 🏥 Health Check

#### GET `/health`
Check API server status and information.

**Response:**
```json
{
  "status": "OK",
  "service": "MTech API",
  "company": "Maurya Enterprises",
  "version": "1.0.0",
  "timestamp": "2025-09-01T17:30:00.000Z",
  "copyright": "© 2025 Maurya Enterprises. All rights reserved."
}
```

---

### 🛍️ Products

#### GET `/products`
Retrieve all products with optional filtering and pagination.

**Query Parameters:**
- `category` (string): Filter by product category
- `search` (string): Search in product name and description
- `sort` (string): Sort order (`name`, `price-low`, `price-high`, `rating`)
- `limit` (number): Number of products per page
- `offset` (number): Number of products to skip

**Example Request:**
```bash
GET /api/products?category=arduino&sort=price-low&limit=10&offset=0
```

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Arduino UNO R3 Original",
      "category": "arduino",
      "price": 1844.00,
      "original_price": 2000.00,
      "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300",
      "rating": 4.8,
      "reviews_count": 342,
      "description": "The Arduino UNO R3 is a microcontroller board...",
      "in_stock": 1,
      "stock_count": 156,
      "created_at": "2025-09-01T12:00:00.000Z"
    }
  ],
  "total": 1,
  "message": "Products retrieved successfully"
}
```

#### GET `/products/:id`
Get detailed information about a specific product.

**Parameters:**
- `id` (number): Product ID

**Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Arduino UNO R3 Original",
    "category": "arduino",
    "price": 1844.00,
    "original_price": 2000.00,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300",
    "rating": 4.8,
    "reviews_count": 342,
    "description": "The Arduino UNO R3 is a microcontroller board based on the ATmega328P. Perfect for learning electronics and programming.",
    "in_stock": 1,
    "stock_count": 156,
    "created_at": "2025-09-01T12:00:00.000Z"
  }
}
```

---

### 🏷️ Categories

#### GET `/categories`
Get all product categories with product counts.

**Response:**
```json
{
  "categories": [
    {
      "id": "arduino",
      "name": "Arduino",
      "count": 45
    },
    {
      "id": "raspberry-pi",
      "name": "Raspberry Pi",
      "count": 23
    },
    {
      "id": "sensors",
      "name": "Sensors",
      "count": 89
    }
  ]
}
```

---

### 👤 Authentication (Future Implementation)

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/auth/login`
Login with existing user credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/auth/profile` 🔐
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-09-01T10:00:00.000Z"
  }
}
```

---

### 🛒 Shopping Cart (Future Implementation)

#### GET `/cart` 🔐
Get current user's cart items.

**Response:**
```json
{
  "cartItems": [
    {
      "id": 1,
      "user_id": 1,
      "product_id": 1,
      "quantity": 2,
      "name": "Arduino UNO R3 Original",
      "price": 1844.00,
      "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300",
      "in_stock": 1,
      "added_at": "2025-09-01T15:30:00.000Z"
    }
  ]
}
```

#### POST `/cart` 🔐
Add item to cart.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "Item added to cart"
}
```

#### PUT `/cart/:itemId` 🔐
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "message": "Cart item updated"
}
```

#### DELETE `/cart/:itemId` 🔐
Remove item from cart.

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

---

### 📦 Orders (Future Implementation)

#### GET `/orders` 🔐
Get user's order history.

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "user_id": 1,
      "total_amount": 3688.00,
      "status": "delivered",
      "shipping_address": "123 Main St, Delhi, India",
      "payment_method": "razorpay",
      "items": "Arduino UNO R3 x2, ESP32 DevKit x1",
      "created_at": "2025-08-25T10:00:00.000Z"
    }
  ]
}
```

#### POST `/orders` 🔐
Create a new order from cart items.

**Request Body:**
```json
{
  "shippingAddress": "123 Main St, Delhi, India",
  "paymentMethod": "razorpay"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "orderId": 1,
  "totalAmount": 3688.00
}
```

---

### ⭐ Reviews (Future Implementation)

#### GET `/products/:id/reviews`
Get reviews for a specific product.

**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "product_id": 1,
      "user_id": 1,
      "rating": 5,
      "comment": "Excellent product! Works perfectly for my projects.",
      "user_name": "John Doe",
      "created_at": "2025-08-20T14:30:00.000Z"
    }
  ]
}
```

#### POST `/products/:id/reviews` 🔐
Add a review for a product.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent product! Works perfectly for my projects."
}
```

**Response:**
```json
{
  "message": "Review added successfully"
}
```

---

## 🚨 Error Responses

The API uses conventional HTTP status codes to indicate success or failure:

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request parameters
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `409` - Conflict: Resource already exists
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

**Error Response Format:**
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": "Additional error details if available"
}
```

**Example Error:**
```json
{
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Sensitive operations**: 10 requests per minute per IP

When rate limit is exceeded:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## 📝 Data Formats

### Dates
All dates are returned in ISO 8601 format in UTC:
```json
"created_at": "2025-09-01T12:00:00.000Z"
```

### Prices
All prices are in Indian Rupees (INR) with 2 decimal places:
```json
"price": 1844.00
```

### Boolean Values
Boolean values are represented as integers:
- `1` = true
- `0` = false

---

## 🧪 Testing

### Using cURL

**Get all products:**
```bash
curl -X GET "https://mtech-api.herokuapp.com/api/products"
```

**Get products by category:**
```bash
curl -X GET "https://mtech-api.herokuapp.com/api/products?category=arduino"
```

**Get single product:**
```bash
curl -X GET "https://mtech-api.herokuapp.com/api/products/1"
```

**Health check:**
```bash
curl -X GET "https://mtech-api.herokuapp.com/api/health"
```

### Using JavaScript

```javascript
// Fetch all products
fetch('https://mtech-api.herokuapp.com/api/products')
  .then(response => response.json())
  .then(data => console.log(data.products));

// Search products
fetch('https://mtech-api.herokuapp.com/api/products?search=arduino')
  .then(response => response.json())
  .then(data => console.log(data.products));
```

---

## 📚 SDK and Libraries

### JavaScript/Node.js Example
```javascript
class MtechAPI {
  constructor(baseURL = 'https://mtech-api.herokuapp.com/api') {
    this.baseURL = baseURL;
  }

  async getProducts(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/products?${queryString}`);
    return response.json();
  }

  async getProduct(id) {
    const response = await fetch(`${this.baseURL}/products/${id}`);
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${this.baseURL}/categories`);
    return response.json();
  }
}

// Usage
const api = new MtechAPI();
const products = await api.getProducts({ category: 'arduino', limit: 10 });
```

---

## 🔄 API Versioning

Current API version: **v1**

Future versions will be accessible via:
- `https://mtech-api.herokuapp.com/api/v2/products`
- Version specified in headers: `API-Version: v2`

---

## 📞 Support

For API support and questions:
- **Email**: api-support@mtech.com
- **Documentation Issues**: Create an issue on GitHub
- **Rate Limit Increases**: Contact api-support@mtech.com

---

## 📋 Changelog

### v1.0.0 (2025-09-01)
- Initial API release
- Products and categories endpoints
- Health check endpoint
- Rate limiting implementation
- Basic error handling

### Planned Features
- User authentication system
- Shopping cart API
- Order management
- Review system
- Payment integration
- Admin panel API
- Webhooks support

---

**© 2025 Maurya Enterprises. All rights reserved.**

**MTech API Documentation - Built for developers, by developers.**
