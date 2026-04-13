export function initUtil() {
    createViewportDisplay();
    updateViewportDisplay();

    window.addEventListener("resize", updateViewportDisplay);
}

function createViewportDisplay() {
    const el = document.createElement("div");

    el.id = "viewport-debug";
    el.style.position = "fixed";
    el.style.bottom = "10px";
    el.style.right = "10px";
    el.style.padding = "8px 12px";
    el.style.background = "rgba(0,0,0,0.7)";
    el.style.color = "#fff";
    el.style.fontSize = "12px";
    el.style.fontFamily = "monospace";
    el.style.zIndex = "9999";
    el.style.borderRadius = "6px";
    el.style.pointerEvents = "none";

    document.body.appendChild(el);
}

function updateViewportDisplay() {
    const el = document.getElementById("viewport-debug");
    if (!el) return;

    el.textContent = `${window.innerWidth} x ${window.innerHeight}`;
}