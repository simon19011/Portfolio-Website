import { playSectionAnimation } from "./animations.js";

export function initScroll() {
    clickScroll();
    spyScroll();
}

function clickScroll() {
    const navBar = document.querySelector('#home nav')

    document.querySelectorAll('.nav-links').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);

            if (target) {
                window.scrollTo({
                    top: target.offsetTop - navBar.offsetHeight,
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

    let currentActiveId = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const id = entry.target.id;
            if (id === currentActiveId) return;

            currentActiveId = id;

            links.forEach(link => link.classList.remove('active'));
            logo.classList.remove('active-logo');

            if (id === "home") {
                logo.classList.add('active-logo');
                playSectionAnimation(id);
                return;
            }

            const activeLink = document.querySelector(`.nav-links[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');

            playSectionAnimation(id);
        });
    }, {
        root: null,
        threshold: [0.3, 0.75],
        rootMargin: "-20% 0px -20% 0px"
    });

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
}