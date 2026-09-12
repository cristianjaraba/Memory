import { getThemeMotifs } from './card-themes';
import { addPairPoints, switchPlayer } from './scoreboard';
import { getPickedInput } from './settings-form';

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

/** The cards that are face up and still waiting for their partner. */
let openCards: HTMLButtonElement[] = [];

/** While a wrong guess is on show, further clicks are ignored. */
let isBoardLocked = false;

/** Lays out as many cards as the picked board size asks for. */
export function buildBoard(): void {
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

/** Turns over the card that was clicked. */
export function setupCardFlip(): void {
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
  addPairPoints();
}

/** Turns the two cards of a wrong guess face down again. */
function hideOpenCards(): void {
  openCards.forEach(card => card.classList.remove('is-flipped'));
  openCards = [];
  switchPlayer();
  isBoardLocked = false;
}

/** Returns the motif a card shows, it tells two cards apart. */
function getMotif(card: HTMLButtonElement): string {
  return card.querySelector<HTMLImageElement>('.card__motif')?.src ?? '';
}
