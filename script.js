const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")

hamburgerMenuOpenBtn.addEventListener('click', () => {
    console.log("ok")
    headerMobile.classList.remove("headerMobileDeactive")
    headerMobile.classList.add("headerMobileActivated")
})
