/**
 * @file Asks before a running round is given up, and plays the way in and
 * out the picked theme gives that dialog.
 */

import { showSection } from './navigation';
import { getPickedInput, resetSettings } from './settings-form';

/** Value the dialog carries back when the round is given up. */
const QUIT_VALUE = 'quit';

/** Value the dialog carries back when the round goes on. */
const STAY_VALUE = 'stay';

/** Class that plays the way out the picked theme gives the dialog. */
const LEAVING_CLASS = 'field__quit--leaving';

/** Label the answer that quits carries where the theme words none of its own. */
const QUIT_LABEL_DEFAULT = 'Exit game';

/** Label the answer that stays carries where the theme words none of its own. */
const STAY_LABEL_DEFAULT = 'Back to game';

/** Themes that word the answer that quits in their own way. */
const QUIT_LABELS: Record<string, string> = {
  gaming: 'Yes, quit game',
};

/** Themes that word the answer that stays in their own way. */
const STAY_LABELS: Record<string, string> = {
  gaming: 'No, back to game',
  foods: 'No, back to game',
};

/** Wires the dialog that asks before a running round is given up. */
export function setupQuitDialog(): void {
  const exitButton = document.querySelector<HTMLButtonElement>('.field__exit');
  const dialog = document.querySelector<HTMLDialogElement>('.field__quit');
  if (!exitButton || !dialog) {
    return;
  }
  exitButton.addEventListener('click', () => openDialog(dialog));
  dialog.addEventListener('cancel', (event) => escapeDialog(event, dialog));
  dialog.addEventListener('click', (event) => clickBesideDialog(event, dialog));
  dialog.addEventListener('close', () => finishDialog(dialog));
}

/**
 * Brings the dialog in, cleared of the way out of the round before.
 *
 * @param dialog - The dialog that asks about giving up.
 */
function openDialog(dialog: HTMLDialogElement): void {
  dialog.classList.remove(LEAVING_CLASS);
  // A way out that was cut short leaves its animation behind, and a browser
  // that keeps one plays no second
  dialog.getAnimations().forEach((leaving) => leaving.cancel());
  dialog.showModal();
}

/**
 * Lets the escape key take the same way out as the answer that stays.
 *
 * @param event - The cancel event the browser sends on escape.
 * @param dialog - The dialog that asks about giving up.
 */
function escapeDialog(event: Event, dialog: HTMLDialogElement): void {
  // Without this the browser would close the dialog without its way out
  event.preventDefault();
  leaveDialog(dialog, STAY_VALUE);
}

/**
 * Sends the dialog out when the click landed beside the sheet.
 *
 * @param event - The click that landed somewhere on the dialog.
 * @param dialog - The dialog that asks about giving up.
 */
function clickBesideDialog(event: MouseEvent, dialog: HTMLDialogElement): void {
  const besideSheet = event.target === dialog && !isOnSheet(event, dialog);
  if (besideSheet) {
    leaveDialog(dialog, STAY_VALUE);
  }
}

/**
 * Tells whether a click landed on the sheet itself, padding and all.
 *
 * @param event - The click to place.
 * @param dialog - The dialog whose sheet the click is held against.
 * @returns True where the click lies within the bounds of the sheet.
 */
function isOnSheet(event: MouseEvent, dialog: HTMLDialogElement): boolean {
  const sheet = dialog.getBoundingClientRect();
  const onColumn = event.clientX >= sheet.left && event.clientX <= sheet.right;
  const onRow = event.clientY >= sheet.top && event.clientY <= sheet.bottom;
  return onColumn && onRow;
}

/**
 * Plays the way out of the picked theme and closes the dialog behind it.
 *
 * @param dialog - The dialog that asks about giving up.
 * @param answer - Value the closed dialog is to carry back.
 */
function leaveDialog(dialog: HTMLDialogElement, answer: string): void {
  // A second answer while the sheet is already on its way out changes nothing
  if (dialog.classList.contains(LEAVING_CLASS)) {
    return;
  }
  if (skipsMotion()) {
    dialog.close(answer);
    return;
  }
  dialog.classList.add(LEAVING_CLASS);
  closeAfterLeaving(dialog, answer);
}

/**
 * Closes the dialog once its own way out has been played to the end.
 *
 * @param dialog - The dialog that is on its way out.
 * @param answer - Value the closed dialog is to carry back.
 */
function closeAfterLeaving(dialog: HTMLDialogElement, answer: string): void {
  /**
   * Waits for the way out to be played to the end, then closes.
   *
   * @param event - The animationend the dialog or its backdrop sends.
   */
  const onLeft = (event: AnimationEvent): void => {
    // The dimmed board animates along and reports in here as well
    if (event.target !== dialog || event.pseudoElement) {
      return;
    }
    dialog.removeEventListener('animationend', onLeft);
    // Cleared while the sheet is still on the page: a browser that is handed
    // a hidden one keeps the played way out and replays none the next time
    dialog.classList.remove(LEAVING_CLASS);
    dialog.close(answer);
  };
  dialog.addEventListener('animationend', onLeft);
}

/**
 * Tells whether the visitor asked to be spared animations.
 *
 * @returns True where the system is set to reduced motion.
 */
function skipsMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Takes the answer the closed dialog carries back.
 *
 * @param dialog - The dialog that has just closed.
 */
function finishDialog(dialog: HTMLDialogElement): void {
  if (dialog.returnValue === QUIT_VALUE) {
    // Whoever gives up a round picks every setting anew for the next one
    resetSettings();
    showSection('settings');
  }
}

/** Writes the labels the picked theme gives the two answers of the dialog. */
export function showQuitLabels(): void {
  const theme = getPickedInput('theme')?.value;
  if (!theme) {
    return;
  }
  writeLabel('.field__quit-button--stay', STAY_LABELS[theme] ?? STAY_LABEL_DEFAULT);
  writeLabel('.field__quit-button--exit', QUIT_LABELS[theme] ?? QUIT_LABEL_DEFAULT);
}

/**
 * Writes one label into the button the selector names.
 *
 * @param selector - Picks out the button the label belongs to.
 * @param label - The words that button is to carry.
 */
function writeLabel(selector: string, label: string): void {
  const button = document.querySelector<HTMLButtonElement>(selector);
  if (button) {
    button.textContent = label;
  }
}
