/**
 * @file Closes a round: picks the screen the outcome calls for, names the
 * winner and writes the points both players ended on.
 */

import { showSection } from './navigation';
import { getPickedPlayer, getScores, getWinner } from './scoreboard';
import type { Player } from './scoreboard';
import { getPickedInput, resetSettings } from './settings-form';

/** The three ways a round can end, seen from the picked player. */
const OUTCOMES = ['lost', 'won', 'draw'] as const;

/** How a round ended, seen from the player who picked the colour. */
type Outcome = (typeof OUTCOMES)[number];

/** Block of the closing screen every outcome is written in. */
const OUTCOME_IDS: Record<Outcome, string> = {
  lost: 'result-lost',
  won: 'result-won',
  draw: 'result-draw',
};

/** Name a player is announced with on the screen of a won round. */
const WINNER_LABELS: Record<Player, string> = {
  blue: 'Blue Player',
  orange: 'Orange Player',
};

/** Class that plays the way in of a screen, it is laid on anew per round. */
const DROPPING_CLASS = 'result__outcome--dropping';

/** Output of the closing screen that carries the points of a player. */
const RESULT_OUTPUTS: Record<Player, string> = {
  blue: 'result-score-blue',
  orange: 'result-score-orange',
};

/** Closes a round: the outcome decides which screen the players land on. */
export function showResult(): void {
  const winner = getWinner();
  const outcome = pickOutcome(winner);
  showOutcome(outcome);
  dressScreen(outcome);
  if (winner) {
    showWinner(winner);
  }
  showFinalScores();
  showSection('result');
  replayDrop(outcome);
}

/**
 * Sends the screen down its way in. A block that was shown before keeps the
 * way it played the last time, so the class is taken off and laid on anew.
 *
 * @param outcome - The outcome whose block is on show.
 */
function replayDrop(outcome: Outcome): void {
  const block = document.getElementById(OUTCOME_IDS[outcome]);
  if (!block) {
    return;
  }
  block.classList.remove(DROPPING_CLASS);
  // Read of the layout in between, without it the browser sees the class
  // taken off and laid on in one go, and plays nothing
  void block.offsetWidth;
  block.classList.add(DROPPING_CLASS);
}

/**
 * Names the block a round ends on, seen from the picked player.
 *
 * @param winner - The leading colour, or null on a draw.
 * @returns Won, lost or draw.
 */
function pickOutcome(winner: Player | null): Outcome {
  if (!winner) {
    return 'draw';
  }
  return winner === getPickedPlayer() ? 'won' : 'lost';
}

/**
 * Shows one block of the closing screen and hides the other two.
 *
 * @param target - The outcome that is to be seen.
 */
function showOutcome(target: Outcome): void {
  OUTCOMES.forEach(outcome => {
    const block = document.getElementById(OUTCOME_IDS[outcome]);
    if (block) {
      block.hidden = outcome !== target;
    }
  });
}

/**
 * Dresses the closing screen in the theme the round was played in. The
 * outcome is written alongside it, a theme may paint one of the three
 * on a ground of its own.
 *
 * @param outcome - The outcome the screen is marked with.
 */
function dressScreen(outcome: Outcome): void {
  const result = document.getElementById('result');
  const theme = getPickedInput('theme')?.value;
  if (result && theme) {
    result.className = `result result--${theme}`;
    result.dataset.outcome = outcome;
  }
}

/**
 * Names the winner, written in the colour that player played with.
 *
 * @param winner - The colour that took the round.
 */
function showWinner(winner: Player): void {
  const name = document.getElementById('result-winner');
  const badge = document.getElementById('result-badge');
  if (name && badge) {
    name.textContent = WINNER_LABELS[winner];
    name.dataset.player = winner;
    badge.dataset.player = winner;
  }
}

/** Writes the points both players closed the round on. */
function showFinalScores(): void {
  const scores = getScores();
  Object.entries(RESULT_OUTPUTS).forEach(([player, outputId]) => {
    const output = document.getElementById(outputId);
    if (output) {
      output.textContent = String(scores[player as Player]);
    }
  });
}

/** Wires the button that leads from a finished round back to the start. */
export function setupResultScreen(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.result__home');
  buttons.forEach(button => button.addEventListener('click', goHome));
}

/**
 * Takes the players home. Whoever played a round out picks every setting
 * anew for the next one, just as whoever gives one up does.
 */
function goHome(): void {
  resetSettings();
  showSection('home');
}
