// Tab navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');

function switchTab(tabName) {
    // Scroll to top when switching
    window.scrollTo({ top: 0, behavior: 'smooth' });

    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));
    
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) targetButton.classList.add('active');
    
    const targetSection = document.getElementById(tabName);
    if (targetSection) targetSection.classList.add('active');
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        switchTab(targetTab);
    });
});

// Registration form validation patterns
const namePattern = /^[A-Z][a-z]{1,}$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phonePattern = /^09\d{9}$/;
const addressPattern = /^.{10,}$/;

// Form elements
const registerForm = document.getElementById('registerForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
const registerSuccess = document.getElementById('registerSuccess');
const registerError = document.getElementById('registerError');

let isRegistered = false;
let customerData = {};
let cart = [];

// Real-time validation helper
function validateInput(inputElement, pattern) {
    inputElement.addEventListener('keyup', (event) => {
        const isValid = pattern.test(event.target.value);
        inputElement.className = isValid ? 'accepted' : 'rejected';
    });
}

if(firstName) validateInput(firstName, namePattern);
if(lastName) validateInput(lastName, namePattern);
if(email) validateInput(email, emailPattern);
if(phone) validateInput(phone, phonePattern);
if(address) validateInput(address, addressPattern);

// Show register form
function showRegisterForm() {
    document.getElementById('orderContent').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

// Registration submission
if(registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const firstNameValid = namePattern.test(firstName.value);
        const lastNameValid = namePattern.test(lastName.value);
        const emailValid = emailPattern.test(email.value);
        const phoneValid = phonePattern.test(phone.value);
        const addressValid = addressPattern.test(address.value);

        if (firstNameValid && lastNameValid && emailValid && phoneValid && addressValid) {
            customerData = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                address: address.value
            };

            registerSuccess.style.display = 'block';
            registerError.style.display = 'none';
            registerForm.style.display = 'none';
            isRegistered = true;

            setTimeout(() => {
                document.getElementById('registerSection').style.display = 'none';
                document.getElementById('orderFormSection').style.display = 'block';
                
                document.getElementById('displayName').textContent = customerData.firstName + ' ' + customerData.lastName;
                document.getElementById('displayEmail').textContent = customerData.email;
                document.getElementById('displayPhone').textContent = customerData.phone;
                document.getElementById('displayAddress').textContent = customerData.address;
            }, 1500);
        } else {
            registerError.style.display = 'block';
            registerSuccess.style.display = 'none';
        }
    });
}

// Order Logic
const orderForm = document.getElementById('orderForm');
const orderItem = document.getElementById('orderItem');
const quantity = document.getElementById('quantity');
const totalPrice = document.getElementById('totalPrice');
const orderSuccess = document.getElementById('orderSuccess');

function updateTotalPrice() {
    if(!orderItem) return;
    const selectedOption = orderItem.options[orderItem.selectedIndex];
    const price = selectedOption.getAttribute('data-price');
    const qty = quantity.value;
    
    if (price && qty) {
        const total = price * qty;
        totalPrice.textContent = '₱' + total;
    } else {
        totalPrice.textContent = '₱0';
    }
}

if(orderItem) orderItem.addEventListener('change', updateTotalPrice);
if(quantity) quantity.addEventListener('input', updateTotalPrice);

function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <p class="cart-icon">🛒</p>
                <p>Your cart is empty</p>
            </div>
        `;
        cartSummary.style.display = 'none';
    } else {
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
                    <div style="display: flex; justify-content: space-between;">
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 0.3rem; color: var(--accent-gold);">${item.name}</h4>
                            <p style="font-size: 0.9rem;">Qty: ${item.quantity} × ₱${item.price}</p>
                            ${item.notes ? `<p style="font-size: 0.8rem; font-style: italic; opacity: 0.8;">Note: ${item.notes}</p>` : ''}
                        </div>
                        <div style="text-align: right;">
                            <strong>₱${itemTotal}</strong>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsDiv.innerHTML = cartHTML;
        document.getElementById('cartSubtotal').textContent = '₱' + subtotal;
        document.getElementById('cartGrandTotal').textContent = '₱' + (subtotal + 50);
        cartSummary.style.display = 'block';
    }
}

if(orderForm) {
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedOption = orderItem.options[orderItem.selectedIndex];
        if(!selectedOption.value) return;

        const itemName = selectedOption.value;
        const itemPrice = parseInt(selectedOption.getAttribute('data-price'));
        const itemQty = parseInt(quantity.value);
        const itemNotes = document.getElementById('notes').value;

        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: itemQty,
            notes: itemNotes
        });

        updateCart();
        orderSuccess.style.display = 'block';
        
        // Reset inputs but keep form visible
        quantity.value = 1;
        document.getElementById('notes').value = '';
        orderItem.selectedIndex = 0;
        updateTotalPrice();

        setTimeout(() => {
            orderSuccess.style.display = 'none';
        }, 3000);
    });
}