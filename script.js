const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")
const headerMobileHamburgerClose = document.getElementById("headerMobileHamburgerClose")

hamburgerMenuOpenBtn.addEventListener('click', () => {
    console.log("ok")
    headerMobile.classList.remove("headerMobileDeactivated")
    headerMobile.classList.add("headerMobileActivated")
    console.log(headerMobile.classList)
})

headerMobileHamburgerClose.addEventListener("click", () => {
    headerMobile.classList.remove("headerMobileActivated")
    headerMobile.classList.add("headerMobileDeactivated")
})

const submitBtn = document.getElementById("submitBtn")

const loadingTxt = document.getElementById("submitTxt")
const loadingSpinner = document.getElementById("submitSpinner")

function enableLoading() {
    loadingTxt.style.display = "none"
    loadingSpinner.style.display = "flex"
    submitBtn.style.cursor = "wait"
}

function disableLoading() {
    loadingTxt.style.display = "flex"
    loadingSpinner.style.display = "none"
    submitBtn.style.cursor = "pointer"
}

function logError(code, message) {
    const error = document.getElementById("error")

    error.innerHTML = `Error ${code} - ${message}`
}

function disableInputs() {

    const firstName = document.getElementById("firstNameInput")
    const lastName = document.getElementById("lastNameInput")
    const additionalNames = document.getElementById("additionalNamesInput")
    const email = document.getElementById("emailInput")

    firstName.disabled = true
    lastName.disabled = true
    additionalNames.disabled = true
    email.disabled = true

}

function enableInputs() {

    const firstName = document.getElementById("firstNameInput")
    const lastName = document.getElementById("lastNameInput")
    const additionalNames = document.getElementById("additionalNamesInput")
    const email = document.getElementById("emailInput")

    firstName.disabled = false
    lastName.disabled = false
    additionalNames.disabled = false
    email.disabled = false

}

submitBtn.addEventListener("click", async () => {
    const firstName = document.getElementById("firstNameInput")
    const lastName = document.getElementById("lastNameInput")
    const additionalNames = document.getElementById("additionalNamesInput")
    const email = document.getElementById("emailInput")

    disableInputs()
    enableLoading()

    const submitData = await fetch("https://api.danielle-and-callum.quintondev.com/v1/submit", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            data: {
                firstName: firstName.value,
                lastName: lastName.value,
                additionalNames: additionalNames.value,
                email: email.value
            }
        })
    })

    const response = await submitData.json()

    if (submitData.status === 500) {
        logError(500, "Internal server error, try again later.")

        disableLoading()
        enableInputs()

    } else if (submitData.status === 400) {
        logError(400, "Invalid data entered, please check your details and try again.")

        disableLoading()
        enableInputs()

    } else {
        window.location.href = "./success.html"
    }
})