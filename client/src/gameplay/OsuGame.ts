import Phaser from 'phaser';
import bootScene from './scenes/bootScene';
import playScene from './scenes/playScene';
import menuScene from './scenes/menuScene';
import endScene from './scenes/endScene';

class OsuGame {
    private game: Phaser.Game;
    private const aspectRatio = 4/3;

    // Some hacks for hot module reloading
    constructor(tagId: string) {
        if (module.hot) {
            module.hot.dispose(this.destroyGame.bind(this));
            module.hot.accept(this.newGame.bind(this));
        }

        if (!this.game) this.newGame(tagId);
    }

    newGame(tagId: string): void {
        // Calculate what the width and height to fit the screen while maintaining ratio
        let visualWidth = window.innerWidth;
        let visualHeight = window.innerHeight;
        if ( (visualWidth / visualHeight) > this.aspectRatio) {
            visualWidth = visualHeight * this.aspectRatio;
        } else {
            visualHeight = Math.floor(visualWidth / aspectRatio);
        }

        if (this.game) return;
        this.game = new Phaser.Game({
            type: Phaser.AUTO,
            backgroundColor: '#2dab2d',
            scale: {
                mode: Phaser.Scale.FIT,
                parent: 'game-area',
                width: visualWidth,
                height: visualHeight,
            },
            title: 'Phaser 3 web-osu game',
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
