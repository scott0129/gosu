import Phaser from 'phaser';
import HitCircle from './hitCircle';

export default class PlayScene extends Phaser.Scene {
    private gameElements: HitCircle[];

    private viewWidth: number;
    private viewHeight: number;
    private timeline: Timeline;
    private softHitclap: Sound;
    private music: Sound;

    constructor() {
        super({ key: 'play' });
        this.gameElements = [];
        // window.debugObj = this;
    }

    public init(): void {
        this.viewWidth = this.cameras.main.width;
        this.viewHeight = this.cameras.main.height;
        const img = this.add.image(0, 0, 'sky');
        img.setOrigin(0, 0);
        img.displayWidth = this.viewWidth;
        img.displayHeight = this.viewHeight;
        this.softHitclap = this.sound.add('softHitclap');
        this.music = this.sound.add('music');
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

    public preload(): void {
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
                // Fade in
                targets: hitCircle,
                onStart: hitCircle.start,
                onStartScope: hitCircle,
                alpha: 0.8,
                offset: hitObjectData.startTime - preempt,
                duration: fadeIn,
            }, {
                // Shrink timing radius
                targets: hitCircle,
                timingRadius: 0,
                offset: hitObjectData.startTime - preempt,
                duration: preempt,
            }, {
                // Fade out
                targets: hitCircle,
                onEnd: hitCircle.done,
                onEndScope: hitCircle,
                alpha: 0,
                offset: hitObjectData.startTime,
                duration: 500,
            })
        }

        this.timeline = this.tweens.timeline({
            ease: 'linear',

            tweens: hitObjectTweens,
            paused: true,
        });
        this.timeline.init();
    }

    public create(): void {
        // Whichever starts latest will be the one to sync
        this.timeline.play();
        this.music.play(); 
    }

    public update(): void {
        const musicAheadBy = this.music.seek - this.timeline.elapsed/1000;
        if (Math.abs(musicAheadBy) > 0.1) {
            // Can't do this too often cause lag, but 0.1 second offset is massive
            console.log("Synchronized!!!");
            this.music.seek = this.timeline.elapsed/1000;
        }
        for (let i = 0; i < this.gameElements.length; ++i) {
            //TODO: This could probably be more efficient with events
            this.gameElements[i].update();
        }
    }

    private createCircle(x: number, y: number): void {
        const hitCircle = new HitCircle(this, x, y);
        this.gameElements.push(hitCircle)
        return hitCircle;
    }
}
