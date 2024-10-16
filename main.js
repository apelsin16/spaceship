import { Game } from "./src/game";

window.onload = async () => {
  const game = new Game();
  await game.init();
};
