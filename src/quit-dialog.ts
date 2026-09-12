import { showSection } from './navigation';
import { getPickedInput } from './settings-form';

/** Value the dialog carries back when the round is given up. */
const QUIT_VALUE = 'quit';

/** Labels the two answers carry where the theme words none of its own. */
const QUIT_LABEL_DEFAULT = 'Exit game';
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
  exitButton.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === QUIT_VALUE) {
      showSection('settings');
    }
  });
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

/** Writes one label into the button the selector names. */
function writeLabel(selector: string, label: string): void {
  const button = document.querySelector<HTMLButtonElement>(selector);
  if (button) {
    button.textContent = label;
  }
}
