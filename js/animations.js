export function initAnimations() {
    setupAnimations();
}

async function setupAnimations() {
    //Wait for loaded
    //Plays each animation 
    //Controls timing/flags between each sections animations
    await waitForLoad();
    await introAnimations();
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

    await wait(1000);

    document.querySelector(".hero-divider-line").classList.add("animate");

    await wait(400);

    document.querySelector(".hero-divider").classList.add("animate");

    await wait(1000);

    document.querySelector(".hero-title-text").classList.add("animate");

    await wait(1000);

    document.querySelector(".hero p").classList.add("animate");

    await wait(200);

    document.querySelector(".hero-buttons").classList.add("animate");

    await wait(1000);

    document.querySelector(".scroll-indicator").classList.add("animate");

    document.querySelector(".scroll-text").classList.add("animate");
}

function heroAniamtions() {
    return;
}

function aboutAnimations() {
    return;
}

function projectsAnimations() {
    return;
}

function skillsAnimations() {
    return;
}

function contactsAnimations() {
    return;
}