// DOM Elements
const checkoutForm = document.getElementById('checkout-form');
const orderItems = document.getElementById('order-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationItems = document.getElementById('confirmation-items');
const confirmationTotal = document.getElementById('confirmation-total');
const confirmOrderBtn = document.getElementById('confirm-order');
const closeModal = document.querySelector('.close-modal');

// Constants
const SHIPPING_COST = 50.00;

// Load cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize checkout page
function initCheckout() {
    displayOrderItems();
    updateOrderSummary();
    setupFormValidation();
    setupModalHandlers();
}

// Display order items in the summary
function displayOrderItems() {
    orderItems.innerHTML = cart.map(item => {
        // Fix: handle both object and string image formats
        const imagePath = typeof item.image === 'object' ? (item.image.desktop || item.image.mobile) : item.image;
        return `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${imagePath}" alt="${item.name}">
                </div>
                <div class="checkout-item-details">
                    <h3>${item.name}</h3>
                    <p class="checkout-item-price">$${item.price.toFixed(2)}</p>
                    <p class="checkout-item-quantity">Quantity: ${item.quantity}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Update order summary totals
function updateOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_COST;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Form validation setup
function setupFormValidation() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input, select');
    const paymentMethods = form.querySelectorAll('input[name="payment"]');

    // Add input event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // Add form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all inputs
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Validate payment method
        const paymentSelected = Array.from(paymentMethods).some(input => input.checked);
        if (!paymentSelected) {
            const paymentError = document.querySelector('.payment-methods + .error-message');
            paymentError.textContent = 'Please select a payment method';
            paymentError.classList.add('show');
            isValid = false;
        }

        if (isValid) {
            showConfirmationModal();
        }
    });
}

// Validate individual input
function validateInput(input) {
    const errorElement = input.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Remove error styling
    input.classList.remove('error');
    errorElement.classList.remove('show');

    // Required field validation
    if (input.required && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Postal code validation
    if (input.id === 'postal-code' && input.value) {
        const postalCodeRegex = /^\d{5}(-\d{4})?$/;
        if (!postalCodeRegex.test(input.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid postal code';
        }
    }

    // Show error if validation fails
    if (!isValid) {
        input.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    }

    return isValid;
}

// Show confirmation modal
function showConfirmationModal() {
    // Display items in confirmation modal
    confirmationItems.innerHTML = cart.map(item => `
        <div class="confirmation-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    // Update total in confirmation modal
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + SHIPPING_COST;
    confirmationTotal.textContent = `$${total.toFixed(2)}`;

    // Show modal
    confirmationModal.classList.add('show');
}

// Setup modal event handlers
function setupModalHandlers() {
    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        confirmationModal.classList.remove('show');
    });

    // Close modal when clicking outside
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.classList.remove('show');
        }
    });

    // Handle order confirmation
    confirmOrderBtn.addEventListener('click', () => {
        // Debug: Log form field values
        console.log('Name:', document.getElementById('name').value);
        console.log('Email:', document.getElementById('email').value);
        console.log('Address:', document.getElementById('address').value);
        console.log('City:', document.getElementById('city').value);
        console.log('Postal Code:', document.getElementById('postal-code').value);
        console.log('Country:', document.getElementById('country').value);
        console.log('Payment Method:', document.querySelector('input[name="payment"]:checked').value);
        console.log('Subtotal:', cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));

        // Save order data to localStorage before redirecting to confirmation page
        const orderData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value,
            country: document.getElementById('country').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        localStorage.setItem('orderData', JSON.stringify(orderData));
        // Debug: Log saved orderData
        console.log('Saved orderData:', orderData);
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    });
}

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', initCheckout); 