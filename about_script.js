const revealElements = document.querySelectorAll(
    '.about-reveal-fade, .about-reveal-up, .about-reveal-down, .about-reveal-herotext'
);

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }

    });

}, {
    threshold: 0.15
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});