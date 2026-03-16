export function initFilters() {
    setupLayout();
    setupFiltering();
}

function setupLayout() {
    const container = document.querySelector(".project-filters");
    const buttons = [...container.querySelectorAll(".filter-button")];
    const centerButton = container.querySelector(".center");

    const totalButtons = buttons.length;

    const gridColumns = totalButtons % 2 === 0
        ? totalButtons + 1
        : totalButtons;

    container.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;

    const centerColumn = Math.ceil(gridColumns / 2);
    centerButton.style.gridColumn = centerColumn;

    let left = centerColumn - 1;
    let right = centerColumn + 1;
    let leftSide = true;
    
    buttons.forEach(button => {
        if (button === centerButton)  {
            return;
        }

        if (left >= 1 && leftSide) {
            button.style.gridColumn = left;
            left--;
        }

        else {
            button.style.gridColumn = right;
            right++;
        }

        leftSide = !leftSide;
    });
}

function setupFiltering() {
    const buttons = document.querySelectorAll(".filter-button");
    const projects = document.querySelectorAll(".project");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;

            projects.forEach(project => {
                if (filter === "all" || project.dataset.category === filter) {
                    project.classList.remove("hidden");
                }

                else {
                    project.classList.add("hidden");
                }
            });
            document.dispatchEvent(new CustomEvent('projectsFiltered'));
        });
    });
}