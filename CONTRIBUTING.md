# Contributing to veyl.dev

Thanks for helping improve Veyl. Issues and pull requests are welcome.

## Before opening an issue

- Search existing issues for the same bug or request.
- For a rendering bug, include the browser and OS, `variant`, `state`, `size`, `speed`, and `intensity` values, and whether reduced motion is enabled.
- Attach a screenshot or short recording when the result is visual. Do not include private user data.

## Make a change

1. Fork the repository and create a focused branch.
2. Keep the renderer dependency-free and preserve direct `file://` and static-server use.
3. Keep status meaning truthful: the host app owns agent state; Veyl only renders it.
4. Respect accessible labels, keyboard use, and `prefers-reduced-motion`.
5. Preview visual changes in `index.html` and in `examples/quick-start.html`.
6. Describe the behavior change and include before/after screenshots for visual updates.

The gallery can be served with `python3 -m http.server 4174`. No dependency installation is required for this source project.

## Pull requests

Keep each pull request focused. Explain the problem, the change, and how you reviewed it. Please do not bundle unrelated formatting or generated files.

By contributing, you agree that your contributions are released under the project's MIT License.
