import { initFilters } from "./filters.js";
import { initCarousel } from "./carousel.js";
import { initEffects } from "./effects.js";
import { initScroll } from "./scroll.js";

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initCarousel();
    initEffects();
    initScroll();
});