const G = 6.67430e-11; // m^3 kg^-1 s^-2 Gravitational constant
const c = 299792458;  // m/s speed of light
const M_sun = 1.989e30;          // kg
const M = 1e8 * M_sun;           // Gargantua black hole mass
const Rs = 2 * G * M / (c**2);   // Schwarzschild radius

function gammaStatic(rMeters) {
    return 1 / Math.sqrt(1 - Rs / rMeters);
}

function redshiftStatic(rMeters) {
    return gammaStatic(rMeters) - 1;
}


const radiusSlider = document.getElementById("radiusSlider");
const radiusValue = document.getElementById("radiusValue");

let rRS = parseFloat(radiusSlider.value); // radius in multiples of Rs
let rMeters = rRS * Rs;

radiusValue.textContent = rRS.toFixed(5);

radiusSlider.addEventListener("input", () => {
    rRS = parseFloat(radiusSlider.value);
    rMeters = rRS * Rs;
    radiusValue.textContent = rRS.toFixed(5);
    updateReadouts();
});

const gammaDisplay = document.getElementById("gammaDisplay");
const zDisplay = document.getElementById("zDisplay");

function updateReadouts() {
    const gamma = gammaStatic(rMeters);
    const z = redshiftStatic(rMeters);

    gammaDisplay.textContent = gamma.toExponential(3);
    zDisplay.textContent = z.toExponential(3);
}


const clockFar = document.getElementById("clockFar");
const clockNear = document.getElementById("clockNear");

let tauFar = 0;   // proper time for far clock
let tauNear = 0;  // proper time for near clock
let lastTime = null;

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2,'0');
    const m = Math.floor((seconds % 3600)/60).toString().padStart(2,'0');
    const s = Math.floor(seconds % 60).toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
}

function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime)/1000; // convert ms → s
    lastTime = timestamp;

    tauFar += delta;
    tauNear += delta / gammaStatic(rMeters);

    clockFar.textContent = formatTime(tauFar);
    clockNear.textContent = formatTime(tauNear);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);