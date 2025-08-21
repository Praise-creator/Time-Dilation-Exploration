# Black Hole Time Dilation & Redshift Explorer

> **Preface.** I’m not a physics student and I don’t fully understand every concept here. This project is my way of learning by building. If you spot mistakes, have insight, or ideas to improve the explanation or the code, please open an issue or PR.  
> **Thank you for checking this out!** 🙏🏿

---

## 🌌 What is this?

An interactive, browser-based demo showing how **time** and **light** behave near a non-spinning black hole.  
You control the radius \(r\) (in units of the Schwarzschild radius \(R_s\)) with a slider:

- A **Near Clock** (on a planet near the black hole) ticks slower than a **Far Clock** (observer at infinity).
- The planet’s **color shifts** toward red as gravitational redshift grows.
- Optional **orbit mode** adds the time-dilation effect of a circular orbit (gravity **+** velocity).

Inspired by the “Miller’s Planet” sequence in *Interstellar*.

---

## 🖼️ Features

- **Big black hole** (simple black disk) and **tiny blue planet** that slides along a track with the radius slider.
- **Two clocks**: Far vs Near, updating in real time according to the chosen \(r\).
- **Live readouts**: \(R_s\), \(r\), total time-dilation factor \(\gamma\), redshift \(z\), and (in orbit mode) local \(v/c\).
- **Redshift visualization**: planet (and a color chip) shift from blue → red as \(z\) increases.
- **Orbit mode (optional)**: uses the GR circular-orbit formula for total time dilation.
- **Reset** button for clocks.
- **Info panel** - self explanatory.

---

## 🚀 Quickstart

1. Clone/download this repo.
2. Open `index.html` in a modern browser. (No build step, no npm—just vanilla HTML/CSS/JS.)
3. Drag the **Radius** slider. Watch the Near Clock change and the planet color shift.
4. Toggle **Include orbital motion** to add velocity time dilation for circular orbits.

---

## 🎛️ Controls

- **Radius (r / Rₛ)** — distance from the black hole in units of \(R_s\).  
  Moves the planet horizontally in the scene and drives all physics.
- **Include orbital motion (circular orbit)** — when ON, uses the total GR time-dilation factor for circular geodesics.
  - Shows **Stable / Unstable / No circular orbit** badges depending on \(r\).
  - Displays **\(v/c\)** (local orbital speed as seen by a hovering observer at the same \(r\)).
- **Reset clocks** — sets both clocks to 00:00:00.
- **Info (i)** — opens an explanation panel.

---

#### Todo - write physics blurb
