const API_URL = "https://api.danielle-and-callum.quintondev.com/v1/origami"

const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")
const headerMobileHamburgerClose = document.getElementById("headerMobileHamburgerClose")

const shopView = document.getElementById("shopView")
const checkoutView = document.getElementById("checkoutView")
const successView = document.getElementById("successView")
const quantityElement = document.getElementById("quantity")
const checkoutQuantity = document.getElementById("checkoutQuantity")
const cartSummary = document.getElementById("cartSummary")
const checkoutButton = document.getElementById("checkoutButton")
const orderForm = document.getElementById("orderForm")
const orderError = document.getElementById("orderError")
const placeOrder = document.getElementById("placeOrder")
const orderNumber = document.getElementById("orderNumber")

let quantity = 1
let cartQuantity = 0

hamburgerMenuOpenBtn?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileDeactivated")
    headerMobile?.classList.add("headerMobileActivated")
})

headerMobileHamburgerClose?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileActivated")
    headerMobile?.classList.add("headerMobileDeactivated")
})

function updateProductQuantity() {
    quantityElement.textContent = quantity
}

function updateCart() {
    if (cartQuantity < 1) {
        cartSummary.textContent = "Nothing in your cart yet."
        checkoutButton.disabled = true
        checkoutQuantity.textContent = quantity
        return
    }

    checkoutQuantity.textContent = cartQuantity
    cartSummary.textContent = `Origami Paper × ${cartQuantity}`
    checkoutButton.disabled = false
}

document.getElementById("decreaseQuantity")?.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1)
    updateProductQuantity()
})

document.getElementById("increaseQuantity")?.addEventListener("click", () => {
    quantity = Math.min(99, quantity + 1)
    updateProductQuantity()
})

document.getElementById("addToCart")?.addEventListener("click", () => {
    cartQuantity = quantity
    updateCart()
    checkoutButton.focus()
})

checkoutButton?.addEventListener("click", () => {
    checkoutQuantity.textContent = cartQuantity
    checkoutView.classList.remove("hidden")
    shopView.classList.add("hidden")
    window.scrollTo({ top: 0, behavior: "smooth" })
})

document.getElementById("backToShop")?.addEventListener("click", () => {
    checkoutView.classList.add("hidden")
    shopView.classList.remove("hidden")
})

orderForm?.addEventListener("submit", async (event) => {
    event.preventDefault()
    orderError.textContent = ""
    placeOrder.disabled = true
    placeOrder.textContent = "Sending order..."

    const formData = new FormData(orderForm)
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, quantity: cartQuantity })
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
            orderError.textContent = result.error || "We couldn't send your order. Please try again."
            return
        }

        orderNumber.textContent = `Order number: ${result.orderId}`
        checkoutView.classList.add("hidden")
        successView.classList.remove("hidden")
        window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
        console.error("Origami order failed:", error)
        orderError.textContent = "We couldn't contact the order service. Please try again."
    } finally {
        placeOrder.disabled = false
        placeOrder.textContent = "Place order"
    }
})

updateProductQuantity()
updateCart()
