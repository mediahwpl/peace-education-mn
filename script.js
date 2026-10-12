
// ==== reveal ====
const sections = document.querySelectorAll(".section-reveal");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

const cards = entry.target.querySelectorAll(".lesson-card, .letter-card, .org-section");

cards.forEach((card,index)=>{

setTimeout(()=>{
card.classList.add("active");
}, index * 120);

});

}

});

},{
threshold:0.2
});

sections.forEach(section=>{
observer.observe(section);
});

// ==== Peace Letters Lightbox ====
const letters = document.querySelectorAll('.letter-card img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close');

letters.forEach(letter => {
    letter.addEventListener('click', () => {
        lightboxImg.src = letter.src;            // Зургийг томруулах
        lightbox.classList.add('show');          // Lightbox-г харуулах
        lightboxImg.style.transform = 'scale(0.8)';
        setTimeout(() => { lightboxImg.style.transform='scale(1)'; }, 10);
    })
});

// Close товч дээр дарахад хаах
closeBtn.addEventListener('click', () => {
    lightboxImg.style.transform='scale(0.8)';
    setTimeout(() => lightbox.classList.remove('show'), 300);
});

// Lightbox гадна click-д хаах
lightbox.addEventListener('click', e => {
    if(e.target === lightbox){
        lightboxImg.style.transform='scale(0.8)';
        setTimeout(() => lightbox.classList.remove('show'), 300);
    }
});

// ==== hamburger menu ====
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

function openMenu() {
    hamburger.classList.add("active");
    navLinks.classList.add("active");
    document.body.classList.add("menu-open");

    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Цэс хаах");
}

function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.classList.remove("menu-open");

    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Цэс нээх");
}

// Hamburger товч
hamburger.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Menu сонгоход хаах
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

// Escape товчоор хаах
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// Desktop хэмжээ рүү буцахад menu хаах
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});