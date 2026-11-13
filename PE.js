/* =========================================
   2. LESSON DETAILS
========================================= */

const lessonButtons = document.querySelectorAll(".pe-lesson-expand");

lessonButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const details = button.nextElementSibling;

        if (!details || !details.classList.contains("pe-lesson-details")) {
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
