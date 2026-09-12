/**
 * @file Reads the picks of the settings form and keeps the summary panel,
 * its cover and the start button in step with them.
 */

/** Radio group of the settings form and the output that mirrors it. */
const SUMMARY_OUTPUTS: Record<string, string> = {
  theme: 'summary-theme',
  'player-color': 'summary-player',
  'board-size': 'summary-board',
};

/** Class the panel carries once its picks are uncovered. */
const UNCOVERED_CLASS = 'settings__summary--uncovered';

/** True once the panel was clicked with all three options picked. */
let arePicksUncovered = false;

/** Keeps the summary in sync with every pick in the settings form. */
export function setupSummary(): void {
  const settings = document.getElementById('settings');
  settings?.addEventListener('change', updateSummary);
  getCoverButton()?.addEventListener('click', uncoverPicks);
  updateSummary();
}

/**
 * Clears every pick and covers the panel again, so a player who left a
 * round finds the settings screen the way it was on the first visit.
 */
export function resetSettings(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>('.settings__input');
  inputs.forEach(input => {
    input.checked = false;
  });
  arePicksUncovered = false;
  updateSummary();
}

/** Takes the click on the panel: the picks show, the round can start. */
function uncoverPicks(): void {
  arePicksUncovered = true;
  updateSummary();
}

/**
 * Writes every picked option into the summary, as long as the panel was
 * uncovered. A covered entry is left empty, the stylesheet fills it with
 * the name of the setting it stands for.
 */
function updateSummary(): void {
  Object.entries(SUMMARY_OUTPUTS).forEach(([group, outputId]) => {
    const output = document.getElementById(outputId);
    if (output) {
      output.textContent = arePicksUncovered ? getPickedLabel(group) : '';
    }
  });
  updatePanelButtons();
}

/**
 * Returns the label of the radio picked in the given group.
 *
 * @param group - Name the radios of that group share.
 * @returns The label text, empty where the group carries no pick.
 */
function getPickedLabel(group: string): string {
  const input = getPickedInput(group);
  if (!input) {
    return '';
  }
  const label = document.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`);
  return label?.textContent?.trim() ?? '';
}

/**
 * Returns the picked radio of the given group, if there is one.
 *
 * @param group - Name the radios of that group share.
 * @returns The checked radio, or null while the group is untouched.
 */
export function getPickedInput(group: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`.settings__input[name="${group}"]:checked`);
}

/**
 * Tells whether every group of the settings form carries a pick.
 *
 * @returns True once theme, colour and board size are all picked.
 */
function areAllPicksIn(): boolean {
  return Object.keys(SUMMARY_OUTPUTS).every(group => getPickedInput(group) !== null);
}

/**
 * The cover only answers once all three picks are in and leaves the panel
 * as soon as it was pressed. Until then the start button stays disabled.
 */
function updatePanelButtons(): void {
  const cover = getCoverButton();
  if (cover) {
    cover.disabled = !areAllPicksIn();
    cover.hidden = arePicksUncovered;
  }
  const startButton = document.querySelector<HTMLButtonElement>('.settings__start');
  if (startButton) {
    startButton.disabled = !arePicksUncovered;
  }
  markUncoveredPanel();
}

/** Marks the uncovered panel, its slashes thin out and grow a diamond. */
function markUncoveredPanel(): void {
  const summary = document.querySelector<HTMLElement>('.settings__summary');
  summary?.classList.toggle(UNCOVERED_CLASS, arePicksUncovered);
}

/**
 * Returns the cover that lies over the panel while the picks are hidden.
 *
 * @returns The cover button, or null where the screen carries none.
 */
function getCoverButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('.settings__reveal');
}
