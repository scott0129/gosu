import Phaser from 'phaser';
import Hittable from './Hittable';

export default class HitCircle extends Hittable {
    private x: number;
    private y: number;

    private scene: Phaser.Scene;
    private group: Phaser.GameObjects.Group;
    private hitGraphic: Phaser.GameObjects.Graphics;
    private timingGraphic: Phaser.GameObjects.Graphics;
    private hitSound: Phaser.Sound.BaseSound;

    private startTime: number;

    public active: boolean;
    public alpha: number;
    public timingRadius: number;

    constructor(scene: Phaser.Scene, circleData: Record<string, any>, hitSound: Sound) {
        super();
        this.scene = scene;

        this.x = circleData.position[0];
        this.y = circleData.position[1];

        this.hitSound = hitSound;

        this.alpha = 0;
        this.active = false;

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
        this.group.setX(this.x);
        this.group.setY(this.y);
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
        this.hitGraphic.disableInteractive();
        this.hitSound.play();
        
        const feedback = "Hello!";
        const feedbackGraphic = this.scene.add.text(this.x, this.y, feedback);
        console.log(this.scene.timeline.totalElapsed);
        this.scene.tweens.add({
            targets: feedbackGraphic,
            alpha: 0,
            duration: 1000,
            onUpdate: (tween, target) => {
                console.log(target.alpha);
                target.setAlpha(target.alpha);
            },
        })
    }

    private getTimingCircle(): Phaser.Geom.Circle {
        const radius = this.HIT_RADIUS + this.timingRadius;
        const timingCircle = new Phaser.Geom.Circle(0, 0, radius);
        return timingCircle;
    }
}
