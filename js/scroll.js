export function initScroll() {
    clickScroll();
    spyScroll();
}

function clickScroll() {
    document.querySelectorAll('.nav-links').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

export function spyScroll() {
    const links = document.querySelectorAll('.nav-links[href^="#"]');
    const sections = document.querySelectorAll('section, header[id]');
    const logo = document.querySelector('.nav-links.logo');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const id = entry.target.id;

            links.forEach(link => link.classList.remove('active'));
            logo.classList.remove('active-logo');

            if (id === "home") {
                logo.classList.add('active-logo');
                return;
            }

            links.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        });
    }, {
        root: null,
        threshold: 0.6
    });

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
}