export async function initAnimations() {
    await waitForLoad();
    await introAnimations();
    await navAnimations();
}

const played = new Set();

export function playSectionAnimation(id) {
    if (played.has(id)) {
        return;
    }
    played.add(id);

    switch (id) {
        case "home":
            heroAnimations();
            break;
        case "about":
            aboutAnimations();
            break;
        case "projects":
            projectsAnimations();
            break;
        case "skills":
            skillsAnimations();
            break;
        case "contacts":
            contactsAnimations();
            break;
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForLoad() {
    return new Promise(resolve => {
        if (document.readyState === "complete") {
            resolve();
        } 
        
        else {
            window.addEventListener("load", resolve);
        }
    });
}

async function introAnimations() {
    //Nothing yet
    //Will be the loading/intro sequence
    return;
}

async function navAnimations() {
    return;
}

async function heroAnimations() {
    await wait(300);

    document.querySelector(".hero-divider-line").classList.add("animate");

    await wait(400);

    document.querySelector(".hero-divider").classList.add("animate");

    await wait(700);

    document.querySelector(".hero-title-text").classList.add("animate");

    await wait(1000);

    document.querySelector(".hero p").classList.add("animate");

    await wait(200);

    document.querySelector(".hero-buttons").classList.add("animate");

    await wait(1000);

    document.querySelector(".scroll-indicator").classList.add("animate");

    document.querySelector(".scroll-text").classList.add("animate");
}

async function aboutAnimations() {
    await wait(300);

    document.querySelector(".about-divider-line").classList.add("animate");

    document.querySelector(".about-divider").classList.add("animate");

    await wait(1100);
    
    document.querySelector(".about-title-text").classList.add("animate");

    await wait(700);

    document.querySelector(".about-body-text").classList.add("animate");

    await wait(200);

    document.querySelector(".about-polaroid").classList.add("animate");
}

async function projectsAnimations() {

    document.querySelector(".projects-reveal-screen").style.pointerEvents = "auto";

    await wait(300);

    document.querySelectorAll(".symbol-1").forEach(el => {
        el.classList.add("animate");
    });

    await wait(1500);

    document.querySelectorAll(".symbol-2").forEach(el => {
        el.classList.add("animate");
    });

    await wait(1000);

    document.querySelector(".left-half").classList.add("animate");
    document.querySelector(".right-half").classList.add("animate");

    await wait(1000);

    document.querySelector(".projects-reveal-screen").classList.add("animate");

    await wait(1500);

    document.querySelector(".projects-reveal-screen").style.pointerEvents = "none";
}

async function skillsAnimations() {
    return;
}

async function contactsAnimations() {
    return;
}