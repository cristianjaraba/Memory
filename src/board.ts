/**
 * @file Lays out the board of a round, turns the cards that are clicked and
 * books every pair that is found.
 */

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

/** How long the last pair of a round stays on show before it is closed. */
const ROUND_END_DELAY_MS = 700;

/** Closes the round, it is handed in with the listener of the board. */
let closeRound: () => void = () => {};

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

/**
 * Draws the motifs of one round: every pair twice, in random order.
 *
 * @param theme - Name of the theme the motifs are taken from.
 * @param cardCount - How many cards the picked board size holds.
 * @returns One motif url per card, shuffled.
 */
function dealMotifs(theme: string, cardCount: number): string[] {
  const motifs = getThemeMotifs(theme);
  const pairs = shuffle(motifs).slice(0, cardCount / CARDS_PER_PAIR);
  return shuffle([...pairs, ...pairs]);
}

/**
 * Returns a shuffled copy of the given list (Fisher-Yates).
 *
 * @typeParam T - Type of the entries, they are only moved about.
 * @param items - The list to shuffle, it is left untouched.
 * @returns A new list holding the same entries in random order.
 */
function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const pick = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[pick]] = [shuffled[pick], shuffled[index]];
  }
  return shuffled;
}

/**
 * Clones the card template once per motif of the round.
 *
 * @param motifs - The motif urls the round is played with.
 * @returns One card per motif, empty where the template is missing.
 */
function createCards(motifs: string[]): DocumentFragment[] {
  const template = document.querySelector<HTMLTemplateElement>('#card-template');
  if (!template) {
    return [];
  }
  return motifs.map((motif, index) => createCard(template, motif, index));
}

/**
 * Builds one card, its motif stays hidden until the card is flipped.
 *
 * @param template - The card template of the page.
 * @param motif - Url of the picture that card carries.
 * @param index - Place of the card on the board, it names it for screen readers.
 * @returns The filled card, ready to be laid on the board.
 */
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

/**
 * Turns over the card that was clicked and closes a finished round.
 *
 * @param onRoundEnd - Called once the last pair of the round is found.
 */
export function setupCardFlip(onRoundEnd: () => void): void {
  closeRound = onRoundEnd;
  const field = document.getElementById('field');
  field?.addEventListener('click', event => {
    const card = (event.target as HTMLElement).closest<HTMLButtonElement>('.card');
    if (card) {
      revealCard(card);
    }
  });
}

/**
 * Turns a card face up, as soon as two are up they are compared.
 *
 * @param card - The card that was clicked.
 */
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
  keepPair();
  addPairPoints();
  if (isBoardCleared()) {
    endRound();
  }
}

/** Leaves the two cards of a found pair face up, out of the game. */
function keepPair(): void {
  openCards.forEach(card => {
    card.classList.add('is-matched');
    card.disabled = true;
  });
  openCards = [];
}

/**
 * Tells whether every card on the board has found its partner.
 *
 * @returns True once no card is left to turn.
 */
function isBoardCleared(): boolean {
  const cards = document.querySelectorAll<HTMLButtonElement>('.card');
  return [...cards].every(card => card.classList.contains('is-matched'));
}

/** Leaves the last pair on show for a moment, then closes the round. */
function endRound(): void {
  isBoardLocked = true;
  window.setTimeout(closeRound, ROUND_END_DELAY_MS);
}

/** Turns the two cards of a wrong guess face down again. */
function hideOpenCards(): void {
  openCards.forEach(card => card.classList.remove('is-flipped'));
  openCards = [];
  switchPlayer();
  isBoardLocked = false;
}

/**
 * Returns the motif a card shows, it tells two cards apart.
 *
 * @param card - The card to read.
 * @returns Url of its picture, empty where the card carries none.
 */
function getMotif(card: HTMLButtonElement): string {
  return card.querySelector<HTMLImageElement>('.card__motif')?.src ?? '';
}
