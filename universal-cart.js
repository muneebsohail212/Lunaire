// ==================== UNIVERSAL CART & NAVIGATION SYSTEM ==================== //

// Global cart items array - persists across all pages
let cartItems = [];

// Initialize cart on page load for ALL pages
function initializeCartSystem() {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = savedCart;
    
    // Update cart count on current page
    updateCartCount();
    
    // Add navigation event listeners
    addNavigationListeners();
}

// Update cart count display
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.fa-shopping-bag + span, #cartCount');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems.toString();
        }
    });
}

// Add navigation event listeners to header icons
function addNavigationListeners() {
    // USER/ACCOUNT ICON - goes to login page
    const userIcons = document.querySelectorAll('.fa-user');
    userIcons.forEach(icon => {
        const userButton = icon.closest('button, a');
        if (userButton && !userButton.hasAttribute('data-nav-added')) {
            userButton.setAttribute('data-nav-added', 'true');
            userButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('User icon clicked - redirecting to login');
                window.location.href = 'login.html';
            });
        }
    });

    // SHOPPING BAG ICON - goes to basket page
    const bagIcons = document.querySelectorAll('.fa-shopping-bag');
    bagIcons.forEach(icon => {
        const bagButton = icon.closest('button, a');
        if (bagButton && !bagButton.hasAttribute('data-nav-added')) {
            bagButton.setAttribute('data-nav-added', 'true');
            bagButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Bag icon clicked - redirecting to basket');
                
                // Save current cart state
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                
                // Redirect to basket
                window.location.href = 'basket.html';
            });
        }
    });
}

// Save item to cart (use this for any add to cart functionality)
function addToCart(item) {
    // Check if item already exists
    const existingItemIndex = cartItems.findIndex(cartItem => 
        cartItem.name === item.name && cartItem.size === item.size
    );
    
    if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item
        cartItems.push(item);
    }
    
    // Save to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
    // Update count display
    updateCartCount();
    
    console.log('Item added to cart:', item);
    console.log('Total cart items:', cartItems);
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cartItems.length) {
        cartItems.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCartCount();
    }
}

// Clear entire cart
function clearCart() {
    cartItems = [];
    localStorage.removeItem("cartItems");
    updateCartCount();
}

// ==================== PAGE-SPECIFIC FUNCTIONALITY ==================== //

// For product pages with Add to Cart buttons
function initializeProductPage() {
    const addToCartButtons = document.querySelectorAll('.product-card button, #addToCartBtn');
    
    addToCartButtons.forEach(button => {
        if (!button.hasAttribute('data-cart-added')) {
            button.setAttribute('data-cart-added', 'true');
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get product info (adjust selectors based on your HTML structure)
                let productName, productPrice, productImg;
                
                // For product grid cards
             if (button.closest('.product-card')) {
    // Case 1: Shop / grid page
    const productCard = button.closest('.product-card');
    productName = productCard.querySelector('h3')?.innerText || "Unnamed Product";
    const productPriceText = productCard.querySelector('p')?.innerText || "0";
    productImg = productCard.querySelector('img')?.src || "";

    const cleanPrice = productPriceText
        .replace(/Rs\./gi, "")
        .replace(/Rs/gi, "")
        .replace(/PKR/gi, "")
        .replace(/,/g, "")
        .trim();
    productPrice = parseFloat(cleanPrice) || 0;

} else {
    // Case 2: Product detail page
    productName = document.querySelector('h2')?.innerText || "Product";
    const detailPriceEl = document.querySelector(".text-xl.text-gray-600.mb-6");
    const productPriceText = detailPriceEl ? detailPriceEl.innerText : "0";
    productImg = document.querySelector('#productImage')?.src || "";

    const cleanPrice = productPriceText
        .replace(/Rs\./gi, "")
        .replace(/Rs/gi, "")
        .replace(/PKR/gi, "")
        .replace(/,/g, "")
        .trim();
    productPrice = parseFloat(cleanPrice) || 0;
}

                
                const quantity = parseInt(document.querySelector('#quantityInput')?.value || 1);
                
                const item = {
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    size: "WS-25", // Default size, can be made dynamic
                    quantity: quantity
                };
                
                addToCart(item);
                
                // Show confirmation (optional)
                alert(`Added ${quantity} ${productName}(s) to cart!`);
            });
        }
    });
}

