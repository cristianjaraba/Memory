import './styles/style.scss';

/** Ids of the top level sections, only one of them is visible at a time. */
const SECTION_IDS = ['home', 'settings', 'field'] as const;

/** Radio group of the settings form and the output that mirrors it. */
const SUMMARY_OUTPUTS: Record<string, string> = {
  theme: 'summary-theme',
  'player-color': 'summary-player',
  'board-size': 'summary-board',
};

type SectionId = (typeof SECTION_IDS)[number];

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

/** Sends the player from the home screen to the settings page. */
function setupNavigation(): void {
  const playButton = document.querySelector<HTMLButtonElement>('.home__play');
  playButton?.addEventListener('click', () => showSection('settings'));
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

/** Flips a card of the game board when it is clicked. */
function setupCardFlip(): void {
  const field = document.getElementById('field');
  field?.addEventListener('click', event => {
    const card = (event.target as HTMLElement).closest('.card');
    card?.classList.toggle('is-flipped');
  });
}
