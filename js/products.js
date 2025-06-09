// Global variables
let allProducts = [];
let currentProducts = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    setupEventListeners();
    updateCartCount();
    ensureCartButtonVisible();
});

// Load products from data.json
async function loadProducts() {
    try {
        const response = await fetch('/data/data.json');
        const data = await response.json();
        allProducts = data;
        currentProducts = [...allProducts];
        
        // Populate categories
        const categories = [...new Set(allProducts.map(product => product.category))];
        populateCategories(categories);
        
        // Display products
        displayProducts(currentProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<p class="error">Error loading products. Please try again later.</p>';
    }
}

// Populate category filter
function populateCategories(categories) {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    categoryFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', sortProducts);
}

// Filter products by category
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === '') {
        currentProducts = [...allProducts];
    } else {
        currentProducts = allProducts.filter(product => product.category === selectedCategory);
    }
    
    // Apply current sort
    const currentSort = sortFilter.value;
    if (currentSort !== 'default') {
        sortProducts();
    } else {
        displayProducts(currentProducts);
    }
}

// Sort products
function sortProducts() {
    const sortValue = sortFilter.value;
    
    switch (sortValue) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            currentProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Reset to original order
            currentProducts = [...allProducts];
            if (categoryFilter.value !== '') {
                currentProducts = currentProducts.filter(product => 
                    product.category === categoryFilter.value
                );
            }
    }
    
    displayProducts(currentProducts);
}

// Display products in the grid
function displayProducts(products) {
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Use desktop image by default, fallback to mobile if not available
    const imagePath = product.image.desktop || product.image.mobile;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imagePath}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener for Add to Cart button
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(product));
    
    return card;
}

// Cart functionality
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart!');
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Ensure cart button is always visible and clickable on mobile
function ensureCartButtonVisible() {
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.style.display = 'flex';
        cartButton.style.position = 'fixed';
        cartButton.style.bottom = '20px';
        cartButton.style.right = '20px';
        cartButton.style.zIndex = '1000';
        cartButton.style.backgroundColor = 'var(--primary-color)';
        cartButton.style.color = 'white';
        cartButton.style.padding = '10px 15px';
        cartButton.style.borderRadius = '50%';
        cartButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    }
} 