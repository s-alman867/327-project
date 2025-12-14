document.addEventListener('DOMContentLoaded', function () {

    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('total-price');
    const paymentForm = document.getElementById('payment-form');
    const updateCartButton = document.getElementById('update-cart');

    let cart = [];

    function loadCartFromStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                cart = JSON.parse(storedCart);
            } catch (e) {
                console.error("Error parsing cart data:", e);
                cart = [];
            }
        } else {
            cart = [];
        }
    }

    function updateTotalPrice() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceElement.textContent = Math.round(total);
    }

    function renderCart() {
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            localStorage.removeItem('cart');
            updateTotalPrice();
            return;
        }

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');

            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="80" height="80">
                <div class="item-info">
                    <button class="delete-item" data-index="${index}">&times;</button>
                    <h4>${item.name}</h4>
                    <p>Price: ${item.price} BDT</p>
                    <div class="quantity-section">
                        <span>Qty: </span>
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
            `;

            cartContainer.appendChild(itemDiv);
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        attachEventListeners();
        updateTotalPrice();
    }

    function attachEventListeners() {
        cartContainer.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cart[index].quantity++;
                renderCart();
            });
        });

        cartContainer.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    renderCart();
                }
            });
        });

        cartContainer.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // Initial load
    loadCartFromStorage();
    renderCart();

    // ✅ Ensure cart stays on back navigation
    window.addEventListener('pageshow', function () {
        loadCartFromStorage();
        renderCart();
    });

    // ✅ Form submission to payment.php (without clearing cart)
    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const address = document.getElementById('address').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const city = document.getElementById('city').value.trim();
            const postal = document.getElementById('postal').value.trim();

            const required = [
                { id: 'name', value: name },
                { id: 'address', value: address },
                { id: 'phone', value: phone },
                { id: 'city', value: city },
                { id: 'postal', value: postal }
            ];

            let allFilled = true;
            let focusField = null;

            required.forEach(field => {
                const el = document.getElementById(field.id);
                if (!field.value) {
                    el.classList.add('error');
                    if (!focusField) focusField = el;
                    allFilled = false;
                } else {
                    el.classList.remove('error');
                }

                el.addEventListener('input', () => {
                    if (el.value.trim()) el.classList.remove('error');
                });
            });

            if (!allFilled) {
                focusField.focus();
                return;
            }

            const total = Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

            const actionURL = `http://localhost/payment.php?cart=${encodeURIComponent(JSON.stringify(cart))}&Total_amount=${total}&cus_name=${encodeURIComponent(name)}&cus_add1=${encodeURIComponent(address)}&cus_city=${encodeURIComponent(city)}&cus_phone=${encodeURIComponent(phone)}&cus_postal=${encodeURIComponent(postal)}`;

            // ✅ DON'T clear cart here!
            window.location.href = actionURL;
        });
    }

    if (updateCartButton) {
        updateCartButton.addEventListener('click', () => {
            alert("Cart successfully updated!");
        });
    }
});