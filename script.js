let cart = [];
let totalPrice = 0;

function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    totalPrice += productPrice;
    renderCart();
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is currently empty.</p>';
    } else {
        cartItemsDiv.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsDiv.appendChild(cartItem);
        });
    }

    totalPriceSpan.textContent = totalPrice.toFixed(2);
}

function removeFromCart(index) {
    totalPrice -= cart[index].price;
    cart.splice(index, 1);
    renderCart();
}

function searchProducts() {
    const searchBar = document.getElementById('search-input');
    const searchText = searchBar.value.toLowerCase();
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchText)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Handle Signup Form Submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('farmer-name').value;
    const landMeasurements = document.getElementById('land-measurements').value;
    const soilType = document.getElementById('soil-type').value;
    
    console.log('Farmer Signup Details:', { name, landMeasurements, soilType });
    alert('Signup successful!');
});
