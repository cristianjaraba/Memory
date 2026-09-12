/**
 * @file Build settings of the game.
 */

import { defineConfig } from 'vite';

/**
 * The game is served from a subfolder, not from the root of the domain, so
 * every asset url is built on top of that base path.
 */
export default defineConfig({
  base: "/Memory/"
});

// Website: adresse.de/Memory/
// Deshalb: base: '/Memory/'
// Inhalt von dist auf den FTP-Ordner Memory hochladen.
