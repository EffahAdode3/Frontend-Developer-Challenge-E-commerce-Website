// DOM Elements
const orderNumber = document.getElementById('order-number');
const orderDate = document.getElementById('order-date');
const orderTotal = document.getElementById('order-total');
const paymentMethod = document.getElementById('payment-method');
const orderItems = document.getElementById('order-items');
const subtotal = document.getElementById('subtotal');
const shipping = document.getElementById('shipping');
const total = document.getElementById('total');
const shippingName = document.getElementById('shipping-name');
const shippingAddress = document.getElementById('shipping-address');
const shippingCity = document.getElementById('shipping-city');
const shippingPostal = document.getElementById('shipping-postal');
const shippingCountry = document.getElementById('shipping-country');

// Constants
const SHIPPING_COST = 50.00;

// Initialize confirmation page
function initConfirmation() {
    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!orderData || !cart.length) {
        // Redirect to home if no order data
        window.location.href = 'index.html';
        return;
    }

    // Display order information
    displayOrderInfo(orderData);
    displayOrderItems(cart);
    displayShippingInfo(orderData);

    // Clear cart and order data
    localStorage.removeItem('cart');
    localStorage.removeItem('orderData');
}

// Display order information
function displayOrderInfo(orderData) {
    // Generate random order number
    const randomOrderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    orderNumber.textContent = randomOrderNumber;

    // Format current date
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    orderDate.textContent = now.toLocaleDateString('en-US', options);

    // Calculate and display totals
    const subtotalAmount = orderData.subtotal;
    const totalAmount = subtotalAmount + SHIPPING_COST;

    subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    shipping.textContent = `$${SHIPPING_COST.toFixed(2)}`;
    total.textContent = `$${totalAmount.toFixed(2)}`;
    orderTotal.textContent = `$${totalAmount.toFixed(2)}`;

    // Display payment method
    paymentMethod.textContent = orderData.paymentMethod;
}

// Display order items
function displayOrderItems(cart) {
    orderItems.innerHTML = cart.map(item => `
        <div class="confirmation-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

// Display shipping information
function displayShippingInfo(orderData) {
    shippingName.textContent = orderData.name;
    shippingAddress.textContent = orderData.address;
    shippingCity.textContent = orderData.city;
    shippingPostal.textContent = orderData.postalCode;
    shippingCountry.textContent = orderData.country;
}

// Initialize confirmation page when DOM is loaded
document.addEventListener('DOMContentLoaded', initConfirmation); 