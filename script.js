document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
const paymentSuccess = urlParams.get('payment');

if (paymentSuccess === 'success') {
    console.log("Payment success detected via URL, clearing cart.");

    // Clear cart
    localStorage.removeItem('cart');

    // Optionally remove query param from URL to prevent it firing again on refresh
    const url = new URL(window.location);
    url.searchParams.delete('payment');
    window.history.replaceState({}, document.title, url.toString());
}


    let closer = document.querySelector('#closer');
    let navbar = document.querySelector('.navbar');
    let cartContainer = document.querySelector('.shopping-cart');
    let cartBtn = document.querySelector('#cart-btn');
    let closeCartBtn = document.querySelector('#close-cart'); // Ensure this ID exists in HTML

    // Checkout
    document.getElementById("proceed-to-payment").addEventListener("click", function (e) {
        e.preventDefault(); // prevent default <a> behavior
    
        if (cart.length > 0) {
            const cartData = encodeURIComponent(JSON.stringify(cart));
            window.location.href = `checkout.html?cart=${cartData}`;
        } else {
            alert("Your cart is empty!");
        }
    });

    // Toggle Navbar
    document.querySelector('#menu-btn').onclick = () => {
        closer.style.display = "block";
        navbar.classList.toggle('active');
        cartContainer.classList.remove('active'); // Close cart if navbar is toggled
        closer.style.display = navbar.classList.contains('active') ? 'block' : 'none';
    }

    // Toggle Cart
    cartBtn.onclick = () => {
        closer.style.display = "block";
        cartContainer.classList.toggle('active');
        navbar.classList.remove('active'); // Close navbar if cart is toggled
        closer.style.display = cartContainer.classList.contains('active') ? 'none' : 'block';
    }

    // Close Navbar and Cart when clicking the overlay (closer)
    closer.onclick = () => {
        closer.style.display = 'none';
        navbar.classList.remove('active');
        cartContainer.classList.remove('active');
    }

    // Close Cart with cross button functionality
    if (closeCartBtn) {
        closeCartBtn.onclick = function() {
            cartContainer.classList.remove('active');
            closer.style.display = 'none'; 
        }
    }

    // Initialize cart from localStorage if it exists
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Render the cart dynamically
    function renderCart() {
        const cartContainer = document.getElementById('cart-items-container');
        cartContainer.innerHTML = ''; // Clear current cart
    
        let totalPrice = 0;
    
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
    
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = ` 
                <img src="${item.image}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                    <span class="price">Price: ${item.price}</span>
                    <div class="quantity-container">
                        <span class="qnt-label">Qty:</span>
                        <input type="number" value="${item.quantity}" class="quantity" data-id="${item.id}" min="1">
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="ri-close-line"></i>
                </button> 
            `;
            cartContainer.appendChild(cartItem);
        });
    
        document.getElementById('total-price').innerText = totalPrice;

        // Save the cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartItemCount(); // Update the cart item count
    }

    // Event delegation for remove button (works for dynamically added items)
    document.getElementById('cart-items-container').addEventListener('click', function (e) {
        if (e.target.closest('.remove-item')) {
            const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Remove item from cart
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        renderCart(); // Re-render the cart to update UI after removal
    }

    // Update item quantity
    function updateQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const quantity = parseInt(e.target.value);

        if (quantity < 1) {
            e.target.value = 1;
            return;
        }

        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity = quantity;
            renderCart();
        }
    }

    // Clear all items in cart
    function clearAll() {
        cart = [];
        renderCart();
    }

    // Update cart
    function updateCart() {
        alert('Cart Updated Successfully!');
        renderCart();
    }

    // Event listeners for buttons
    document.getElementById('clear-all').addEventListener('click', clearAll);
    document.getElementById('update-cart').addEventListener('click', updateCart);

    // Add to cart from shop dynamically (you would need these buttons in your HTML)
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image'); // Make sure data-image exists in HTML

            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            renderCart();
        });
    });

    // Add scrollbar to cart container
    const cartContainerElement = document.getElementById('cart-items-container');
    cartContainerElement.style.maxHeight = '400px'; 
    cartContainerElement.style.overflowY = 'auto';
    cartContainerElement.style.overflowX = 'hidden'; 

    // Attach event listener for updating quantity (delegation)
    document.getElementById('cart-items-container').addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity')) {
            updateQuantity(e);
        }
    });

    // Function to update cart item count
    function updateCartItemCount() {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total number of items
        const cartItemCount = document.querySelector('#cart-btn .item-count'); // Make sure this element exists
        if (cartItemCount) {
            cartItemCount.textContent = itemCount > 0 ? itemCount : ''; // Show count if more than 0
        }
    }

    // Initial cart render
    renderCart();
});

// Slider functionality remains the same
let slides = document.querySelectorAll(".slide"); //home slider part
let currentIndex = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
    slide.classList.remove("active");
    slide.style.display = i === index ? "flex" : "none"; 
    });
}

function next() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

function prev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
}

// Index
showSlide(currentIndex);

document.querySelector(".next-btn").addEventListener("click", next);
document.querySelector(".prev-btn").addEventListener("click", prev);