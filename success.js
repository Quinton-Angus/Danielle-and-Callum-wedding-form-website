const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")
const headerMobileHamburgerClose = document.getElementById("headerMobileHamburgerClose")

hamburgerMenuOpenBtn?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileDeactivated")
    headerMobile?.classList.add("headerMobileActivated")
})

headerMobileHamburgerClose?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileActivated")
    headerMobile?.classList.add("headerMobileDeactivated")
})
