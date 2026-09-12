/** Ids of the top level sections, only one of them is visible at a time. */
const SECTION_IDS = ['home', 'settings', 'field', 'result'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Shows the given section and hides every other one. */
export function showSection(target: SectionId): void {
  SECTION_IDS.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.hidden = id !== target;
    }
  });
}

/** Wires the buttons that lead from one screen to the next. */
export function setupNavigation(onStart: () => void): void {
  const playButton = document.querySelector<HTMLButtonElement>('.home__play');
  playButton?.addEventListener('click', () => showSection('settings'));

  const startButton = document.querySelector<HTMLButtonElement>('.settings__start');
  startButton?.addEventListener('click', onStart);
}
