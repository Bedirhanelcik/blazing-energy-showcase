/**
 * Blazing Energy — Representative Source Example
 * ------------------------------------------------------------------------------------------------
 * This is NOT the project source. It is a small, deliberately simplified sketch that shows the shape
 * of the approach used in the real experience: a Three.js scene, a studio-style light rig, a ring of
 * products laid out around a centre slot, and a spring-damped scroll that commits to one product at a
 * time instead of tracking the wheel directly.
 *
 * What the real implementation adds, and what is kept private:
 *   - the actual product model, printed artwork and HDR environment
 *   - the custom background shader (layered atmosphere, key-light shaft, vignette)
 *   - the per-can material injection that splits lighting into independent key / fill / rim channels
 *   - the particle system, the product-detail camera work and the page transitions
 *
 * Runnable as-is with three.js r163+ for illustration only.
 */

import * as THREE from 'three';

/* ------------------------------------------------------------------ setup */

const RANGE = [
  { name: 'Original', color: 0xdde1e7 },
  { name: 'Cherry',   color: 0xb00c22 },
  { name: 'Ice',      color: 0x1592c4 },
  { name: 'Tropical', color: 0xc98a12 },
];

const canvas = document.querySelector('#stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;   // filmic roll-off keeps highlights from clipping
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 200);   // a long lens flattens the fan of products
camera.position.set(0, 0.4, 22);

/* ------------------------------------------------------------- light rig */

// A key from the front left, two rims behind, and a large soft box overhead. The real project drives
// the colour of each of these from the active flavour every frame.
const key = new THREE.SpotLight(0xffffff, 240, 0, 0.21, 0.9, 2);
key.position.set(0, 8, 7);
scene.add(key, key.target);

const rimL = new THREE.SpotLight(0xffffff, 110, 0, 0.42, 0.8, 2);
rimL.position.set(-5.5, 2.5, -6);
const rimR = new THREE.SpotLight(0xffffff, 120, 0, 0.42, 0.8, 2);
rimR.position.set(5.5, 1.5, -6);
scene.add(rimL, rimL.target, rimR, rimR.target);

/* ---------------------------------------------------------------- products */

// Stand-in geometry. The real scene loads a glTF can and bakes one shared printed artwork onto it.
const geometry = new THREE.CylinderGeometry(0.62, 0.62, 3.2, 48, 1);
const RADIUS = 7.2;
const STEP = (Math.PI * 2) / RANGE.length;

const products = RANGE.map(({ color }, i) => {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.24 }),
  );
  scene.add(mesh);
  return { mesh, index: i };
});

/* --------------------------------------------------------------- layout */

const mod = (n, m) => ((n % m) + m) % m;
const wrap = (v, min, max) => mod(v - min, max - min) + min;
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Place every product for the current carousel position.
 *
 * `slot` is a product's signed distance from the centre, so it is 0 for the hero and grows either way.
 * Everything else — depth, scale, how much light it gets — is a function of that one number, which is
 * what lets the whole display slide continuously instead of snapping between states.
 */
function layout(position) {
  for (const { mesh, index } of products) {
    const slot = wrap(index - position, -RANGE.length / 2, RANGE.length / 2);
    const angle = slot * STEP;
    const distance = Math.abs(slot);
    const heroness = Math.exp(-distance * distance * 2.8);   // 1 at the centre, falling away fast

    mesh.position.set(
      RADIUS * Math.sin(angle),
      0.22 * heroness,
      RADIUS * 0.42 * (Math.cos(angle) - 1) + 1.5 * heroness,   // the hero stands forward of the ring
    );
    mesh.rotation.z = 0.16 + 0.34 * Math.sin(angle);
    mesh.scale.setScalar(0.92 + 0.25 * heroness);

    // In the real project this is where the lighting hierarchy is applied: key, fill, rim, environment
    // and a hero-only specular each fall off at their own rate, so a side product loses the key light
    // long before it loses its colour or its silhouette. Here it is just a single dimmer.
    mesh.material.emissiveIntensity = 0;
    mesh.material.envMapIntensity = 0.14 + 1.52 * Math.exp(-distance * distance * 0.85);
  }
}

/* ------------------------------------------------------- scroll interaction */

// The interaction idea worth showing: the wheel does not move the carousel directly. A gesture leans
// the display toward the next product and only commits once it has covered enough travel — under that
// threshold it springs back to where it started, so a stray trackpad nudge never changes product.
const TRAVEL = 820;   // px of trackpad travel that equals one product
const COMMIT = 0.42;  // share of one product a gesture must cover to count

const state = { position: 0, target: 0, velocity: 0, base: 0, sum: 0, last: 0 };
let settle;

addEventListener('wheel', (event) => {
  event.preventDefault();
  const now = performance.now();

  // events more than 350 ms apart belong to separate gestures
  if (now - state.last > 350) { state.base = Math.round(state.target); state.sum = 0; }
  state.last = now;

  state.sum += event.deltaY;
  const ratio = Math.max(-1.8, Math.min(1.8, state.sum / TRAVEL));
  state.target = state.base + ratio * 0.66;   // geared short of a full step: this is a lean, not a move

  clearTimeout(settle);
  settle = setTimeout(() => {
    const travelled = Math.abs(ratio);
    const steps = travelled < COMMIT ? 0 : travelled < 1.6 ? 1 : 2;
    state.target = state.base + Math.sign(ratio) * steps;
    state.last = 0;
  }, 170);
}, { passive: false });

/* ------------------------------------------------------------------ loop */

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  if (canvas.width === w && canvas.height === h) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

let previous = performance.now();

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - previous) / 1000);
  previous = now;

  // Critically damped spring: quick to settle, and it never overshoots the product it is landing on.
  const K = 31, C = 2 * Math.sqrt(K);
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  for (let i = 0; i < steps; i++) {
    const h = dt / steps;
    state.velocity += (K * (state.target - state.position) - C * state.velocity) * h;
    state.position += state.velocity * h;
  }

  resize();
  layout(state.position);
  camera.lookAt(0, lerp(-0.06, 0, 0), 0);
  renderer.render(scene, camera);
}

requestAnimationFrame(frame);
