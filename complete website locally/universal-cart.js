// ==================== UNIVERSAL CART SYSTEM ==================== //

// Global cart items array
let cartItems = []

// Initialize cart on page load
function initializeCartSystem() {
  console.log("[v0] Initializing cart system...")

  // Load cart from localStorage
  try {
    const savedCart = localStorage.getItem("cartItems")
    console.log("[v0] Raw localStorage value:", savedCart)

    if (savedCart) {
      cartItems = JSON.parse(savedCart)
      console.log("[v0] Cart loaded from localStorage:", cartItems)
    } else {
      cartItems = []
      console.log("[v0] No cart found in localStorage, starting fresh")
    }
  } catch (e) {
    console.error("[v0] Error loading cart from localStorage:", e)
    cartItems = []
  }

  // Update cart count display
  updateCartCount()

  // Add navigation listeners
  addNavigationListeners()
}

// Update cart count in header
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".fa-shopping-bag + span, #cartCount")
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)

  cartCountElements.forEach((element) => {
    if (element) {
      element.textContent = totalItems.toString()
    }
  })

  console.log("[v0] Cart count updated to:", totalItems)
}

// Add navigation listeners
function addNavigationListeners() {
  // Shopping bag icon - navigate to basket
  const bagIcons = document.querySelectorAll(".fa-shopping-bag")
  bagIcons.forEach((icon) => {
    const bagButton = icon.closest("button, a")
    if (bagButton && !bagButton.hasAttribute("data-nav-added")) {
      bagButton.setAttribute("data-nav-added", "true")
      bagButton.addEventListener("click", (e) => {
        e.preventDefault()
        // Save cart before navigating
        saveCartToLocalStorage()
        window.location.href = "basket.html"
      })
    }
  })

  // User icon - navigate to login
  const userIcons = document.querySelectorAll(".fa-user")
  userIcons.forEach((icon) => {
    const userButton = icon.closest("button, a")
    if (userButton && !userButton.hasAttribute("data-nav-added")) {
      userButton.setAttribute("data-nav-added", "true")
      userButton.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = "login.html"
      })
    }
  })
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  try {
    const cartJSON = JSON.stringify(cartItems)
    localStorage.setItem("cartItems", cartJSON)
    console.log("[v0] Cart saved to localStorage:", cartItems)
    console.log("[v0] Saved JSON:", cartJSON)
  } catch (e) {
    console.error("[v0] Error saving cart to localStorage:", e)
  }
}

// Add item to cart
function addToCart(item) {
  console.log("[v0] Adding to cart:", item)

  // Check if item already exists
  const existingItemIndex = cartItems.findIndex(
    (cartItem) => cartItem.name === item.name && cartItem.size === item.size,
  )

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cartItems[existingItemIndex].quantity += item.quantity || 1
    console.log("[v0] Updated existing item quantity")
  } else {
    // Add new item
    cartItems.push({
      ...item,
      quantity: item.quantity || 1,
    })
    console.log("[v0] Added new item to cart")
  }

  // Save to localStorage
  saveCartToLocalStorage()

  // Update count display
  updateCartCount()

  // Show confirmation
  alert(`${item.name} added to cart!`)
}

// Remove item from cart
function removeFromCart(index) {
  if (index >= 0 && index < cartItems.length) {
    const removedItem = cartItems[index]
    cartItems.splice(index, 1)
    saveCartToLocalStorage()
    updateCartCount()
    console.log("[v0] Removed item:", removedItem)
  }
}

// Clear entire cart
function clearCart() {
  cartItems = []
  try {
    localStorage.removeItem("cartItems")
    console.log("[v0] Cart cleared")
  } catch (e) {
    console.error("[v0] Error clearing cart:", e)
  }
  updateCartCount()
}

// Get cart items
function getCartItems() {
  return cartItems
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM Content Loaded - initializing cart")
  initializeCartSystem()
})
