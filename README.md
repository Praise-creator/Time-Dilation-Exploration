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

## ⚛️ Physics Overview

⚛️ Physics Overview
We assume a Schwarzschild (non-spinning) black hole with mass MM
M. The
Schwarzschild radius is
Rs=2GMc2R_s = \frac{2GM}{c^2}
Rs​=c22GM​
In the UI, you set rr
r in units of RsR_s
Rs​ (i.e., r=(slider)⋅Rsr = (\text{slider}) \cdot R_s
r=(slider)⋅Rs​). A far-away observer's coordinate time is tt
t; a local clock's proper time is τ\tau
τ.

1) Gravitational time dilation (static emitter)
For a clock hovering (static) at radius rr
r,

 γstatic(r)=dtdτ=11−Rsr \boxed{\ \gamma_{\text{static}}(r) = \frac{dt}{d\tau} = \frac{1}{\sqrt{1-\frac{R_s}{r}}}\ }
 γstatic​(r)=dτdt​=1−rRs​​​1​ ​
and the local clock ticks as dτ=dt/γstaticd\tau = dt / \gamma_{\text{static}}
dτ=dt/γstatic​.

2) Gravitational redshift (static emitter)
Light sent from radius rr
r to infinity is redshifted by

 1+zstatic(r)=γstatic(r)=11−Rsr ⇒zstatic=γstatic−1\boxed{\ 1 + z_{\text{static}}(r) = \gamma_{\text{static}}(r) = \frac{1}{\sqrt{1-\frac{R_s}{r}}}\ } \quad\Rightarrow\quad z_{\text{static}} = \gamma_{\text{static}} - 1
 1+zstatic​(r)=γstatic​(r)=1−rRs​​​1​ ​⇒zstatic​=γstatic​−1
We map zz
z to a color so the planet grows redder as it approaches the black hole.

3) Circular orbits (total time dilation vs. infinity)
For a circular geodesic at radius rr
r in Schwarzschild spacetime (equatorial plane), the
total time-dilation factor (gravity + velocity) relative to infinity is
 γorbit(r)=dtdτ=11−3Rs2r \boxed{\ \gamma_{\text{orbit}}(r) = \frac{dt}{d\tau} = \frac{1}{\sqrt{1 - \frac{3R_s}{2r}}}\ }
 γorbit​(r)=dτdt​=1−2r3Rs​​​1​ ​
Existence & stability

No timelike circular orbits for r≤32Rsr \le \tfrac{3}{2}R_s
r≤23​Rs​ (the
photon sphere).
Unstable circular orbits for 32Rs<r<3Rs\tfrac{3}{2}R_s < r < 3R_s
23​Rs​<r<3Rs​.

Stable circular orbits for r≥3Rsr \ge 3R_s
r≥3Rs​ (ISCO at 3Rs3R_s
3Rs​).


When orbit mode is ON, the Near Clock uses dτ=dt/γorbitd\tau = dt / \gamma_{\text{orbit}}
dτ=dt/γorbit​, and the redshift readout uses z≈γorbit−1z \approx \gamma_{\text{orbit}} - 1
z≈γorbit​−1 as a
phase-averaged proxy (see note below).
4) Local orbital speed vv
v as seen by a hovering observer

A static (hovering) observer at the same rr
r measures the orbiting object's local speed as

 βlocal2≡(vc)2=Rs2r1−Rsr ⇒βlocal=Rs2r(1−Rsr)\boxed{\ \beta_{\text{local}}^2 \equiv \left(\frac{v}{c}\right)^2 = \frac{\dfrac{R_s}{2r}}{1 - \dfrac{R_s}{r}}\ } \quad\Rightarrow\quad \beta_{\text{local}} = \sqrt{\frac{R_s}{2r\left(1-\frac{R_s}{r}\right)}}
 βlocal2​≡(cv​)2=1−rRs​​2rRs​​​ ​⇒βlocal​=2r(1−rRs​​)Rs​​​
This is shown as v/cv/c
v/c in the UI when orbit mode is ON.

5) About orbital redshift & Doppler
A moving source also produces special-relativistic Doppler shifts that depend on the viewing angle and orbital phase. To keep the UI intuitive, we present a phase-averaged redshift using the same total factor:
zorbit,avg(r)≈γorbit(r)−1z_{\text{orbit,avg}}(r) \approx \gamma_{\text{orbit}}(r) - 1
zorbit,avg​(r)≈γorbit​(r)−1
