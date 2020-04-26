import Phaser from 'phaser';
import HitCircle from './hitCircle';

export default class PlayScene extends Phaser.Scene {
    private gameElements: HitCircle[];

    private viewWidth: number
    private viewHeight: number

    constructor() {
        super({ key: 'play' });
        this.gameElements = [];
        window.debugObj = this;
    }

    public init(): void {
        this.viewWidth = this.cameras.main.width;
        this.viewHeight = this.cameras.main.height;
        const img = this.add.image(0, 0, 'sky');
        img.setOrigin(0, 0);
        img.displayWidth = this.viewWidth;
        img.displayHeight = this.viewHeight;
        this.sound.add('softHitclap');
    }

    /*
    * All .osz files assuem that the screen is 640 by 480
    */
    private osuPixelToDisplayPixel(osuPosList) {
        const displayX = Math.floor((osuPosList[0] / 640) * this.viewWidth);
        const displayY = Math.floor((osuPosList[1] / 480) * this.viewHeight);
        return [displayX, displayY];
    }

    private getPreemptDuration(approachRate: number): number {
        if (approachRate < 5) {
            return 1200 + 600 * (5 - approachRate) / 5
        } else {
            return 1200 - 750 * (approachRate - 5) / 5
        }
    }

    private getFadeInDuration(approachRate: number): number{
        if (approachRate < 5) {
            return 800 + 400 * (5 - approachRate) / 5
        } else {
            return 800 - 500 * (approachRate - 5) / 5
        }
    }

    public create(): void {
        this.createCircle(200, 200);
        this.createCircle(600, 400);

        const hitObjectTweens = [];

        const hitObjects = window.beatmap.hitObjects
        // for (let i = 0; i < 30; i++) {
        for (let i = 0; i < hitObjects.length; i++) {
            const hitObjectData = hitObjects[i];

            const [x, y] = this.osuPixelToDisplayPixel(hitObjectData.position);
            const hitCircle = this.createCircle(x, y);

            const AR = window.beatmap.ApproachRate;
            const fadeIn = this.getFadeInDuration(AR);
            const preempt = this.getPreemptDuration(AR);

            hitObjectTweens.push(
            {
                targets: hitCircle,
                onStart: hitCircle.start,
                onStartScope: hitCircle,
                alpha: 0.8,
                offset: hitObjectData.startTime,
                duration: fadeIn,
            }, {
                targets: hitCircle,
                timingRadius: 0,
                offset: hitObjectData.startTime,
                duration: preempt,
            }, {
                targets: hitCircle,
                onEnd: hitCircle.done,
                onEndScope: hitCircle,
                alpha: 0,
                offset: hitObjectData.startTime + preempt,
                duration: 100,
            })
        }

        const timeline = this.tweens.timeline({
            ease: 'linear',

            tweens: hitObjectTweens,
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
        return hitCircle;
    }
}
