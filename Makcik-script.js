const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');

function switchTab(tabName) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(section => {
        section.classList.remove('active');
        section.classList.remove('animate__animated', 'animate__fadeIn');
    });
    
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
        targetSection.classList.add('active', 'animate__animated', 'animate__fadeIn');
    }
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        switchTab(targetTab);
    });
});

const namePattern = /^[A-Z][a-z]{1,}$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phonePattern = /^09\d{9}$/;
const addressPattern = /^.{10,}$/;

const registerForm = document.getElementById('registerForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
const registerSuccess = document.getElementById('registerSuccess');
const registerError = document.getElementById('registerError');

let customerData = {};
let cart = [];

function validateField(field, pattern) {
    field.addEventListener('keyup', () => {
        const isValid = pattern.test(field.value);
        field.className = isValid ? 'accepted' : 'rejected';
    });
}

if (firstName) validateField(firstName, namePattern);
if (lastName) validateField(lastName, namePattern);
if (email) validateField(email, emailPattern);
if (phone) validateField(phone, phonePattern);
if (address) validateField(address, addressPattern);

function showRegisterForm() {
    document.getElementById('orderContent').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

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

            setTimeout(() => {
                document.getElementById('registerSection').style.display = 'none';
                const orderFormSection = document.getElementById('orderFormSection');
                orderFormSection.style.display = 'block';
                orderFormSection.classList.add('animate__animated', 'animate__fadeInUp');
                
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

const orderForm = document.getElementById('orderForm');
const orderItem = document.getElementById('orderItem');
const quantity = document.getElementById('quantity');
const totalPrice = document.getElementById('totalPrice');
const orderSuccess = document.getElementById('orderSuccess');
const orderType = document.getElementById('orderType');

function updateTotalPrice() {
    if (!orderItem) return;
    
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

if (orderItem) orderItem.addEventListener('change', updateTotalPrice);
if (quantity) quantity.addEventListener('input', updateTotalPrice);

function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const deliveryFeeSpan = document.getElementById('deliveryFee');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.5;"><p style="font-size:3rem;">🛒</p><p>Your cart is empty</p></div>';
        cartSummary.style.display = 'none';
    } else {
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} × ₱${item.price} = ₱${itemTotal}</p>
                    ${item.notes ? `<p style="font-size:0.85rem; opacity:0.8; font-style:italic;">Note: ${item.notes}</p>` : ''}
                </div>
            `;
        });
        
        cartItemsDiv.innerHTML = cartHTML;
        
        const deliveryFee = orderType.value === 'pickup' ? 0 : 50;
        deliveryFeeSpan.textContent = '₱' + deliveryFee;
        
        document.getElementById('cartSubtotal').textContent = '₱' + subtotal;
        document.getElementById('cartGrandTotal').textContent = '₱' + (subtotal + deliveryFee);
        cartSummary.style.display = 'block';
    }
}

if (orderType) {
    orderType.addEventListener('change', updateCart);
}

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedOption = orderItem.options[orderItem.selectedIndex];
        if (!selectedOption.value) return;

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
        orderSuccess.classList.add('animate__animated', 'animate__fadeIn');
        
        quantity.value = 1;
        document.getElementById('notes').value = '';
        orderItem.selectedIndex = 0;
        updateTotalPrice();

        setTimeout(() => {
            orderSuccess.style.display = 'none';
            orderSuccess.classList.remove('animate__animated', 'animate__fadeIn');
        }, 2000);
    });
}

function finalizeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before finalizing.');
        return;
    }
    
    document.getElementById('confirmModal').style.display = 'block';
    document.querySelector('.modal-content').classList.add('animate__animated', 'animate__zoomIn');
}

function confirmOrder() {
    const orderTypeValue = orderType.value === 'pickup' ? 'Pickup' : 'Delivery';
    const deliveryFee = orderType.value === 'pickup' ? 0 : 50;
    
    let orderDetails = `
=== ORDER CONFIRMATION ===

Customer: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Phone: ${customerData.phone}
Address: ${customerData.address}
Order Type: ${orderTypeValue}

ITEMS ORDERED:
`;
    
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        orderDetails += `${index + 1}. ${item.name} - Qty: ${item.quantity} - ₱${itemTotal}\n`;
        if (item.notes) {
            orderDetails += `   Note: ${item.notes}\n`;
        }
    });
    
    orderDetails += `
Subtotal: ₱${subtotal}
Delivery Fee: ₱${deliveryFee}
GRAND TOTAL: ₱${subtotal + deliveryFee}

Order sent to restaurant for processing!
`;
    
    alert(orderDetails);
    
    cart = [];
    updateCart();
    
    closeModal();
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
}
