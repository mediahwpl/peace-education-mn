
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
