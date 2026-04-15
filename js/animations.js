export function initAnimations() {
    setupAnimations();
}

async function setupAnimations() {
    //Wait for loaded
    //Plays each animation 
    //Controls timing/flags between each sections animations
    await waitForLoad();
    await introAnimations();s
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForLoad() {
    return new Promise(resolve => {
        if (document.readyState === "complete") {
            resolve();
        } else {
            window.addEventListener("load", resolve);
        }
    });
}

async function introAnimations() {
    const divider = document.querySelector(".hero-divider");
    const title = document.querySelector(".hero h1");
    const subtitle = document.querySelector(".hero p");

    await wait(1000);

    divider.classList.add("animate");
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