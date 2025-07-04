// DOM Elements
const cartItems = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Constants
const SHIPPING_COST = 50.00;

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart page
function initCart() {
    loadCart();
    updateCartDisplay();
    setupEventListeners();
}

// Load cart data
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        updateSummary(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        // Handle image path correctly
        const imagePath = typeof item.image === 'object' ? (item.image.desktop || item.image.mobile) : item.image;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${imagePath}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateSummary(subtotal);
}

// Update summary totals
function updateSummary(subtotal) {
    const total = subtotal + SHIPPING_COST;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Setup event listeners
function setupEventListeners() {
    if (!cartItems) return;

    // Debug: Log when event listener is attached
    console.log('Cart event listener attached');

    // Robust event delegation for cart buttons
    cartItems.addEventListener('click', (e) => {
        console.log('Cart item clicked:', e.target);
        const button = e.target.closest('button');
        if (!button) {
            console.log('No button found for click');
            return;
        }

        const id = button.getAttribute('data-id');
        console.log('Button clicked:', button.className, 'ID:', id);
        if (button.classList.contains('minus')) {
            updateQuantity(id, false);
        } else if (button.classList.contains('plus')) {
            updateQuantity(id, true);
        } else if (button.classList.contains('remove-item')) {
            removeItem(id);
        }
    });

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before checkout.');
                return;
            }
            // Save cart data before redirecting
            localStorage.setItem('cart', JSON.stringify(cart));
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
    }
}

// Update item quantity
function updateQuantity(id, isPlus) {
    const itemIndex = cart.findIndex(item => String(item.id) === String(id));
    if (itemIndex === -1) return;

    if (isPlus) {
        cart[itemIndex].quantity++;
    } else {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            // If quantity would become 0, remove the item instead
            removeItem(id);
            return;
        }
    }

    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter(item => String(item.id) !== String(id));
    saveCart();
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart); 