import { initFilters } from "./filters.js";
import { initCarousel } from "./carousel.js";
import { initEffects } from "./effects.js";
import { initAnimations } from "./animations.js";
import { initScroll } from "./scroll.js";
import { initUtil } from "./util.js";

let testing = false;

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initCarousel();
    initEffects();
    initScroll();
    initAnimations();
    initUtil(testing);
});

// Add Project details/decor

// Add Technical Skills details/decor

// Add Contacts details/decor

// Add Project background animation

// Add Technical Skills background animation

// Add scroll animations (put in scroll.js if js is needed)
// - Project - Vault openning (?)
// - Technical Skills - Constellation type beat (?)
// - Contacts - idk yet
// Add intro animation