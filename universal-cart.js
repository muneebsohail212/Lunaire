
let cartItems = [];

// Initialize cart on page load for ALL pages
function initializeCartSystem() {
    // Load cart from localStorage
    try {
        const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartItems = savedCart;
    } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        cartItems = [];
    }
    
    // Update cart count on current page
    updateCartCount();
    
    // Add navigation event listeners
    addNavigationListeners();
}

// Update cart count display
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.fa-shopping-bag + span, #cartCount');
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    
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
                
                // Save current cart state
                try {
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                } catch (e) {
                    console.error('Error saving cart to localStorage:', e);
                }
                
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
        cartItems[existingItemIndex].quantity += (item.quantity || 1);
    } else {
        // Add new item
        cartItems.push({
            ...item,
            quantity: item.quantity || 1
        });
    }
    
    // Save to localStorage
    try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
        console.error('Error saving cart to localStorage:', e);
    }
    
    // Update count display
    updateCartCount();
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cartItems.length) {
        cartItems.splice(index, 1);
        try {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (e) {
            console.error('Error saving cart to localStorage:', e);
        }
        updateCartCount();
    }
}

// Clear entire cart
function clearCart() {
    cartItems = [];
    try {
        localStorage.removeItem("cartItems");
    } catch (e) {
        console.error('Error clearing cart from localStorage:', e);
    }
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
                
                // Get product info
                let productName, productPrice, productImg;
                
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
                    size: "WS-25",
                    quantity: quantity
                };
                
                addToCart(item);
            });
        }
    });
}

// ==================== INITIALIZATION ==================== //

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize basic cart system for all pages
    initializeCartSystem();
    
    // Initialize page-specific features
    if (document.querySelector('.product-card') || document.getElementById('addToCartBtn')) {
        initializeProductPage();
    }
});
