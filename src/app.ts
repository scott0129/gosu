import Phaser from 'phaser';
import bootScene from './app/bootScene';
import playScene from './app/playScene';
import menuScene from './app/menuScene';
import endScene from './app/endScene';

class OsuGame {
    private game: Phaser.Game;

    // Some hacks for hot module reloading
    constructor(tagId: string) {
        if (module.hot) {
            module.hot.dispose(this.destroyGame.bind(this));
            module.hot.accept(this.newGame.bind(this));
        }

        if (!this.game) this.newGame(tagId);
    }

    newGame(tagId: string): void {
        if (this.game) return;
        this.game = new Phaser.Game({
            parent: 'game-area',
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            pixelArt: true,
            title: 'Phaser 3 web-osu game',
            banner: {
                text: 'white',
                background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'],
            },
            scene: [bootScene, menuScene, playScene, endScene],
        });
    }

    destroyGame(): void {
        if (!this.game) return;
        this.game.destroy(true);
        this.game = null;
    }
}

export default OsuGame
