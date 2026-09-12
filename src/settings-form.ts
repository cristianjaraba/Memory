/** Radio group of the settings form and the output that mirrors it. */
const SUMMARY_OUTPUTS: Record<string, string> = {
  theme: 'summary-theme',
  'player-color': 'summary-player',
  'board-size': 'summary-board',
};

/** Keeps the summary in sync with every pick in the settings form. */
export function setupSummary(): void {
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
export function getPickedInput(group: string): HTMLInputElement | null {
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
