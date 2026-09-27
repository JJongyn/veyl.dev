# veyl.dev

**Give real AI activity a living signal.** Twelve procedural forms for the moments between a request and an answer.

<p align="center">
  <a href="https://jjongyn.github.io/veyl.dev/">Live gallery</a> ·
  <a href="https://www.npmjs.com/package/veyl.dev">npm</a> ·
  <a href="https://github.com/JJongyn/veyl.dev">GitHub</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/veyl.dev"><img src="https://img.shields.io/npm/v/veyl.dev?color=c7e8a6&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/veyl.dev"><img src="https://img.shields.io/npm/dm/veyl.dev?color=202522&label=downloads" alt="monthly npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-c7e8a6.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/runtime_dependencies-none-202522.svg" alt="No runtime dependencies">
</p>

## Install

```bash
npm install veyl.dev
```

## Quick start

Import Veyl once from your client entry point:

```js
import 'veyl.dev';
```

Add the element beside the status text your app already provides:

```html
<div role="status" aria-live="polite">
  <veyl-signal state="searching" variant="echo" size="32" aria-hidden="true"></veyl-signal>
  <span>Searching for useful sources</span>
</div>
```

Veyl registers the native `<veyl-signal>` custom element. For SSR frameworks, import it on the client only. Plain HTML projects can [download the standalone component](src/veyl.js) instead.

## The signals

<p align="center">
  <img src="https://raw.githubusercontent.com/JJongyn/veyl.dev/master/assets/veyl-echo.gif" alt="Echo scanning a field of signals, rendered live in Canvas 2D" width="760">
</p>

<p align="center"><em>Echo · a live scan through a field of signals</em></p>

Choose a visual form with `variant`; use `state` to describe what your agent is actually doing.

| Family | Forms |
| --- | --- |
| Field systems | Reactor · Gyre · Prism · Echo · Helix · Rift |
| Filaments | Fold · Trace · Tide · Loom · Link · Bloom |

`variant="auto"` maps the six activity states to Fold, Trace, Tide, Loom, Link, and Bloom. Choose any named variant to keep a specific visual identity across state changes.

## Use it in a conversation

Veyl sits alongside your existing interface and status text. Your app owns the conversation and activity; the signal adds a visual cue.

<p align="center">
  <img src="https://raw.githubusercontent.com/JJongyn/veyl.dev/master/assets/veyl-in-context.png" alt="Veyl signals beside assistant response and activity text in a chat interface" width="520">
</p>

*Illustrative chat UI. Connect `state` to your app's real agent status; Veyl does not run an agent or infer progress.*

## Connect real agent state

Update the element when your existing agent state changes:

```js
const signal = document.querySelector('veyl-signal');

function onAgentStatus(status) {
  signal.state = status; // thinking, searching, listening, composing, connecting, complete
}
```

The six states describe activity. The twelve variants describe appearance. Keeping those separate lets the visual style change without changing what the status means.

## Customize

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

| Attribute | Values | Default |
| --- | --- | --- |
| `state` | `thinking`, `searching`, `listening`, `composing`, `connecting`, `complete` | `thinking` |
| `variant` | `auto` or any of the 12 form names | `auto` |
| `size` | `16`–`800` CSS pixels | `160` |
| `speed` | `0`–`3` | `1` |
| `intensity` | `0`–`1.5` | `0.8` |
| `theme` | `dark`, `light` | `dark` |
| `color` | Hex color, e.g. `#88ccaa` | Form palette |
| `paused` | Boolean attribute | Off |
| `interactive` | Boolean attribute | Off |

## Frameworks and full API

Veyl works with HTML, React, Vue, and other frameworks that support custom elements. Find client-only framework examples, TypeScript declarations, accessibility guidance, lifecycle behavior, and the complete API in the [integration guide](veyl.md).

## Design principles

- **Real state only.** Veyl visualizes activity supplied by your app. It does not start tools or fabricate progress.
- **Useful beside text.** Keep status copy visible; the signal complements it.
- **Motion with care.** Respects `prefers-reduced-motion` and pauses when hidden or offscreen.
- **No runtime dependencies.** Native Web Components and Canvas 2D; no framework runtime or remote rendering assets.

## Gallery

Explore and customize every form in the [live gallery](https://jjongyn.github.io/veyl.dev/), or run it locally:

```bash
git clone https://github.com/JJongyn/veyl.dev.git
cd veyl.dev
npm run dev
```

## Contributing

Ideas, issues, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © JJongyn. See [LICENSE](LICENSE).
