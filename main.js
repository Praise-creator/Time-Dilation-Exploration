//physics constants
const G = 6.67430e-11;        // m^3 kg^-1 s^-2
const c = 299_792_458;        // m/s
const MSUN = 1.98847e30;      // kg
const M = 1e8 * MSUN;         // ~Gargantua scale
const Rs = (2 * G * M) / (c * c);

//refs
const radiusSlider = document.getElementById("radiusSlider");
const radiusValue  = document.getElementById("radiusValue");
const orbitToggle  = document.getElementById("orbitToggle");
const orbitBadge   = document.getElementById("orbitBadge");
const resetBtn     = document.getElementById("resetBtn");

const clockFar  = document.getElementById("clockFar");
const clockNear = document.getElementById("clockNear");

const planet = document.getElementById("planet");
const ship   = document.getElementById("ship");
const bh     = document.getElementById("bh");

const RsKm = document.getElementById("RsKm");
const rAbsKm = document.getElementById("rAbsKm");
const rOverRs = document.getElementById("rOverRs");
const gammaDisplay = document.getElementById("gammaDisplay");
const zDisplay = document.getElementById("zDisplay");
const betaDisplay = document.getElementById("betaDisplay");
const redshiftChip = document.getElementById("redshiftChip");

const infoBtn = document.getElementById("infoBtn");
const infoPanel = document.getElementById("infoPanel");
const closeInfo = document.getElementById("closeInfo");


let rRS = parseFloat(radiusSlider.value); // r in Rs units from the slider
let rMeters = rRS * Rs;
let useOrbit = false;

// Proper times (seconds)
let tauFar = 0;
let tauNear = 0;
let lastFrame = null;

//helper functions
function gammaStatic(r) {
  const x = 1 - (Rs / r);
  if (x <= 0) return Infinity;
  return 1 / Math.sqrt(x);
}

function betaOrbitLocal(r) {
  const num = (Rs / (2 * r));
  const den = 1 - (Rs / r);
  if (num <= 0 || den <= 0) return NaN;
  return Math.sqrt(num / den);
}

function gammaOrbitTotal(r) {
  // Total time dilation (gravity+velocity) for circular orbit wrt infinity:
  // γ = 1 / sqrt(1 - 3Rs/(2r))  (valid for r >= 1.5 Rs; stable for r >= 3 Rs)
  const x = 1 - (3 * Rs) / (2 * r);
  if (x <= 0) return Infinity;
  return 1 / Math.sqrt(x);
}

function redshiftStatic(r) {
    // Gravitational redshift for static emitter to infinity
    return gammaStatic(r) - 1;
}

function redshiftOrbitAvg(r) {
  // Simple angle-averaged redshift proxy for orbiting emitter
  return gammaOrbitTotal(r) - 1;
}

// more helpers 
function fmt(x, digits = 3) {
  if (!isFinite(x)) return "→∞";
  if (x === 0) return "0";
  const a = Math.abs(x);
  return a >= 1e4 || a < 1e-3 ? x.toExponential(digits) : x.toFixed(digits);
}

