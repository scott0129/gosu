import Phaser from 'phaser';
import HitCircle from './hitCircle';
import Slider from './slider';

export default class PlayScene extends Phaser.Scene {
    private gameElements: HitCircle[];

    private viewWidth: number;
    private viewHeight: number;
    private timeline: Timeline;
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

        this.hitNormal = this.sound.add('normal');
        this.hitWhistle = this.sound.add('whistle');
        this.hitClap = this.sound.add('clap');
        this.hitFinish = this.sound.add('finish');

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
            return 1200 + (600 * (5 - approachRate)) / 5;
        } else {
            return 1200 - (750 * (approachRate - 5)) / 5;
        }
    }

    private getFadeInDuration(approachRate: number): number {
        if (approachRate < 5) {
            return 800 + (400 * (5 - approachRate)) / 5;
        } else {
            return 800 - (500 * (approachRate - 5)) / 5;
        }
    }

    public preload(): void {
        const hitObjectTweens = [];

        const AR = window.beatmap.ApproachRate;
        const fadeIn = this.getFadeInDuration(AR);
        const preempt = this.getPreemptDuration(AR);

        const hitObjects = window.beatmap.hitObjects;
        for (let i = hitObjects.length - 1; i >= 0; --i) {
            const hitObjectData = hitObjects[i];
            if ( hitObjectData.objectName === 'slider') {
                for (let j = 0; j < hitObjectData.points.length; j++) {
                    hitObjectData.points[j] = this.osuPixelToDisplayPixel(
                        hitObjectData.points[j]
                    );
                }

                const slider = this.createSlider(hitObjectData);

                hitObjectTweens.push(
                    {
                        // Fade in
                        targets: slider,
                        onStart: slider.start,
                        onStartScope: slider,
                        alpha: 0.8,
                        offset: hitObjectData.startTime - preempt,
                        duration: fadeIn,
                    },
                    {
                        // Shrink timing radius
                        targets: slider,
                        timingRadius: 0,
                        offset: hitObjectData.startTime - preempt,
                        duration: preempt,
                    },
                    {
                        // MooOOooOove the slider
                        targets: slider,
                        progress: 1,
                        offset: hitObjectData.startTime,
                        duration: hitObjectData.duration,
                    },
                    {
                        // Fade out
                        targets: slider,
                        onEnd: slider.done,
                        onEndScope: slider,
                        alpha: 0,
                        offset:
                            hitObjectData.startTime + hitObjectData.duration,
                        duration: 500,
                    }
                );
            } else if (hitObjectData.objectName === 'circle') {
                hitObjectData.position = this.osuPixelToDisplayPixel(
                    hitObjectData.position
                );
                const hitCircle = this.createCircle(hitObjectData);

                hitObjectTweens.push(
                    {
                        // Fade in
                        targets: hitCircle,
                        onStart: hitCircle.start,
                        onStartScope: hitCircle,
                        alpha: 0.8,
                        offset: hitObjectData.startTime - preempt,
                        duration: fadeIn,
                    },
                    {
                        // Shrink timing radius
                        targets: hitCircle,
                        timingRadius: 0,
                        offset: hitObjectData.startTime - preempt,
                        duration: preempt,
                    },
                    {
                        // Fade out
                        targets: hitCircle,
                        onComplete: hitCircle.done,
                        onCompleteScope: hitCircle,
                        alpha: 0,
                        offset: hitObjectData.startTime,
                        duration: 500,
                    }
                );
            }
        }

        this.timeline = this.tweens.timeline({
            ease: 'linear',

            tweens: hitObjectTweens,
            paused: true,
        });
        this.timeline.init();
    }

    public create(): void {
        this.timeline.play();
        this.music.play();
    }

    public update(): void {
        this.syncTimelineToMusic();
        for (let i = 0; i < this.gameElements.length; ++i) {
            this.gameElements[i].update(); //TODO: This could probably be more efficient with events
        }
    }

    // calling this constantly tries to sync
    private syncTimelineToMusic(musicAheadBy: number): void {
        const musicAheadBy = this.music.seek - this.timeline.elapsed / 1000;
        this.timeline.setTimeScale(1 + musicAheadBy);
    }

    private getAudio(soundName: string) {
        switch (soundName) {
            case 'normal':
                return this.hitNormal;
            case 'whistle':
                return this.hitWhistle;
            case 'clap':
                return this.hitClap;
            case 'finish':
                return this.hitFinish;
        }
    }

    private createCircle(parsedData: Object): void {
        // I don't know what it means for there to be multiple soundtypes, so just take the first
        const soundName = parsedData.soundTypes[0]
        const hitCircle = new HitCircle(this, parsedData, this.getAudio(soundName));
        this.gameElements.push(hitCircle);
        return hitCircle;
    }

    private createSlider(parsedData: Object): void {
        // I don't know what it means for there to be multiple soundtypes, so just take the first
        const soundName = parsedData.soundTypes[0]
        const slider = new Slider(this, parsedData, this.getAudio(soundName));
        this.gameElements.push(slider);
        return slider;
    }
}
