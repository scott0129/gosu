import Phaser from 'phaser';
import gameConfig from './app/gameConfig';

let game: Phaser.Game;

function newGame(): void {
    if (game) return;
    game = new Phaser.Game(gameConfig);
}

function destroyGame(): void {
    if (!game) return;
    game.destroy(true);
    game = null;
}

if (module.hot) {
    module.hot.dispose(destroyGame);
    module.hot.accept(newGame);
}

if (!game) newGame();
