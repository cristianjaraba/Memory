/**
 * @file Keeps the points of a round and the turn, and writes both into the
 * status bar above the board.
 */

import { getPickedInput } from './settings-form';

/** The two players of a round, in the order they sit in the status bar. */
const PLAYERS = ['blue', 'orange'] as const;

/** Name of every player, it names the marker for screen readers. */
const PLAYER_LABELS: Record<string, string> = {
  blue: 'Blue',
  orange: 'Orange',
};

/** Output of the status bar that carries the points of a player. */
const SCORE_OUTPUTS: Record<string, string> = {
  blue: 'score-blue',
  orange: 'score-orange',
};

/** Every pair a player finds is worth this many points. */
const POINTS_PER_PAIR = 1;

/** Points every player starts a round with. */
const SCORE_START = 0;

/** One of the two colours a round is played in. */
export type Player = (typeof PLAYERS)[number];

/** Points of the running round, one entry per player. */
let scores: Record<Player, number> = { orange: SCORE_START, blue: SCORE_START };

/** Who is on turn, a wrong guess hands the turn to the other player. */
let currentPlayer: Player = PLAYERS[0];

/** Puts both scores back to zero, the picked colour opens the round. */
export function resetScores(): void {
  scores = { blue: SCORE_START, orange: SCORE_START };
  currentPlayer = getPickedPlayer();
  PLAYERS.forEach(showScore);
  showTurn();
}

/**
 * The colour picked in the settings. That player takes the first turn, and
 * the screen a round closes on is seen from that player.
 *
 * @returns The picked colour, blue where nothing is picked yet.
 */
export function getPickedPlayer(): Player {
  const picked = getPickedInput('player-color')?.value;
  return PLAYERS.find(player => player === picked) ?? PLAYERS[0];
}

/** Books the points of a found pair for the player on turn. */
export function addPairPoints(): void {
  scores[currentPlayer] += POINTS_PER_PAIR;
  showScore(currentPlayer);
}

/** Hands the turn over, a found pair leaves it where it is. */
export function switchPlayer(): void {
  currentPlayer = PLAYERS.find(player => player !== currentPlayer) ?? currentPlayer;
  showTurn();
}

/** Points the marker of the status bar at the player on turn. */
function showTurn(): void {
  const marker = document.getElementById('turn-marker');
  if (marker) {
    marker.dataset.player = currentPlayer;
    marker.setAttribute('aria-label', PLAYER_LABELS[currentPlayer]);
  }
}

/**
 * Writes the points of one player into the status bar.
 *
 * @param player - The colour whose output is written anew.
 */
function showScore(player: Player): void {
  const output = document.getElementById(SCORE_OUTPUTS[player]);
  if (output) {
    output.textContent = String(scores[player]);
  }
}

/**
 * Points both players stand on.
 *
 * @returns A copy of the scores, so no caller writes into the round.
 */
export function getScores(): Record<Player, number> {
  return { ...scores };
}

/**
 * The player with the most points, none if both stand equal.
 *
 * @returns The leading colour, or null on a draw.
 */
export function getWinner(): Player | null {
  const [first, second] = PLAYERS;
  if (scores[first] === scores[second]) {
    return null;
  }
  return scores[first] > scores[second] ? first : second;
}
