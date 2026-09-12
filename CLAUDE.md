# Project: Memory

A memory game (card matching game) as a web app. Retraining project.

## Tech stack

- TypeScript
- HTML (semantic, accessible)
- SCSS

## User stories / requirements

### 1. Home screen
- Landing page with a clear visual hierarchy (logo/title, start button clearly visible and centred)
- Start button leads to the settings page
- Controller icon with an animation (e.g. hover or idle animation), sensibly placed in the layout (e.g. next to the title or the button)

### 2. Settings
- Choice of player colour: 2 options (e.g. blue / orange)
- Choice of board size: 4x4 / 4x6 / 6x6
- Choice of theme: at least 2 themes selectable (more are optional)

### 3. Layouts
- At least 2 different layouts selectable
- The layout choice changes the colour scheme
- The layout choice drives the subject areas of the memory pictures

### 4. Board / gameplay
- The board matches the chosen size
- The chosen theme shows in both colour and motifs
- Above the board: current score, current player, "Exit Game" button
- Cards turn over on click in a smooth animation

### 5. End of a round
- "Game Over" display with the current score once the round ends
- The player with the most points is shown as the winner
- A way to start a new round

## Code conventions

### File size (applies to every file type)
- No code file longer than 300-400 lines (`.ts`, `.html`, `.scss`, ...)
- If a file grows too long: split the code into sensible modules without asking first
- SCSS: partials per screen/component, `style.scss` only pulls them in
- TypeScript: one module per subject area, `main.ts` only wires them together

### TypeScript - general
- File names in kebab-case (e.g. `user-utils.ts`)
- Max. 14 lines per function
- Use semicolons
- No `any` (where possible) - use the exact type or `unknown` instead
- Variable, function, class and type names in English (no German identifiers)

### TypeScript - naming
- Functions: camelCase (`getUser()`)
- Classes: PascalCase (`UserProfile`)
- Interfaces: PascalCase (`User`)
- Constants: UPPER_CASE (`MAX_RETRIES`)
- Types: PascalCase (`UserID`)

### TypeScript - formatting
- 2 spaces indentation
- Group imports (std, third party, local)
- State types and return values explicitly (`function loadData(): Promise<Data>`)

### TypeScript - comments
- TSDoc for functions and methods (`/** Returns the user. */`)
- Add documentation comments to the codebase using JSDoc style, limited to
  `.js`, `.jsx`, `.ts` and `.tsx` files
- Every file opens with an `@file` block saying what the module is for
- Document every parameter with `@param`, every return value with `@returns`
  and every generic with `@typeParam`. A function that takes no arguments and
  returns nothing keeps its one line description
- Do not repeat the type inside the tag (no `@param {string}`); the signature
  already carries it, and a second copy only goes stale
- Exported types, constants and module level variables are documented too,
  and a TSDoc block belongs to one declaration only: two constants need two
  blocks

### TypeScript - clean code
- One task per function
- No magic numbers (`const MAX_USERS = 100;`)
- Move HTML out instead of writing it inline
- Readable conditions (`if (isUserActive)` instead of `if (x)`)

### HTML - structure and semantics
- Use semantic tags: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- `h1`-`h6` in a sensible hierarchy
- `section` for thematic blocks, `article` for standalone content
- `aside` only for side information, not for layout
- `figure` + `figcaption` for pictures that carry meaning

### HTML - readability and maintainability
- Consistently indented and formatted
- No deep, confusing nesting
- Meaningful names (English)
- Understandable, well kept comments

### HTML - accessibility
- Images with meaningful `alt` texts
- Email addresses with `mailto:`
- Tables with `<caption>` (where it helps) and `<th>` instead of only `<td>` for headings
- Navigation as a list (`<ul>` inside `<nav>`)

### HTML - marking up content
- Highlight what matters with `<strong>` or `<em>`, not only `<b>`/`<i>`
- Inline text structure with `<span>`
- Running text in `<p>`, not in `<div>`

### HTML - validity and standards
- Correct `<!DOCTYPE html>`
- Always set `<html lang="...">`
- `<meta charset="UTF-8">` and `<title>` in the `<head>`
- `index.html` with a favicon

### HTML - best practices
- As few `<div>` as possible, as many as needed (no "div soup")
- Keep structure (HTML) apart from presentation (CSS)
- No lorem ipsum - write your own, creative texts

### Fonts
- No Google Fonts CDN links (no `<link href="https://fonts.googleapis.com/...">`)
- Self host the fonts: download the WOFF2 files from https://gwfh.mranftl.com/fonts and put them in `assets/fonts/`
- Define matching `@font-face` rules in SCSS (e.g. `_fonts.scss`), with `font-display: swap`
- Pull that SCSS file into the main styles instead of linking fonts externally in the `<head>`

## Notes for Claude Code

- Before handing in: walk through all the user stories above as a checklist
- Briefly document extras that go beyond the requirements (for the mentors)
- If a convention is unclear: see the "Code conventions" section above, do not guess
