import Phaser from 'phaser';
import HitCircle from './hitCircle';

export default class PlayScene extends Phaser.Scene {
    private gameElements: HitCircle[];

    constructor() {
        super({ key: 'play' });
        this.gameElements = [];
        window.debugObj = this;
    }

    public init(): void {
        const img = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'sky');
        img.displayWidth = this.cameras.main.width;
        img.displayHeight = this.cameras.main.width;
        this.sound.add('softHitclap');
    }

    public create(): void {
        this.createCircle(200, 200);
        this.createCircle(600, 400);

        const hitObjectTweens = [];

        // for (let i = 0; i < 20; i++) {
        //     window.beatmap.
        // }
        //
        const timeline = this.tweens.timeline({
            ease: 'linear',
            duration: 5000,

            tweens: [{
                targets: this.gameElements[0],
                onStart: this.gameElements[0].start,
                onStartScope: this.gameElements[0],
                alpha: 1,
                offset: 1000,
                duration: 500,
            }, {
                targets: this.gameElements[0],
                timingRadius: 0,
                offset: 1000,
                duration: 1000,
            }, {
                targets: this.gameElements[0],
                onEnd: this.gameElements[0].done,
                onEndScope: this.gameElements[0],
                alpha: 0,
                offset: 2000,
                duration: 100,
            }, {
                targets: this.gameElements[1],
                onStart: this.gameElements[1].start,
                onStartScope: this.gameElements[1],
                alpha: 1,
                offset: 2000,
                duration: 500,
            }, {
                targets: this.gameElements[1],
                timingRadius: 1,
                offset: 2000,
                duration: 1000,
            }, {
                targets: this.gameElements[1],
                onEnd: this.gameElements[1].done,
                onEndScope: this.gameElements[1],
                alpha: 0,
                duration: 100,
            }]
        });
    }

    public update(): void {
        for (let i = 0; i < this.gameElements.length; ++i) {
            this.gameElements[i].update();
        }
    }

    private createCircle(x: number, y: number): void {
        const hitCircle = new HitCircle(this, x, y);
        this.gameElements.push(hitCircle)
    }
}
