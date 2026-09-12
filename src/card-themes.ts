/**
 * Motifs of every theme, one entry per picture in public/assets.
 * A round needs half as many motifs as it has cards, each one is used twice,
 * so every theme holds enough motifs for the largest board (18 pairs).
 * Preview pictures and icons are left out, they are no card motifs.
 */
const THEME_FILES: Record<string, string[]> = {
  'gaming': [
    'assets/games_theme_cards/ace_of_diamonds.png',
    'assets/games_theme_cards/banana.png',
    'assets/games_theme_cards/controller.png',
    'assets/games_theme_cards/creeper.png',
    'assets/games_theme_cards/dice.png',
    'assets/games_theme_cards/gameboy.png',
    'assets/games_theme_cards/levelup.png',
    'assets/games_theme_cards/maze.png',
    'assets/games_theme_cards/pac-man.png',
    'assets/games_theme_cards/pacman_ghost_chase.png',
    'assets/games_theme_cards/play.png',
    'assets/games_theme_cards/puzzle.png',
    'assets/games_theme_cards/snake.png',
    'assets/games_theme_cards/squid_game_circle.png',
    'assets/games_theme_cards/squid_game_square.png',
    'assets/games_theme_cards/squid_game_triangle.png',
    'assets/games_theme_cards/star.png',
    'assets/games_theme_cards/supemushroom.png',
    'assets/games_theme_cards/winnerscap.png',
  ],
  'foods': [
    'assets/food_theme_cards/brezel.png',
    'assets/food_theme_cards/burger.png',
    'assets/food_theme_cards/burrito.png',
    'assets/food_theme_cards/cake.png',
    'assets/food_theme_cards/chocolate.png',
    'assets/food_theme_cards/cookies.png',
    'assets/food_theme_cards/cupcake.png',
    'assets/food_theme_cards/donut.png',
    'assets/food_theme_cards/eiscream.png',
    'assets/food_theme_cards/flan.png',
    'assets/food_theme_cards/fries.png',
    'assets/food_theme_cards/hotdog.png',
    'assets/food_theme_cards/nuggets.png',
    'assets/food_theme_cards/pizza.png',
    'assets/food_theme_cards/prawnsalad.png',
    'assets/food_theme_cards/sandwich.png',
    'assets/food_theme_cards/sushi.png',
    'assets/food_theme_cards/wrapp.png',
  ],
};

/**
 * Builds the url of a file inside the public folder. The base path of the
 * build is put in front of it, so the pictures are also found when the game
 * does not run in the root folder of a domain.
 */
function toAssetUrl(file: string): string {
  return encodeURI(import.meta.env.BASE_URL + file);
}

/** Returns the motif urls of a theme, an empty list if it is unknown. */
export function getThemeMotifs(theme: string): string[] {
  return (THEME_FILES[theme] ?? []).map(toAssetUrl);
}
