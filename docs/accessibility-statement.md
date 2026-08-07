# Accessibility Statement — KushCloud

**Last updated:** July 12, 2026

## Our Commitment

KushCloud is committed to making our game accessible to the widest possible audience, including people with disabilities. We aim to conform to WCAG 2.2 Level AA guidelines where technically feasible.

## Accessibility Features

KushCloud currently includes:

- **Reduced motion mode** — disables screen shake and reduces animations for users with motion sensitivities
- **High contrast mode** — increases visual contrast for better visibility
- **Keyboard controls** — Space, Up arrow, or W to flap during gameplay; Tab to navigate menus; Escape/P to pause
- **Screen reader support** — ARIA labels on interactive elements, live regions for toast notifications, and semantic HTML structure
- **Focus indicators** — visible focus rings on all interactive elements for keyboard users
- **Responsive design** — scales across desktop and mobile devices

## Known Limitations

As a Canvas-based game, some accessibility challenges remain:

- The game canvas itself is not accessible to screen readers. Game action (obstacle positions, character movement) cannot be described via assistive technology.
- The game requires rapid reflexes and precise timing, which may be challenging for some users.
- High-contrast and reduced-motion modes improve visual accessibility but do not provide a fully accessible alternative experience.

## Target Compliance Level

We target **WCAG 2.2 Level AA** for all non-game-canvas content (menus, settings, shop, leaderboard).

## Feedback

We welcome accessibility feedback. If you encounter barriers while using KushCloud, please open an issue:  
[https://github.com/DLinacre/KushCloud/issues](https://github.com/DLinacre/KushCloud/issues)

## Technical Specifications

- Built with React 19, TypeScript, and Tailwind CSS 4
- Tested on Chrome, Firefox, Safari, and Edge
- Responsive design for mobile and desktop
- Zero external image/audio assets (all rendered via Canvas and Web Audio API)
