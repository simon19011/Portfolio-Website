// Project file "follows" cursor on hover
// Dynamic sizing based on array location
// - Current/Center file = largest
// - next file, previous file = smaller
// - next next file, previous previous file = smallest

// Considers only visible projects as projects
let projects = [];
let currentIndex = 0;
let animating = false;
let expanded = false;

export function initCarousel() {
    setupCarousel();

    document.addEventListener('projectsFiltered', () => {
        refreshCarousel();
    });

    window.addEventListener('resize', () => {
        applyStyling();
    });

    document.querySelector(".carousel-left").addEventListener("click", () => {
        if (animating) return;
        moveCarousel(-1);
    });
    
    document.querySelector(".carousel-right").addEventListener("click", () => {
        if (animating) return;
        moveCarousel(1);
    });

    document.querySelectorAll(".project").forEach(project => {
        project.addEventListener("click", () => {
            const clickedIndexed = projects.indexOf(project);
            
            if (clickedIndexed === -1 || clickedIndexed === currentIndex) return;
        
            const total = projects.length;
            let offset = clickedIndexed - currentIndex;

            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const direction = offset > 0 ? 1: -1;
            let steps = Math.abs(offset);
            moveCarousel(direction, steps);
        });
    });
}

function getVisibleProjects() {
    return Array.from(document.querySelectorAll(".project:not(.hidden)"));
}

function refreshCarousel() {
    // Called when visible project gets changed like in filters.js
    // Handles updating projects array and currentIndex
    const currentProject = projects[currentIndex];
    projects = getVisibleProjects();
    const newIndex = projects.indexOf(currentProject);

    currentIndex = newIndex !== -1 ? newIndex : 0;
    
    updateCarousel();
}

function setupCarousel() {
    // Sets the default carousel settings
    projects = getVisibleProjects();
    currentIndex = 0;

    applyStyling();
}

function moveCarousel(direction, steps = 1) {
    projects.forEach(p => p.classList.remove("expanded"));
    expanded = false;

    const totalProjects = projects.length;
    currentIndex = (currentIndex + direction + totalProjects) % totalProjects;
    updateCarousel(() => {
        if (steps > 1) {
            moveCarousel(direction, steps - 1);
        }
    });
}

function updateCarousel() {
    // This is a sort of wrapper function that keeps all carousel update functions organised.
    // Called when carousel is updated (center moves, filtered, etc.)
    // Plays animation resizes/relocates accordingly
    applyStyling();
    addExpandListener();
}

function addExpandListener() {
    const centerProject = projects[currentIndex];
    centerProject.onclick = () => {
        centerProject.classList.toggle("expanded");
        expanded = centerProject.classList.contains("expanded");
    }
}

function applyStyling() {
    // Does logic for scale and position of projects
    animating = true;
    const visilbeCount = window.innerWidth <= 900 ? 3 :5;
    const visibleRange = Math.floor(visilbeCount / 2);
    const bufferRange = visibleRange + 1;
    const total = projects.length;

    const spacing = 240;

    const allProjects = document.querySelectorAll('.project');

    allProjects.forEach(project => {
        project.classList.remove(
            'position-center',
            'position-adjacent',
            'position-far'
        );

        project.style.opacity = "0";
        project.style.pointerEvents = "none";
        project.style.transform = "";
    });

    const centerProject = projects[currentIndex];
    const onTrantionEnd = (e) => {
        if (e.propertyName === "transform") {
            animating = false;
            centerProject.removeEventListener("transitionend", onTrantionEnd);
        }
    };
    centerProject.addEventListener("transitionend", onTrantionEnd);

    projects.forEach((project, index) => {
        let offset = index - currentIndex;

        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const distance = Math.abs(offset);

        if (distance > bufferRange) {
            project.style.opacity = "0";
            return;
        }

        project.style.opacity = "1";
        project.style.pointerEvents = "auto";

        const x = offset * spacing;
        project.style.setProperty("--x", `${x}px`);

        if (distance === bufferRange) {
            project.classList.add("position-buffer");
            const bufferScale = visilbeCount === 3 ? 0.7 : 0.55;
            project.style.transform = `translateX(${x}px) scale(${bufferScale})`;
            project.style.opacity = "0";
        }

        if (distance === 0) {
            project.classList.add("position-center");
        }

        else if (distance === 1) {
            project.classList.add("position-adjacent");
        }
            
        else if (distance === 2) {
            project.classList.add("position-far");
        }
    });
}