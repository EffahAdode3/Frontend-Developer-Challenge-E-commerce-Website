// DOM Elements
const productImage = document.getElementById('product-image');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const quantityInput = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decrease-quantity');
const increaseBtn = document.getElementById('increase-quantity');
const addToCartBtn = document.getElementById('add-to-cart');

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!productId) {
        showError('Product not found');
        return;
    }
    
    await loadProductDetails();
    setupEventListeners();
    updateCartCount();
});

// Load product details
async function loadProductDetails() {
    try {
        const response = await fetch('/data/data.json');
        const data = await response.json();
        const product = data.find(p => p.id === parseInt(productId));
        
        if (!product) {
            showError('Product not found');
            return;
        }
        
        // Update page title
        document.title = `${product.name} - E-Commerce Store`;
        
        // Update product details
        productImage.src = product.image.desktop || product.image.mobile;
        productImage.alt = product.name;
        productName.textContent = product.name;
        productPrice.textContent = `$${product.price.toFixed(2)}`;
        productDescription.textContent = product.description;
        
    } catch (error) {
        console.error('Error loading product details:', error);
        showError('Error loading product details');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Quantity controls
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Add to cart
    addToCartBtn.addEventListener('click', addToCart);
}

// Add to cart functionality
function addToCart() {
    const quantity = parseInt(quantityInput.value);
    
    if (quantity < 1 || quantity > 99) {
        showError('Please select a valid quantity');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === parseInt(productId));
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: parseInt(productId),
            name: productName.textContent,
            price: parseFloat(productPrice.textContent.replace('$', '')),
            image: productImage.src,
            quantity: quantity
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

// Show error message
function showError(message) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="error-container">
            <p class="error">${message}</p>
            <a href="products.html" class="btn btn-primary">Back to Products</a>
        </div>
    `;
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