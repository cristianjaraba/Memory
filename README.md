# Memory

A memory game (card matching) for two players, built as a web app with
TypeScript, semantic HTML and SCSS. Retraining project.

Two players share one screen and take turns. Whoever turns over a matching
pair scores a point and stays on turn; a wrong guess hands the turn to the
other player. The round ends when the last pair is off the board.

## Getting started

Requires Node.js 18 or newer (developed on Node 24).

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # type check, then bundle into dist/
npm run preview  # serve the built dist/ locally
```

## Playing a round

1. **Home** &mdash; the play button leads to the settings.
2. **Settings** &mdash; pick a theme, a player colour and a board size. All
   three are needed before the summary panel can be uncovered, and only an
   uncovered panel releases the start button.
3. **Board** &mdash; score, the player on turn and an exit button sit above
   the cards. A card turns over on click; a pair stays face up, a wrong
   guess turns back after a moment.
4. **Result** &mdash; won, lost or drawn, with the final score of both
   players and a way back to the start.

### What can be picked

| Setting | Options |
| --- | --- |
| Theme | Gaming, Foods |
| Player colour | Blue, Orange |
| Board size | 4x4 (16 cards), 6x4 (24 cards), 6x6 (36 cards) |

The theme drives both the colour scheme and the subject area of the card
motifs, and it carries through to the board, the exit dialog and the result
screen.

## Project layout

```
index.html              single page, one <section> per screen
public/
  assets/               fonts, card motifs, icons
  favicon.svg           and the raster fallbacks beside it
src/
  main.ts               entry point, wires the modules together
  navigation.ts         shows one screen, hides the rest
  settings-form.ts      reads the picks, drives the summary panel
  board.ts              lays out the cards, handles the flipping
  card-themes.ts        the motifs of each theme
  scoreboard.ts         points and whose turn it is
  quit-dialog.ts        the "are you sure" before giving up a round
  result-screen.ts      the closing screen
  styles/
    style.scss          only pulls the partials in
    tokens/             colours, type, sizes
    components/         one partial per screen or component
```

Eight TypeScript modules, around 930 lines in total, and 24 SCSS partials
behind a single `style.scss`. No runtime dependencies &mdash; Vite and Sass
are build tools only.

## Conventions

The house rules live in [CLAUDE.md](CLAUDE.md): file size limits, naming,
formatting and the documentation style. In short, every module opens with an
`@file` block and every function carries TSDoc, with `@param`, `@returns` and
`@typeParam` where they apply.

## Extras beyond the requirements

Notes for the mentors &mdash; things that were not asked for:

- **Exit confirmation.** The exit button opens a modal dialog instead of
  leaving the round straight away. It closes on Escape or on a click beside
  the sheet, and each theme words its two answers in its own way.
- **Draw screen.** The brief only asks for a winner; an equal score gets its
  own closing screen.
- **Reduced motion.** Animations are skipped where the system asks for it
  (`prefers-reduced-motion`), in the dialog, the result screen and the
  settings panel.
- **Covered summary panel.** The settings screen keeps the picks hidden
  behind a cover until all three are in, which keeps the start button from
  being pressed on an unfinished round.
- **Favicon that follows the tab bar.** An SVG favicon swaps its two colours
  under `prefers-color-scheme`, because the dark tile of the app is nearly
  the colour of a dark tab bar. A hand built `.ico` plus an
  `apple-touch-icon` and a `mask-icon` cover Safari and iOS, which take no
  SVG icon.
- **Mobile first.** Every screen is laid out from 320px up.
- **Self hosted fonts.** Nine WOFF2 faces are served from `assets/fonts/`
  with `font-display: swap`, so no request leaves for a font CDN.
- **Accessibility.** Semantic sections, a card's position announced through
  `aria-label`, the turn marker labelled for screen readers, and decorative
  icons hidden from them.

## Deployment

The site is served from a subfolder, so `vite.config.ts` sets
`base: '/Memory/'`. Run `npm run build` and upload the contents of `dist/`
into the `Memory` folder on the server.
