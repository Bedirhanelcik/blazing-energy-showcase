# Blazing Energy

![Blazing Energy](./screenshot.png)

An experimental, cinematic 3D product experience built with JavaScript and Three.js.

The project explores real-time WebGL product presentation, interactive motion, lighting, transitions and
spatial composition within a browser-based environment. The complete product range is rendered in real
time rather than relying on pre-rendered product imagery.

This is an independent personal concept project and does not represent a real brand or commercial product.

## Live Demo

**[View the live experience](https://blazing-energy.vercel.app/)**

## About

Blazing Energy was developed as an exploration of interactive 3D web experiences and cinematic product
presentation.

The experience combines real-time WebGL rendering with custom interaction and motion systems to create a
product showcase that responds directly to user input.

- Cinematic 3D product presentation using real-time WebGL
- Interactive product navigation through drag, scroll, keyboard and click interactions
- Scroll-driven transitions with a commit threshold and spring-based motion
- Dynamic studio lighting that adapts to the active flavour
- Layered atmospheric backgrounds and depth-sorted particles
- Close-up product presentation and detail interactions
- Responsive layout with keyboard accessibility
- `prefers-reduced-motion` support

## Inspiration

The concept grew from two sources of inspiration: the original Blazing Energy website and a YouTube video
by [Yıldız Dikme](https://github.com/YildizDikme) that first introduced me to the project.

The original website influenced the visual direction, while Yıldız's presentation was what initially
caught my attention and led me to explore the concept further.

From these references, I developed my own interpretation with a different visual system, interaction model,
motion design and implementation.

This repository is an independent project and is not affiliated with or a collaboration with the original creators.

## Tech

- JavaScript
- Three.js
- WebGL / GLSL
- HTML
- CSS

## Representative Source

The complete implementation remains private. This public repository includes a deliberately simplified
representative source example to demonstrate the underlying JavaScript and Three.js approach without
exposing the complete production implementation.

**[`src/example.js`](./src/example.js)** demonstrates:

- Three.js scene and camera setup
- Real-time renderer configuration
- Studio lighting
- Product carousel positioning
- Spring-damped scroll interaction
- Basic interaction handling

The example is intentionally incomplete. The production implementation contains additional systems for
product assets, printed artwork, HDR environments, custom shaders, per-material lighting channels,
particles, transitions and other visual effects that are not included in this repository.

## Credits

- Original website — [Blazing Energy](https://blazing-energy.netlify.app/)
- Video inspiration — [Yıldız Dikme](https://github.com/YildizDikme)
- Can model — "Energy Drink Game Ready Model" by **dwalsh**, licensed under CC BY 4.0
- Noise transition and HDR environment — derived from the **Codrops** `codrops-noise-transition` demo
- Classic Perlin 4D noise (GLSL) — **Stefan Gustavson**
- [three.js](https://github.com/mrdoob/three.js) — MIT License
- Archivo / Geist Mono webfonts — SIL OFL 1.1

The third-party assets listed above belong to the private implementation and are not distributed in this
public repository. The licence terms of the Codrops-derived material were not recorded in the original
source and have not been independently verified.

## Contact

**Bedirhan Elçik**

[GitHub](https://github.com/BedirhanElcik) ·
[Email](mailto:bedrhanelck@outlook.com)

## License

The code published in this repository — `src/example.js` — is released under the [MIT License](LICENSE).

This licence applies only to the original code included in this repository. It does not extend to any
third-party models, artwork, environment maps or shader material referenced under [Credits](#credits).
Those materials remain subject to their respective licences and terms.
