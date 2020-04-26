import Phaser from 'phaser';

export default class HitCircle {
    private x: number;
    private y: number;

    private group: Phaser.GameObjects.Group;
    private hitGraphic: Phaser.GameObjects.Graphics;
    private timingGraphic: Phaser.GameObjects.Graphics;
    private hitSound: Phaser.Sound.BaseSoundManager;

    public active: boolean;
    public alpha: number;
    public timingRadius: number;

    /* Max radius of the timing graphic */
    readonly MAX_TIMING_RADIUS: number = 300;

    /* Radius of clickable graphic */
    readonly HIT_RADIUS: number = 65;
    
    /* Width of timingGraphic and border around hitGraphic */
    readonly BORDER_WIDTH: number = 10;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.x = x;
        this.y = y;

        this.alpha = 0;
        this.active = false;

        this.hitSound = scene.sound;
        this.timingRadius = this.MAX_TIMING_RADIUS;

        const hitCircle = new Phaser.Geom.Circle(0, 0, this.HIT_RADIUS);

        // Draw the larger, timing circle
        this.timingGraphic = scene.add.graphics();
        this.timingGraphic.lineStyle(this.BORDER_WIDTH, 0xabcede);
        this.timingGraphic.strokeCircleShape(this.getTimingCircle());

        // Draw the inner, clickable circle
        this.hitGraphic = scene.add.graphics();
        this.hitGraphic.lineStyle(this.BORDER_WIDTH, 0xffffff);
        this.hitGraphic.strokeCircleShape(hitCircle);
        this.hitGraphic.fillStyle(0x112288, 1);
        this.hitGraphic.fillCircleShape(hitCircle);

        // Add listeners to clickable circle
        this.hitGraphic.setInteractive(hitCircle, Phaser.Geom.Circle.Contains);
        this.hitGraphic.on('pointerdown', this.onClick.bind(this));

        // Group together timingGraphic and hitGraphic so they can be moved/adjusted together
        this.group = scene.add.group([this.timingGraphic, this.hitGraphic]);
        this.group.setX(x);
        this.group.setY(y);
        this.group.setAlpha(this.alpha);
    }

    start(): void {
        this.active = true;
    }

    done(): void{
        this.active = false;
    }

    update(): void {
        if (!this.active) {
            return;
        }
        this.group.setAlpha(this.alpha);

        this.timingGraphic.clear();
        this.timingGraphic.lineStyle(this.BORDER_WIDTH, 0xabcede);
        this.timingGraphic.strokeCircleShape(this.getTimingCircle());
    }

    private onClick(): void {
        this.hitSound.play('softHitclap');
    }

    private getTimingCircle(): Phaser.Geom.Circle {
        const radius = this.HIT_RADIUS + this.timingRadius;
        const timingCircle = new Phaser.Geom.Circle(0, 0, radius);
        return timingCircle;
    }
}
