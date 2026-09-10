# Projekt: Memory

Ein Memory-Spiel (Karten-Matching-Spiel) als Web-App. Umschulungsprojekt.

## Tech-Stack

- TypeScript
- HTML (semantisch, barrierefrei)
- SCSS

## User Stories / Anforderungen

### 1. Homescreen
- Startseite mit klarer visueller Hierarchie (Logo/Titel, Start-Button gut sichtbar zentriert)
- Start-Button führt zur Settings-Page
- Controller-Icon mit Animation (z. B. Hover- oder Idle-Animation), sinnvoll im Layout positioniert (z. B. neben Titel oder Button)

### 2. Settings
- Auswahl der Spielerfarbe: 2 Optionen (z. B. Blau / Orange)
- Auswahl der Spielfeldgröße: 4x4 / 4x6 / 6x6
- Auswahl des Themes: mind. 2 Themes wählbar (weitere optional)

### 3. Layouts
- Mind. 2 verschiedene Layouts wählbar
- Layout-Wahl ändert das Farbschema
- Layout-Wahl beeinflusst die Themengebiete der Memory-Bilder

### 4. Spielfeld / Spielerlebnis
- Spielfeld entspricht der gewählten Größe
- Gewähltes Theme wird in Farbe und Motiven dargestellt
- Über dem Spielfeld: aktueller Punktestand, aktueller Spieler, "Exit Game"-Button
- Karten drehen sich beim Klick in einer flüssigen Animation um

### 5. Spielende
- "Game Over"-Anzeige mit aktuellem Punktestand nach Rundenende
- Spieler mit den meisten Punkten wird als Gewinner angezeigt
- Möglichkeit, eine neue Runde zu starten

## Code Conventions

### TypeScript – Allgemein
- Dateinamen in kebab-case (z. B. `user-utils.ts`)
- Max. 14 Zeilen pro Funktion
- Semikolons verwenden
- Kein `any` (wenn möglich) – stattdessen exakter Typ oder `unknown`
- Variablen-, Funktions-, Klassen- und Typnamen auf Englisch (keine deutschen Bezeichner)

### TypeScript – Namensgebung
- Funktionen: camelCase (`getUser()`)
- Klassen: PascalCase (`UserProfile`)
- Interfaces: PascalCase (`User`)
- Konstanten: UPPER_CASE (`MAX_RETRIES`)
- Typen: PascalCase (`UserID`)

### TypeScript – Formatierung
- 2 Leerzeichen Einrückung
- Imports gruppieren (Std, Dritt, Lokal)
- Typen und Rückgabewerte explizit angeben (`function loadData(): Promise<Data>`)

### TypeScript – Kommentare
- TSDoc für Funktionen & Methoden (`/** Gibt den user zurück. */`)

### TypeScript – Clean Code
- Eine Aufgabe pro Funktion
- Keine Magic Numbers (`const MAX_USERS = 100;`)
- HTML auslagern statt inline
- Lesbare Bedingungen (`if (isUserActive)` statt `if (x)`)

### HTML – Struktur & Semantik
- Semantische Tags nutzen: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- `h1`–`h6` in sinnvoller Hierarchie
- `section` für thematische Abschnitte, `article` für eigenständige Inhalte
- `aside` nur für Zusatzinfos, nicht für Layout
- `figure` + `figcaption` für bedeutungstragende Bilder

### HTML – Lesbarkeit & Wartbarkeit
- Einheitlich eingerückt und formatiert
- Keine tiefen, unübersichtlichen Verschachtelungen
- Sprechende Namen (englisch)
- Verständliche, gepflegte Kommentare

### HTML – Barrierefreiheit
- Bilder mit sinnvollen `alt`-Texten
- E-Mail-Adressen mit `mailto:`
- Tabellen mit `<caption>` (wenn sinnvoll) und `<th>` statt nur `<td>` für Überschriften
- Navigation als Liste (`<ul>` in `<nav>`)

### HTML – Inhalte kennzeichnen
- Wichtiges mit `<strong>` oder `<em>` hervorheben, nicht nur `<b>`/`<i>`
- Inline-Textstruktur mit `<span>`
- Fließtext in `<p>`, nicht in `<div>`

### HTML – Gültigkeit & Standards
- Korrektes `<!DOCTYPE html>`
- `<html lang="...">` immer setzen
- `<meta charset="UTF-8">` und `<title>` im `<head>`
- `index.html` mit Favicon

### HTML – Best Practices
- So wenig `<div>` wie möglich, so viel wie nötig (keine "div-Suppe")
- Struktur (HTML) von Darstellung (CSS) trennen
- Kein Lorem Ipsum – eigene, kreative Texte verwenden

### Fonts
- Keine Google Fonts CDN-Links (kein `<link href="https://fonts.googleapis.com/...">`)
- Schriftarten selbst hosten: WOFF2-Dateien von https://gwfh.mranftl.com/fonts herunterladen, in `assets/fonts/` ablegen
- Passende `@font-face`-Regeln in SCSS definieren (z. B. `_fonts.scss`), mit `font-display: swap`
- Diese SCSS-Datei in die Hauptstyles einbinden statt externer Font-Links im `<head>`

## Hinweise für Claude Code

- Vor dem Einreichen: alle User Stories oben als Checkliste durchgehen
- Zusätzliche Extras über die Anforderungen hinaus kurz dokumentieren (für die Mentoren)
- Bei Unsicherheit zu Konventionen: siehe Abschnitt "Code Conventions" oben, nicht raten