function secondsToHMS(s) {
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

// redshift 
function redshiftColor(z) {
  // Map z to a hue shift from blue (~210°) toward red (~0°)
  // Use tanh to keep things bounded even for huge z near the horizon.
  const hue = Math.max(0, 210 - 180 * Math.tanh(z / 2)); // z scale tweakable
  return `hsl(${hue}, 85%, 55%)`;
}

// Scene mapping (r/Rs -> planet X position)
function updatePlanetPosition() {
  // Scene geometry (px):
  // Black hole left edge is at 60px, width 160 => BH extends to x = 60..220
  const minX = 230;           // just outside BH "edge"
  const maxX = ship.getBoundingClientRect().left - bh.getBoundingClientRect().left - 30; // near ship area
  // normalize rRS from [1.0001, 50] to [0, 1]
  const minR = parseFloat(radiusSlider.min);
  const maxR = parseFloat(radiusSlider.max);
  let t = (rRS - minR) / (maxR - minR);
  t = Math.min(1, Math.max(0, t));
  const leftPx = minX + t * (maxX - minX);
  planet.style.left = `${leftPx}px`;
  planet.style.top = `${ship.offsetTop + (ship.offsetHeight / 2) - (planet.offsetHeight / 2)}px`;
}

// visuals
function updateReadouts() {
  rMeters = rRS * Rs;
  RsKm.textContent = fmt(Rs / 1000, 2);
  rAbsKm.textContent = fmt(rMeters / 1000, 2);
  rOverRs.textContent = fmt(rRS, 4);

  const gamma = useOrbit ? gammaOrbitTotal(rMeters) : gammaStatic(rMeters);
  const z = useOrbit ? redshiftOrbitAvg(rMeters) : redshiftStatic(rMeters);

  gammaDisplay.textContent = fmt(gamma, 4);
  zDisplay.textContent = fmt(z, 4);

  // Orbit badge + beta display logic
  if (useOrbit) {
    // Valid circular orbits require r >= 1.5 Rs (photon sphere at 1.5 Rs).
    // Stable orbits require r >= 3 Rs (ISCO).
    if (rRS < 1.5) {
      orbitBadge.className = "badge error";
      orbitBadge.textContent = "No circular orbit (inside photon sphere)";
    } else if (rRS < 3) {
      orbitBadge.className = "badge warn";
      orbitBadge.textContent = "Unstable orbit (r < 3 Rₛ)";
    } else {
      orbitBadge.className = "badge ok";
      orbitBadge.textContent = "Stable orbit";
    }
    const beta = betaOrbitLocal(rMeters);
    betaDisplay.textContent = isNaN(beta) ? "—" : fmt(beta, 4);
  } else {
    orbitBadge.className = "badge";
    orbitBadge.textContent = "";
    betaDisplay.textContent = "—";
  }

  // Update redshift colors
  const color = redshiftColor(z);
  planet.style.backgroundColor = color;
  redshiftChip.style.background = color;
}

function clampRForOrbit() {
  // If orbit is enabled and r < 1.5 Rs, push slider to 1.5 Rs
  if (useOrbit && rRS < 1.5) {
    rRS = 1.5;
    radiusSlider.value = String(rRS);
  }
}

//  Event wiring 
radiusSlider.addEventListener("input", () => {
  rRS = parseFloat(radiusSlider.value);
  clampRForOrbit();
  radiusValue.textContent = rRS.toFixed(5);
  updateReadouts();
  updatePlanetPosition();
});

orbitToggle.addEventListener("change", () => {
  useOrbit = orbitToggle.checked;
  clampRForOrbit();
  radiusValue.textContent = rRS.toFixed(5);
  updateReadouts();
  updatePlanetPosition();
});

resetBtn.addEventListener("click", () => {
  tauFar = 0;
  tauNear = 0;
  lastFrame = null; 
});

// Info panel
infoBtn.addEventListener("click", () => infoPanel.classList.remove("hidden"));
closeInfo.addEventListener("click", () => infoPanel.classList.add("hidden"));

//  Animation loop 
function animate(t) {
  if (lastFrame == null) { lastFrame = t; requestAnimationFrame(animate); return; }
  const dt = (t - lastFrame) / 1000; // seconds
  lastFrame = t;

  // Coordinate time at infinity ~ wall clock; far clock accumulates dt
  tauFar += dt;

  // Near clock accumulates proper time: dτ = dt / γ_total
  const gamma = useOrbit ? gammaOrbitTotal(rMeters) : gammaStatic(rMeters);
  const dTauNear = (!isFinite(gamma) || gamma <= 0) ? 0 : dt / gamma;
  tauNear += dTauNear;

  // Render clocks
  clockFar.textContent = secondsToHMS(tauFar);
  clockNear.textContent = secondsToHMS(tauNear);

  requestAnimationFrame(animate);
}

//  Init 
(function init() {
  radiusValue.textContent = rRS.toFixed(5);
  updateReadouts();
  updatePlanetPosition();
  requestAnimationFrame(animate);
})();