// For pages with cart popup (like your main collection page)
function initializeCartPopup() {
    const cartPopup = document.getElementById("cartPopup");
    if (!cartPopup) return;
    
    const closeCartPopup = document.getElementById("closeCartPopup");
    const cartItemsContainer = document.getElementById("cartItemsPopup");
    const cartTotal = document.getElementById("cartTotal");
    const cartPanel = document.getElementById("cartPanel");

    function openCartPopup() {
        cartPopup.classList.remove("hidden");
        setTimeout(() => {
            cartPanel.classList.remove("translate-x-full");
        }, 10);
        renderCartPopup();
    }

    function closeCartFn() {
        cartPanel.classList.add("translate-x-full");
        setTimeout(() => {
            cartPopup.classList.add("hidden");
        }, 300);
    }

    function renderCartPopup() {
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center">Your basket is empty.</p>`;
            cartTotal.textContent = "PKR 0";
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = cartItems.map((item, index) => {
            total += item.price * item.quantity;
            return `
                <div class="flex space-x-4 items-center">
                    <img src="${item.img}" alt="${item.name}" class="w-20 h-24 object-cover rounded">
                    <div class="flex-1">
                        <h3 class="font-semibold text-sm">${item.name}</h3>
                        <p class="text-gray-500 text-xs">${item.size}</p>
                        <p class="text-sm mt-1">${item.quantity}X</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">PKR ${item.price.toLocaleString()}</p>
                        <button onclick="removeCartItem(${index})" class="text-gray-500 hover:text-black text-lg mt-1">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        cartTotal.textContent = "PKR " + total.toLocaleString();
        
        // Add checkout/basket button listeners
        addCartPopupButtons();
    }

    function addCartPopupButtons() {
        const buttons = document.querySelectorAll('#cartPopup button');
        
        buttons.forEach(button => {
            if (button.textContent.includes('CHECK OUT') && !button.hasAttribute('data-checkout-added')) {
                button.setAttribute('data-checkout-added', 'true');
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (cartItems.length === 0) {
                        alert("Your cart is empty. Please add some items before checkout.");
                        return;
                    }
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    window.location.href = "checkout.html";
                });
            }
            
            if (button.textContent.includes('VIEW SHOPPING BASKET') && !button.hasAttribute('data-basket-added')) {
                button.setAttribute('data-basket-added', 'true');
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (cartItems.length === 0) {
                        alert("Your cart is empty. Please add some items before viewing basket.");
                        return;
                    }
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    window.location.href = "basket.html";
                });
            }
        });
    }

    // Event listeners
    if (closeCartPopup) {
        closeCartPopup.addEventListener("click", closeCartFn);
    }
    
    if (cartPopup) {
        cartPopup.addEventListener("click", (e) => {
            if (e.target === cartPopup) closeCartFn();
        });
    }

    // Auto-open cart popup when items are added (if on product grid page)
    const originalAddToCart = addToCart;
    window.addToCart = function(item) {
        originalAddToCart(item);
        openCartPopup();
    };
}

// Global function to remove item from cart popup
function removeCartItem(index) {
    removeFromCart(index);
    // Re-render popup if it exists
    if (document.getElementById("cartPopup")) {
        // Trigger re-render
        const event = new CustomEvent('cartUpdated');
        document.dispatchEvent(event);
    }
}

// ==================== INITIALIZATION ==================== //

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing universal cart system...');
    
    // Initialize basic cart system for all pages
    initializeCartSystem();
    
    // Initialize page-specific features
    if (document.querySelector('.product-card') || document.getElementById('addToCartBtn')) {
        console.log('Product page detected - adding cart functionality');
        initializeProductPage();
    }
    
    if (document.getElementById('cartPopup')) {
        console.log('Cart popup detected - initializing popup');
        initializeCartPopup();
    }
    
    console.log('Cart system initialized with', cartItems.length, 'items');
});

// Re-initialize if needed (for dynamic content)
function reinitializeCartSystem() {
    initializeCartSystem();
    addNavigationListeners();
}
  