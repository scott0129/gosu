import Phaser from 'phaser';

export default class HitCircle {
    private x: number;
    private y: number;

    private hitSound: Phaser.Sound.BaseSoundManager;
    private group: Phaser.GameObjects.Group;
    private hitGraphic: Phaser.GameObjects.Graphics;
    private timingGraphic: Phaser.GameObjects.Graphics;
    private startTime: number;

    readonly MAX_TIMING_RADIUS: number = 300;
    readonly HIT_RADIUS: number = 65;
    readonly DURATION_MS: number = 2000;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // this.hitSound = hitSound;
        this.startTime = Date.now();
        this.x = x;
        this.y = y;

        this.hitSound = scene.sound;

        const hitCircle = new Phaser.Geom.Circle(0, 0, this.HIT_RADIUS);

        this.timingGraphic = scene.add.graphics();

        this.timingGraphic.lineStyle(10, 0xabcede, 1);
        this.timingGraphic.strokeCircleShape(this.getTimingCircle(0.0));

        this.hitGraphic = scene.add.graphics();

        this.hitGraphic.lineStyle(10, 0xffffff, 1);
        this.hitGraphic.strokeCircleShape(hitCircle);
        this.hitGraphic.fillStyle(0x112288, 1);
        this.hitGraphic.fillCircleShape(hitCircle);

        this.hitGraphic.setInteractive(hitCircle, Phaser.Geom.Circle.Contains);
        this.hitGraphic.on('pointerdown', this.onClick.bind(this));

        this.group = scene.add.group([this.timingGraphic, this.hitGraphic]);
        this.group.setX(x);
        this.group.setY(y);
    }

    update(): void {
        const progress = (Date.now() - this.startTime) / this.DURATION_MS;
        if (progress > 1) {
            return;
        }
        this.timingGraphic.clear();
        this.timingGraphic.lineStyle(10, 0xabcede, 1);
        this.timingGraphic.strokeCircleShape(this.getTimingCircle(progress));
    }

    private onClick(): void {
        this.hitSound.play('softHitclap');
    }

    private getTimingCircle(progress: number): Phaser.Geom.Circle {
        const radius =
            (1 - progress) * this.MAX_TIMING_RADIUS + this.HIT_RADIUS;
        const timingCircle = new Phaser.Geom.Circle(0, 0, radius);
        return timingCircle;
    }
}
