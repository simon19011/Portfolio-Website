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
        updateCarousel();
        animating = false;
    });

    document.querySelectorAll(".project-button").forEach(button => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
        });
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
            if (animating) return;
            const clickedIndex = projects.indexOf(project);
            
            if (clickedIndex === -1) return;

            if (clickedIndex === currentIndex) {
                if (expanded === false) {
                    project.classList.toggle("expanded");
                    expanded = project.classList.contains("expanded");
                }
                return;
            }
            
            const total = projects.length;
            let offset = clickedIndex - currentIndex;

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
    if (expanded) {
        projects.forEach(p => p.classList.remove("expanded"));
        expanded = false;
    }
    
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

    updateCarousel();
}

function moveCarousel(direction, steps = 1) {
    if (expanded) {
        projects.forEach(p => p.classList.remove("expanded"));
        expanded = false;
        return;
    }

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
}

function applyStyling() {
    // Does logic for scale and position of projects
    animating = true;
    const visibleCount = window.innerWidth <= 900 ? 3 :5;
    const visibleRange = Math.floor(visibleCount / 2);
    const bufferRange = visibleRange + 1;
    const total = projects.length;

    const spacing = 240;

    const allProjects = document.querySelectorAll('.project');

    if (animating) {
        allProjects.forEach(p => p.classList.add("disable-hover"));
    }

    else {
        allProjects.forEach(p => p.classList.remove('disable-hover'));
    }

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
    if (centerProject) {
        const onTransitionEnd = (e) => {
            if (e.propertyName === "transform") {
                animating = false;
                centerProject.removeEventListener("transitionend", onTransitionEnd);
                allProjects.forEach(p => p.classList.remove("disable-hover"));
            }
        };
        centerProject.addEventListener("transitionend", onTransitionEnd);
    
        // fallback: ensure animating flag resets after 300ms if transitionend doesn't fire
        setTimeout(() => {
            animating = false;
            allProjects.forEach(p => p.classList.remove("disable-hover"));
            centerProject.removeEventListener("transitionend", onTransitionEnd);
        }, 10);
    } else {
        animating = false; // fallback for no projects
    }

    

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

        let x = offset * spacing;
        project.style.setProperty("--x", `${x}px`);

        if (distance === bufferRange) {
            project.classList.add("position-buffer");
            const bufferScale = visibleCount === 3 ? 0.7 : 0.55;
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
            x = x - (offset * 20);
            project.style.setProperty("--x", `${x}px`);
            project.classList.add("position-far");
        }
    });
}