function loadComponent(id, file) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${file} ачаалахад алдаа гарлаа`);
            }

            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Header ачаалсны дараа hamburger menu ажиллуулах
            if (id === "header") {
                initializeHamburger();
            }
        })
        .catch(error => {
            console.error(error);
        });
}


// COMPONENTS LOAD
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");


// HAMBURGER MENU
function initializeHamburger() {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (!hamburger || !navLinks) return;

    function openMenu() {
        hamburger.classList.add("active");
        navLinks.classList.add("active");
        document.body.classList.add("menu-open");

        hamburger.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");

        hamburger.setAttribute("aria-expanded", "false");
    }

    // Hamburger click
    hamburger.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Menu link click
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Desktop screen
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}