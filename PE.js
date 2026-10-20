/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    // Цэсийг нээх, хаах
    function toggleMenu(forceClose = false) {

        const isOpen = navLinks.classList.contains("open");
        const shouldOpen = forceClose ? false : !isOpen;

        navLinks.classList.toggle("open", shouldOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(shouldOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            shouldOpen ? "Цэс хаах" : "Цэс нээх"
        );

        menuToggle.innerHTML = shouldOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        document.body.classList.toggle(
            "menu-open",
            shouldOpen
        );

    }

    // Hamburger товч
    menuToggle.addEventListener("click", function () {
        toggleMenu();
    });

    // Цэсний холбоос дээр дарахад цэсийг хаана
    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            toggleMenu(true);
        });

    });

    // Escape товчоор цэсийг хаана
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            toggleMenu(true);
        }

    });

    // Утасны цэс нээлттэй үед дэлгэц томорвол цэсийг цэвэрлэнэ
    window.addEventListener("resize", function () {

        if (window.innerWidth > 850) {
            toggleMenu(true);
        }

    });

}


/* =========================================
   2. LESSON DETAILS
========================================= */

const lessonButtons = document.querySelectorAll(".lesson-expand");

lessonButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const details = button.nextElementSibling;

        if (!details || !details.classList.contains("lesson-details")) {
            return;
        }

        const isExpanded =
            button.getAttribute("aria-expanded") === "true";

        // Одоогийн дэлгэрэнгүй хэсгийг нээх эсвэл хаах
        button.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );

        details.hidden = isExpanded;

        // Товчны бичвэрийг шинэчлэх
        const buttonIcon = button.querySelector("i");

        button.childNodes[0].textContent = isExpanded
            ? "Дэлгэрэнгүй "
            : "Хураах ";

        if (buttonIcon) {
            buttonIcon.setAttribute(
                "aria-hidden",
                "true"
            );
        }

    });

});


/* =========================================
   3. HEADER SCROLL EFFECT
========================================= */

const siteHeader = document.getElementById("siteHeader");

function updateHeader() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 30) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

// Хуудас эхлэхэд нэг удаа шалгана
updateHeader();


/* =========================================
   4. AUTOMATIC FOOTER YEAR
========================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
