const carrusel = document.querySelector(".carrusel");
const track = carrusel.querySelector(".carrusel-track");

// Duplicamos contenido para el bucle infinito
track.innerHTML += track.innerHTML;

let posX = 0;
let startX = 0;
let prevX = 0;
let speed = 1.2;
let direction = -1;
let dragging = false;
let hoverActive = false;
let rafId = null;

// 🔁 Función principal de animación
function animar() {
    if (!dragging) {
        posX += direction * speed;
    }

    const limit = track.scrollWidth / 2;
    if (posX <= -limit) posX += limit;
    if (posX >= 0) posX -= limit;

    track.style.transform = `translateX(${posX}px)`;
    rafId = requestAnimationFrame(animar);
}

// Iniciar y detener
function iniciar() {
    if (!rafId) rafId = requestAnimationFrame(animar);
}
function detener() {
    cancelAnimationFrame(rafId);
    rafId = null;
}

// 🖱️ Eventos de escritorio ---------------------------
carrusel.addEventListener("mouseenter", () => {
    hoverActive = true;
    speed = 0;
});
carrusel.addEventListener("mousemove", (e) => {
    if (!hoverActive || dragging) return;
    const { left, width } = carrusel.getBoundingClientRect();
    const mitad = left + width / 2;
    direction = e.clientX < mitad ? 1 : -1;
    speed = 2;
});
carrusel.addEventListener("mouseleave", () => {
    hoverActive = false;
    speed = 1.2;
    direction = -1;
});

carrusel.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.clientX;
    prevX = e.clientX;
    speed = 0;
    carrusel.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const delta = e.clientX - prevX;
    prevX = e.clientX;
    posX += delta;

    const limit = track.scrollWidth / 2;
    if (posX <= -limit) posX += limit;
    if (posX >= 0) posX -= limit;

    track.style.transform = `translateX(${posX}px)`;
});

document.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    carrusel.style.cursor = "grab";
    const flick = e.clientX - startX;

    if (Math.abs(flick) > 30) {
        direction = flick > 0 ? 1 : -1;
        speed = Math.min(Math.abs(flick) / 30, 6);
    } else {
        speed = 1.2;
        direction = -1;
    }
});

// 📱 Eventos táctiles (mobile) — versión con animación constante
carrusel.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    dragging = true;
    startX = touch.clientX;
    prevX = touch.clientX;
    speed = 0; // se pausa mientras toca
});

carrusel.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const delta = touch.clientX - prevX;
    prevX = touch.clientX;
    posX += delta;

    const limit = track.scrollWidth / 2;
    if (posX <= -limit) posX += limit;
    if (posX >= 0) posX -= limit;

    track.style.transform = `translateX(${posX}px)`;
});

carrusel.addEventListener("touchend", () => {
    dragging = false;
    // vuelve a la animación normal hacia la izquierda con velocidad constante
    speed = 1.2;
    direction = -1;
});

// 🚀 Iniciar animación infinita
iniciar();
