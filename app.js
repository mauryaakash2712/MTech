// MTech Frontend Application - Maurya Enterprises
// © 2025 Maurya Enterprises. All rights reserved.

console.log('MTech Electronics Store loaded!');
console.log('© 2025 Maurya Enterprises. All rights reserved.');

// Configuration
const CONFIG = {
    API_URL: 'http://localhost:3000/api',
    PRODUCTION_API: 'https://maurya.enterprises/api',
    USE_LOCAL_API: false // Change to false for production
};

// Get API URL based on environment
function getApiUrl() {
    return CONFIG.USE_LOCAL_API ? CONFIG.API_URL : CONFIG.PRODUCTION_API;
}

// Application state
let currentProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('mtech_cart')) || [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('MTech application initialized');
    initializeApp();
});

function initializeApp() {
    loadProducts();
    updateCartCount();
    showSection('home');
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update URL hash
    window.location.hash = sectionId;

    // Special handling for products section
    if (sectionId === 'products') {
        loadProducts();
    }
}

// Product Management
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    try {
        productsGrid.innerHTML = '<div class="loading">Loading products...</div>';

        const response = await fetch(`${getApiUrl()}/products`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        currentProducts = data.products || [];
        filteredProducts = [...currentProducts];

        renderProducts();

    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div class="error-message">
                <p>Unable to load products. Please check if the backend server is running.</p>
                <button class="btn btn-primary" onclick="loadProducts()">Retry</button>
            </div>
        `;
    }
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or browse all categories</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const discount = product.original_price ? 
        Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${discount > 0 ? `<div class="product-badge">${discount}% OFF</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <div class="stars">${createStarRating(product.rating)}</div>
                <span class="rating-count">(${product.reviews_count})</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">₹${product.price.toFixed(2)}</span>
                ${product.original_price ? `<span class="original-price">₹${product.original_price.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})" ${!product.in_stock ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

    return card;
}

function createStarRating(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push('<i class="fas fa-star"></i>');
    }

    if (hasHalfStar) {
        stars.push('<i class="fas fa-star-half-alt"></i>');
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push('<i class="far fa-star"></i>');
    }

    return stars.join('');
}

// Filter and Sort Functions
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : '';

    if (selectedCategory === '') {
        filteredProducts = [...currentProducts];
    } else {
        filteredProducts = currentProducts.filter(product => 
            product.category === selectedCategory
        );
    }

    renderProducts();
}

function sortProducts() {
    const sortFilter = document.getElementById('sortFilter');
    const sortBy = sortFilter ? sortFilter.value : 'name';

    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    renderProducts();
}

function clearFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) categoryFilter.value = '';
    if (sortFilter) sortFilter.value = 'name';

    filteredProducts = [...currentProducts];
    renderProducts();
}

// Shopping Cart Functions
function addToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product || !product.in_stock) return;

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index > -1) {
        const product = currentProducts.find(p => p.id === productId);
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        loadCartItems();
        showNotification(`${product.name} removed from cart`, 'info');
    }
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
            loadCartItems();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function saveCart() {
    localStorage.setItem('mtech_cart', JSON.stringify(cart));
}

function showCart() {
    loadCartItems();
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItemsContainer || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach(cartItem => {
        const product = currentProducts.find(p => p.id === cartItem.productId);
        if (!product) return;

        const itemTotal = product.price * cartItem.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border);">
                <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 0.5rem;">${product.name}</h4>
                    <p style="color: var(--text-light);">₹${product.price.toFixed(2)} each</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateCartQuantity(${product.id}, ${cartItem.quantity - 1})" 
                            style="background: var(--border); border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">-</button>
                    <span style="padding: 0 0.5rem;">${cartItem.quantity}</span>
                    <button onclick="updateCartQuantity(${product.id}, ${cartItem.quantity + 1})" 
                            style="background: var(--border); border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">+</button>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; margin-bottom: 0.5rem;">₹${itemTotal.toFixed(2)}</div>
                    <button onclick="removeFromCart(${product.id})" 
                            style="background: var(--accent); color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }

    const total = cart.reduce((sum, item) => {
        const product = currentProducts.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    alert(`Checkout functionality coming soon! Total: ₹${total.toFixed(2)}`);
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle URL hash navigation
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Initialize with hash if present
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        event.target.classList.remove('show');
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
    }
});

console.log('MTech Frontend Application loaded successfully!');
console.log('Ready for production deployment!');
