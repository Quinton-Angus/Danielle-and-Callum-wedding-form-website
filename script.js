const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")
const headerMobileHamburgerClose = document.getElementById("headerMobileHamburgerClose")
const submitBtn = document.getElementById("submitBtn")
const loadingTxt = document.getElementById("submitTxt")
const loadingSpinner = document.getElementById("submitSpinner")
const error = document.getElementById("error")

hamburgerMenuOpenBtn?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileDeactivated")
    headerMobile?.classList.add("headerMobileActivated")
})

headerMobileHamburgerClose?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileActivated")
    headerMobile?.classList.add("headerMobileDeactivated")
})

function enableLoading() {
    if (loadingTxt) loadingTxt.style.display = "none"
    if (loadingSpinner) loadingSpinner.style.display = "flex"
    if (submitBtn) {
        submitBtn.style.cursor = "wait"
        submitBtn.style.pointerEvents = "none"
    }
}

function disableLoading() {
    if (loadingTxt) loadingTxt.style.display = "flex"
    if (loadingSpinner) loadingSpinner.style.display = "none"
    if (submitBtn) {
        submitBtn.style.cursor = "pointer"
        submitBtn.style.pointerEvents = "auto"
    }
}

function logError(code, message) {
    if (error) error.textContent = `Error ${code} - ${message}`
}

function clearError() {
    if (error) error.textContent = ""
}

function getInputs() {
    return {
        firstName: document.getElementById("firstNameInput"),
        lastName: document.getElementById("lastNameInput"),
        additionalNames: document.getElementById("additionalNamesInput"),
        email: document.getElementById("emailInput")
    }
}

function disableInputs() {
    Object.values(getInputs()).forEach(input => {
        if (input) input.disabled = true
    })
}

function enableInputs() {
    Object.values(getInputs()).forEach(input => {
        if (input) input.disabled = false
    })
}

submitBtn?.addEventListener("click", async () => {
    const inputs = getInputs()
    const firstName = inputs.firstName?.value.trim() ?? ""
    const lastName = inputs.lastName?.value.trim() ?? ""
    const additionalNames = inputs.additionalNames?.value.trim() ?? ""
    const email = inputs.email?.value.trim() ?? ""

    clearError()

    if (!firstName || !lastName || !email) {
        logError(400, "Please complete all required fields.")
        return
    }

    disableInputs()
    enableLoading()

    try {
        const submitData = await fetch("https://api.danielle-and-callum.quintondev.com/v1/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: {
                    firstName,
                    lastName,
                    additionalNames,
                    email
                }
            })
        })

        if (submitData.status === 200) {
            window.location.href = "./success.html"
            return
        }

        if (submitData.status === 400) {
            logError(400, "Invalid data entered, please check your details and try again.")
        } else if (submitData.status === 500) {
            logError(500, "Internal server error, please try again later.")
        } else {
            logError(submitData.status, "Unexpected response from the server, please try again.")
        }
    } catch (err) {
        console.error("Submission failed:", err)
        logError("NETWORK", "Unable to contact the server, please check your connection and try again.")
    } finally {
        disableLoading()
        enableInputs()
    }
})
