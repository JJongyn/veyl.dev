# veyl.dev — integration guide

Twelve original procedural forms for real AI activity. Use an orb as a compact, recognizable signal alongside useful text. The gallery preview and downloadable component share `src/veyl.js`.

## Install

Install the published package and import it once from a client-side entry point:

```bash
npm install veyl.dev
```

```js
import 'veyl.dev';
```

The import registers the `<veyl-signal>` custom element. For plain HTML without a bundler, download `src/veyl.js` and load it directly:

```html
<script src="./veyl.js"></script>
<div role="status">
  <veyl-signal state="thinking" variant="reactor" size="32" aria-hidden="true"></veyl-signal>
  <span>Thinking through your request</span>
</div>
```

## API

| Attribute | Default | Values / meaning |
| --- | --- | --- |
| `state` | `thinking` | `thinking`, `searching`, `listening`, `composing`, `connecting`, `complete` |
| `variant` | `auto` | `auto`, `fold`, `trace`, `tide`, `loom`, `link`, `bloom`, `reactor`, `gyre`, `prism`, `echo`, `helix`, `rift` |
| `size` | `160` | Number of CSS pixels, clamped to 16–800 |
| `speed` | `1` | Motion clock multiplier, 0–3 |
| `intensity` | `0.8` | Geometric deformation, 0–1.5 |
| `theme` | `dark` | `dark` uses luminous strands; `light` uses deeper pigments |
| `color` | Variant palette | Optional six-digit hex color (`#88ccaa`) |
| `label` | State label | Accessible name; use host status text when possible |
| `paused` | Absent | Boolean attribute. Presence pauses motion, even `paused="false"`. Remove it to play. |
| `interactive` | Absent | Optional pointer-driven tilt |

`state`, `variant`, `size`, `speed`, `intensity`, and `paused` are also element properties. The `VeylSignalElement` interface in `types/index.d.ts` describes them.

```js
const orb = document.querySelector('veyl-signal');
orb.state = 'searching';
orb.variant = 'echo';
orb.speed = 0.7;
orb.paused = true;
orb.paused = false;
```

`state` supplies the semantic activity and accessible name. `variant` selects appearance independently. With `variant="auto"`, state maps to Fold, Trace, Tide, Loom, Link, or Bloom. Explicit variants retain their geometry when only the state changes; update both if the host wants a new visual form. Variant transitions interpolate strand positions and blend in structural surfaces. Motion uses elapsed time rather than frame count.

Field systems add distinct rendering techniques: Reactor has separated containment plates, Gyre has three articulated rings, Prism uses crystalline facets, Echo scans a point cloud, Helix links twin signal paths, and Rift has a dark aperture with warped surrounding paths. All forms support light surfaces, small sizes, pause, speed, and reduced motion. `intensity` controls each form's relevant cue: surface displacement, articulation, crystal motion, scan range, strand radius, or field warping.

## React / SSR

Load the component in the browser, never during server rendering. Import `veyl.dev` from a client-only entry point; if your framework evaluates modules on the server, dynamically import it after mount.

```jsx
'use client';
import { useEffect } from 'react';

export function Activity({ state = 'thinking', label = 'Thinking' }) {
  useEffect(() => { import('veyl.dev'); }, []);
  return (
    <div role="status">
      <veyl-signal state={state} variant="reactor" size="32" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
```

For TypeScript, augment the host framework's JSX intrinsic-elements types for `veyl-signal` according to the installed React version. The global HTMLElement map is provided in `types/index.d.ts`.

## Vue

Import the runtime on the client. Configure Vue's compiler to recognize `veyl-signal` as a custom element. In Vite:

```js
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'veyl-signal'
      }
    }
  })]
});
```

Import `veyl.dev` from the client entry point, then bind the state:

```html
<veyl-signal :state="agentState" variant="reactor" size="32" aria-hidden="true"></veyl-signal>
```

Because HTML attributes are strings, this works for ordinary names and numeric sizes. For richer property values, select the element and assign its properties after mount.

## State and accessibility

The host supplies actual activity. These visual components never start tools, infer completion, request microphone access, or fabricate progress. Tide uses synthetic waves; it is not a microphone meter. Pair an orb with explicit text and a host `role="status"` region. Hide the decorative orb from assistive technology when adjacent text already names its state. Otherwise its default `role="img"` and accessible label describe it without announcing animation frames.

All controls in the gallery are keyboard-operable. Under `prefers-reduced-motion: reduce`, orbs show a static frame; state changes update immediately. Do not override that user preference.

## Performance and lifecycle

A shared animation scheduler serves all instances. IntersectionObserver prevents offscreen redraws, document visibility suspends work, ResizeObserver sizes the canvas, and disconnected elements release their observers. Pixel density is capped at 2×. Compact sizes use fewer strands and points. Use a small number of large simultaneous instances; profile within your host application's performance budget.

Use 24px for inline labels, 64px for avatars, and 160–280px for deliberate presentation. Keep the high contrast light/dark variant aligned with the surface. The art is generated entirely in code, with no image/video assets and no runtime dependencies.
