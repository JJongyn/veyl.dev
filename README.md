# veyl.dev

**A signal from the near future.** Twelve procedural Web Components that give real AI activity a distinct visual presence.

<p align="center">
  <img src="https://raw.githubusercontent.com/JJongyn/veyl.dev/master/assets/veyl-echo.gif" alt="Echo, Veyl's live signal orb scanning through a field of points" width="100%">
</p>

<p align="center"><em>Echo · scanning a field of signals · rendered live in Canvas 2D</em></p>

<p align="center">
  <a href="https://www.npmjs.com/package/veyl.dev"><img src="https://img.shields.io/npm/v/veyl.dev?color=c7e8a6&label=npm" alt="npm version"></a>
  <img src="https://img.shields.io/badge/runtime_dependencies-none-202522.svg" alt="No runtime dependencies">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-c7e8a6.svg" alt="MIT License"></a>
</p>

## In a real interface

Veyl is designed to sit beside the status text your product already provides. The host application owns the activity; the orb gives it a visual form.

<p align="center">
  <img src="https://raw.githubusercontent.com/JJongyn/veyl.dev/master/assets/veyl-in-context.png" alt="Veyl signal orbs beside assistant response and activity text in a chat interface" width="560">
</p>

*Example conversation UI with composing and thinking signals. Connect `state` to your app's actual agent status; the component does not run or infer agent work.*

## Install

```bash
npm install veyl.dev
```

Import the custom element once from your app's client entry point:

```js
import 'veyl.dev';
```

Then use it anywhere in your HTML or framework template:

```html
<div role="status" aria-live="polite">
  <veyl-signal state="searching" variant="echo" size="32" aria-hidden="true"></veyl-signal>
  <span>Searching the web for useful sources</span>
</div>
```

Veyl registers the `<veyl-signal>` custom element as an import side effect. In SSR frameworks, load it only in the browser/client entry point. For a no-bundler HTML setup, download [`src/veyl.js`](src/veyl.js) and load it with `<script src="./veyl.js"></script>`.

## Why Veyl

- **Twelve distinct forms:** six field systems and six filament forms, each with its own motion and geometry.
- **Meaningful states:** `thinking`, `searching`, `listening`, `composing`, `connecting`, and `complete` map to real work in your application.
- **Independent appearance:** pick a `variant` without changing what the state means.
- **Native and lightweight:** Canvas 2D Web Component, no runtime dependencies, no remote assets.
- **Considerate motion:** supports reduced-motion preferences and pauses when hidden or offscreen.

## Choose a form

| Family | Form | Character |
| --- | --- | --- |
| Field system | Reactor | Segmented containment plates around a radiant core |
| Field system | Gyre | Three independently articulated gimbals |
| Field system | Prism | A translucent, nested crystal |
| Field system | Echo | A scanning plane moving through sampled points |
| Field system | Helix | Two signal paths joined by pulsing rungs |
| Field system | Rift | Warped paths surrounding a dark aperture |
| Filament | Fold | Thoughtful, folding spherical shells |
| Filament | Trace | Tilted orbital paths around an open center |
| Filament | Tide | A gently displaced, breathing membrane |
| Filament | Loom | Fine fibers woven into a toroidal form |
| Filament | Link | Paired fields bridged by connecting strands |
| Filament | Bloom | A seven-lobed form resolving into a center |

<p align="center">
  <img src="https://raw.githubusercontent.com/JJongyn/veyl.dev/master/assets/veyl-collection.jpg" alt="Twelve Veyl signal forms across field systems and filament families" width="560">
</p>

## States and variants

`state` describes what the host app is doing. `variant` chooses the visual form. Keep those roles separate so the interface stays truthful and understandable.

| `state` | Use it when | `auto` form |
| --- | --- | --- |
| `thinking` | The agent is reasoning or preparing an answer | Fold |
| `searching` | The agent is retrieving or exploring information | Trace |
| `listening` | The product is awaiting or processing user input | Tide |
| `composing` | The agent is forming a response | Loom |
| `connecting` | The agent is coordinating tools or joining information | Link |
| `complete` | The task has finished | Bloom |

```html
<veyl-signal
  state="composing"
  variant="prism"
  size="64"
  speed="1.2"
  intensity="0.8"
  theme="dark"
></veyl-signal>
```

| Attribute | Values | Default | Purpose |
| --- | --- | --- | --- |
| `state` | `thinking`, `searching`, `listening`, `composing`, `connecting`, `complete` | `thinking` | Semantic activity supplied by your app |
| `variant` | `auto` or any of the 12 lowercase form names | `auto` | Visual identity, independent of activity |
| `size` | `16`–`800` CSS pixels | `160` | Rendered diameter |
| `speed` | `0`–`3` | `1` | Motion rate |
| `intensity` | `0`–`1.5` | `0.8` | Strength of the form's movement |
| `theme` | `dark`, `light` | `dark` | Contrast for the surrounding surface |
| `color` | Six-digit hex, e.g. `#88ccaa` | Form palette | Accent color override |
| `paused` | Boolean attribute | Off | Pause while preserving the current frame |
| `interactive` | Boolean attribute | Off | Enable pointer-driven tilt |

The element also exposes properties for state, variant, size, speed, intensity, and paused. TypeScript element types are included in the package.

## Framework notes

### React

Import once from a client-only module (or use a client-side effect when your framework renders on the server):

```jsx
'use client';
import 'veyl.dev';

export function AgentStatus({ state, label }) {
  return (
    <div role="status" aria-live="polite">
      <veyl-signal state={state} variant="echo" size="32" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
```

### Vue

Import `veyl.dev` in the client entry and configure Vue to treat `veyl-signal` as a custom element:

```js
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue({
    template: { compilerOptions: { isCustomElement: (tag) => tag === 'veyl-signal' } }
  })]
});
```

```html
<veyl-signal :state="agentState" variant="echo" size="32" aria-hidden="true"></veyl-signal>
```

## Accessibility and behavior

- Keep visible status text; the orb is a supporting visual, not a replacement for useful feedback.
- Bind `state` to actual application activity. Veyl does not start tools, infer completion, or fabricate progress.
- `listening` is a synthetic visual form. It does not request microphone access or analyze audio.
- Hide the orb from assistive technology with `aria-hidden="true"` when nearby text already names the activity. Otherwise it exposes an image role and accessible label.
- Respects `prefers-reduced-motion`, suspends redraw while offscreen or when the document is hidden, and releases observers when removed.

## Explore the gallery

```bash
git clone https://github.com/JJongyn/veyl.dev.git
cd veyl.dev
npm run dev
```

Open <http://localhost:4174> to explore all twelve forms and the live playground. The gallery itself has no build step.

- [Integration guide](veyl.md)
- [Quick start example](examples/quick-start.html)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT. See [LICENSE](LICENSE).

Inspired by [Libraries.dev Orbs](https://libraries.dev/orbs). Veyl's identity, page design, geometry, renderer, and code are original; no Libraries.dev code or assets are included.
