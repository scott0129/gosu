import Phaser from 'phaser';
import HitCircle from './hitCircle';

export default class PlayScene extends Phaser.Scene {
    private gameElements: HitCircle[];

    constructor() {
        super({ key: 'play' });
        this.gameElements = [];
    }

    public init(): void {
        this.add.image(400, 300, 'sky');
        this.sound.add('softHitclap');
    }

    public create(): void {
        this.createCircle(200, 200);
        this.time.addEvent({
            delay: 1000,
            callback: () => this.createCircle(600, 400),
        });
    }

    public update(): void {
        for (let i = 0; i < this.gameElements.length; ++i) {
            this.gameElements[i].update();
        }
    }

    private createCircle(x: number, y: number): void {
        const hitCircle = new HitCircle(this, x, y);
        this.gameElements.push(hitCircle);
    }
}
