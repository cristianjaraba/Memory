import './styles/style.scss';
import { buildBoard, setupCardFlip } from './board';
import { setupNavigation, showSection } from './navigation';
import { showQuitLabels, setupQuitDialog } from './quit-dialog';
import { resetScores } from './scoreboard';
import { getPickedInput, setupSummary } from './settings-form';

init();

/** Sets the start screen and wires up all event listeners. */
function init(): void {
  showSection('home');
  setupNavigation(startRound);
  setupSummary();
  setupCardFlip();
  setupQuitDialog();
}

/** Opens the game board, dressed in the picked theme. */
function startRound(): void {
  applyFieldTheme();
  showQuitLabels();
  resetScores();
  buildBoard();
  showSection('field');
}

/** Paints the board in the theme picked in the settings. */
function applyFieldTheme(): void {
  const field = document.getElementById('field');
  const theme = getPickedInput('theme')?.value;
  if (field && theme) {
    field.className = `field field--${theme}`;
  }
}
