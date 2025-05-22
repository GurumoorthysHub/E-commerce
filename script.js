let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateCartDisplay();
    setupSignupForm();
});

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const products = document.querySelectorAll('.product');
    const productList = document.getElementById('product-list');
    let productsFound = 0;
    let noResultsMessage = productList.querySelector('.no-results');

    // Remove existing no-results message before new search
    if (noResultsMessage) {
        noResultsMessage.remove();
    }

    products.forEach(product => {
        const productName = product.dataset.name.toLowerCase();
        const productCategory = product.dataset.category.toLowerCase();
        
        if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            product.style.display = 'flex'; // Use flex as products are flex items
            productsFound++;
        } else {
            product.style.display = 'none';
        }
    });

    if (productsFound === 0 && searchTerm) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'no-results';
        noResultsMessage.textContent = 'No products found matching your search criteria.';
        productList.appendChild(noResultsMessage);
    }
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1, image });
    }
    updateCartDisplay();
    saveCartToLocalStorage();
    
    // Simple notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${name} added to cart!`;
    document.body.appendChild(notification);
    
    // Style for notification (could be in CSS, but quick here)
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1001';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    setTimeout(() => {
        notification.remove();
    }, 2500);
}

function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
    saveCartToLocalStorage();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    // Ensure we don't add multiple empty messages
    let emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message');
    if(emptyCartMessage) emptyCartMessage.remove();


    cartItemsContainer.innerHTML = ''; // Clear current items

    if (cart.length === 0) {
        const p = document.createElement('p');
        p.className = 'empty-cart-message';
        p.textContent = 'Your cart is currently empty.';
        cartItemsContainer.appendChild(p);
        checkoutBtn.style.display = 'none';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p class="item-name">${item.name}</p>
                        <p>$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
        checkoutBtn.style.display = 'inline-block';
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.textContent = total.toFixed(2);
    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    const signupMessageEl = document.getElementById('signup-message');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const farmerName = document.getElementById('farmer-name').value;
        const farmerEmail = document.getElementById('farmer-email').value;
        const landMeasurements = document.getElementById('land-measurements').value;
        const soilType = document.getElementById('soil-type').value;
        const mainCrops = document.getElementById('main-crops').value;

        console.log('Farmer Signup Data:', {
            name: farmerName,
            email: farmerEmail,
            land: landMeasurements,
            soil: soilType,
            crops: mainCrops
        });
        
        signupMessageEl.textContent = `Thank you for registering, ${farmerName}! We've received your details.`;
        signupMessageEl.className = 'success-message'; // ensure correct class
        signupMessageEl.style.display = 'block';
        signupForm.reset(); 

        setTimeout(() => {
            signupMessageEl.style.display = 'none';
        }, 5000);
    });
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }
    const totalAmount = document.getElementById('total-price').textContent;
    alert(`Order Placed! Your total is $${totalAmount}. You will receive a confirmation email shortly. Thank you for shopping with AgriFarm!`);
    cart = []; 
    updateCartDisplay();
    saveCartToLocalStorage(); 
}

function saveCartToLocalStorage() {
    localStorage.setItem('agriFarmCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('agriFarmCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}
