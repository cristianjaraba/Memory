import './styles/style.scss';
import { getThemeMotifs } from './card-themes';

/** Ids of the top level sections, only one of them is visible at a time. */
const SECTION_IDS = ['home', 'settings', 'field'] as const;

/** Radio group of the settings form and the output that mirrors it. */
const SUMMARY_OUTPUTS: Record<string, string> = {
  theme: 'summary-theme',
  'player-color': 'summary-player',
  'board-size': 'summary-board',
};

/** Columns per board size, the number of rows follows from the card count. */
const BOARD_COLUMNS: Record<string, number> = {
  '16': 4,
  '24': 6,
  '36': 6,
};

/** Custom property the board grid reads its column count from. */
const BOARD_COLUMNS_PROPERTY = '--board-columns';

/** Every motif lies on the board twice, that is what makes a pair. */
const CARDS_PER_PAIR = 2;

/** How long a wrong guess stays visible before it is turned back. */
const MISMATCH_DELAY_MS = 900;

type SectionId = (typeof SECTION_IDS)[number];

/** The cards that are face up and still waiting for their partner. */
let openCards: HTMLButtonElement[] = [];

/** While a wrong guess is on show, further clicks are ignored. */
let isBoardLocked = false;

init();

/** Sets the start screen and wires up all event listeners. */
function init(): void {
  showSection('home');
  setupNavigation();
  setupSummary();
  setupCardFlip();
}

/** Shows the given section and hides every other one. */
function showSection(target: SectionId): void {
  SECTION_IDS.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.hidden = id !== target;
    }
  });
}

/** Wires the buttons that lead from one screen to the next. */
function setupNavigation(): void {
  const playButton = document.querySelector<HTMLButtonElement>('.home__play');
  playButton?.addEventListener('click', () => showSection('settings'));

  const startButton = document.querySelector<HTMLButtonElement>('.settings__start');
  startButton?.addEventListener('click', startRound);
}

/** Opens the game board, dressed in the picked theme. */
function startRound(): void {
  applyFieldTheme();
  buildBoard();
  showSection('field');
}

/** Lays out as many cards as the picked board size asks for. */
function buildBoard(): void {
  const board = document.getElementById('board');
  const size = getPickedInput('board-size')?.value;
  const theme = getPickedInput('theme')?.value;
  if (!board || !size || !theme) {
    return;
  }
  board.style.setProperty(BOARD_COLUMNS_PROPERTY, String(BOARD_COLUMNS[size]));
  board.replaceChildren(...createCards(dealMotifs(theme, Number(size))));
  openCards = [];
  isBoardLocked = false;
}

/** Draws the motifs of one round: every pair twice, in random order. */
function dealMotifs(theme: string, cardCount: number): string[] {
  const motifs = getThemeMotifs(theme);
  const pairs = shuffle(motifs).slice(0, cardCount / CARDS_PER_PAIR);
  return shuffle([...pairs, ...pairs]);
}

/** Returns a shuffled copy of the given list (Fisher-Yates). */
function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const pick = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[pick]] = [shuffled[pick], shuffled[index]];
  }
  return shuffled;
}

/** Clones the card template once per motif of the round. */
function createCards(motifs: string[]): DocumentFragment[] {
  const template = document.querySelector<HTMLTemplateElement>('#card-template');
  if (!template) {
    return [];
  }
  return motifs.map((motif, index) => createCard(template, motif, index));
}

/** Builds one card, its motif stays hidden until the card is flipped. */
function createCard(template: HTMLTemplateElement, motif: string, index: number): DocumentFragment {
  const card = template.content.cloneNode(true) as DocumentFragment;
  const image = card.querySelector<HTMLImageElement>('.card__motif');
  const button = card.querySelector<HTMLButtonElement>('.card');
  if (image && button) {
    image.src = motif;
    button.setAttribute('aria-label', `Card ${index + 1}`);
  }
  return card;
}

/** Paints the board in the theme picked in the settings. */
function applyFieldTheme(): void {
  const field = document.getElementById('field');
  const theme = getPickedInput('theme')?.value;
  if (field && theme) {
    field.className = `field field--${theme}`;
  }
}

/** Keeps the summary in sync with every pick in the settings form. */
function setupSummary(): void {
  const settings = document.getElementById('settings');
  settings?.addEventListener('change', updateSummary);
  updateSummary();
}

/** Writes every picked option into the summary. */
function updateSummary(): void {
  Object.entries(SUMMARY_OUTPUTS).forEach(([group, outputId]) => {
    const output = document.getElementById(outputId);
    if (output) {
      output.textContent = getPickedLabel(group);
    }
  });
  updateStartButton();
}

/** Returns the label of the radio picked in the given group. */
function getPickedLabel(group: string): string {
  const input = getPickedInput(group);
  if (!input) {
    return '';
  }
  const label = document.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`);
  return label?.textContent?.trim() ?? '';
}

/** Returns the picked radio of the given group, if there is one. */
function getPickedInput(group: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`.settings__input[name="${group}"]:checked`);
}

/** The start button stays disabled until all three options are picked. */
function updateStartButton(): void {
  const startButton = document.querySelector<HTMLButtonElement>('.settings__start');
  const isComplete = Object.keys(SUMMARY_OUTPUTS).every(group => getPickedInput(group));
  if (startButton) {
    startButton.disabled = !isComplete;
  }
}

/** Turns over the card that was clicked. */
function setupCardFlip(): void {
  const field = document.getElementById('field');
  field?.addEventListener('click', event => {
    const card = (event.target as HTMLElement).closest<HTMLButtonElement>('.card');
    if (card) {
      revealCard(card);
    }
  });
}

/** Turns a card face up, as soon as two are up they are compared. */
function revealCard(card: HTMLButtonElement): void {
  const isAlreadyUp = card.classList.contains('is-flipped');
  if (isBoardLocked || isAlreadyUp) {
    return;
  }
  card.classList.add('is-flipped');
  openCards.push(card);
  if (openCards.length === CARDS_PER_PAIR) {
    comparePair();
  }
}

/** A pair stays up and gets its frame, anything else goes back down. */
function comparePair(): void {
  const [first, second] = openCards;
  if (getMotif(first) !== getMotif(second)) {
    isBoardLocked = true;
    window.setTimeout(hideOpenCards, MISMATCH_DELAY_MS);
    return;
  }
  openCards.forEach(card => {
    card.classList.add('is-matched');
    card.disabled = true;
  });
  openCards = [];
}

/** Turns the two cards of a wrong guess face down again. */
function hideOpenCards(): void {
  openCards.forEach(card => card.classList.remove('is-flipped'));
  openCards = [];
  isBoardLocked = false;
}

/** Returns the motif a card shows, it tells two cards apart. */
function getMotif(card: HTMLButtonElement): string {
  return card.querySelector<HTMLImageElement>('.card__motif')?.src ?? '';
}
