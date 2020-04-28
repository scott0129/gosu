import Phaser from 'phaser';
import Hittable from './Hittable';

export default class Slider extends Hittable {
    private x: number;
    private y: number;

    private group: Phaser.GameObjects.Group;
    private hitGraphic: Phaser.GameObjects.Graphics;
    private timingGraphic: Phaser.GameObjects.Graphics;
    private sceneSounds: Phaser.Sound.BaseSoundManager;

    public active: boolean;
    public alpha: number;
    public timingRadius: number;
    private curve: Curve;

    /* Progress through the curve [0..1] */
    public progress: number;

    /* Max radius of the timing graphic */
    readonly MAX_TIMING_RADIUS: number = 300;

    /* Radius of clickable graphic */
    readonly HIT_RADIUS: number = 65;

    /* Width of timingGraphic and border around hitGraphic */
    readonly BORDER_WIDTH: number = 10;

    constructor(
        scene: Phaser.Scene,
        sliderData: Record<string, any>,
        hitSound: Sound
    ) {
        super();
        const displayX = Math.floor(
            (sliderData.position[0] / 640) * scene.viewWidth
        );
        const displayY = Math.floor(
            (sliderData.position[1] / 480) * scene.viewHeight
        );

        if (sliderData.curveType === 'bezier') {
        } else if (sliderData.curveType === 'linear') {
        } else if (sliderData.curveType === 'pass-through') {
            this.curve = this.getCircleCurve(sliderData);
        }
        this.progress = 0;

        this.x = displayX;
        this.y = displayY;

        this.alpha = 0;
        this.active = false;

        this.hitSound = hitSound;
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
        this.hitGraphic.fillStyle(0x882211, 1);
        this.hitGraphic.fillCircleShape(hitCircle);

        // Add listeners to clickable circle
        this.hitGraphic.setInteractive(hitCircle, Phaser.Geom.Circle.Contains);
        this.hitGraphic.on('pointerdown', this.onClick.bind(this));

        // Group together timingGraphic and hitGraphic so they can be moved/adjusted together
        this.group = scene.add.group([this.timingGraphic, this.hitGraphic]);
        //TODO: Use curve progress instead of this.x
        this.group.setX(this.x);
        this.group.setY(this.y);
        this.group.setAlpha(this.alpha);
    }

    start(): void {
        this.active = true;
    }

    done(): void {
        this.active = false;
    }

    update(): void {
        if (!this.active) {
            return;
        }
        this.group.setAlpha(this.alpha);

        console.log(this.progress);
        const vector = this.curve.getPointAt(this.progress);
        console.log('vector: ', vector);
        this.group.setX(vector.x);
        this.group.setY(vector.y);

        this.timingGraphic.clear();
        this.timingGraphic.lineStyle(this.BORDER_WIDTH, 0xabcede);
        this.timingGraphic.strokeCircleShape(this.getTimingCircle());
    }

    private getCircleCurve(
        sliderData: Record<string, any>
    ): Phaser.Curves.Ellipse {
        const center = this.centerOf(...sliderData.points);
        const startPoint = sliderData.points[0];
        const endPoint = sliderData.points[2];
        const horizonPoint = [center[0] + 10, center[1]];
        const radius = Math.sqrt(
            center[0] * center[1] + startPoint[0] * startPoint[1]
        );

        const centeredStart = [
            startPoint[0] - center[0],
            startPoint[1] - center[1],
        ];
        const centeredEnd = [endPoint[0] - center[0], endPoint[1] - center[1]];
        const startAngleRad = Phaser.Math.Angle.Between(
            ...horizonPoint,
            ...centeredStart
        );
        const endAngleRad = Phaser.Math.Angle.Between(
            ...horizonPoint,
            ...centeredEnd
        );
        //TODO: Find if rotating clockwise or counterclockwise

        const startAngle = startAngleRad * (180 / Math.PI);
        const endAngle = startAngleRad * (180 / Math.PI);
        console.log('start: ', startPoint):
        console.log('mid: ', sliderData.points[1]):
        console.log('end: ', endPoint):
        console.log('center: ', center):

        return new Phaser.Curves.Ellipse({
            x: center[0],
            y: center[1],
            xRadius: radius,
            yRadius: radius,
            startAngle: startAngle,
            endAngle: endAngle,
        });
    }

    /* Returns the center of a circle made by three points */
    /* From https://stackoverflow.com/questions/32861804 */
    private centerOf(p0, p1, p2): Array<number> {
        const [x0, y0] = p0;
        const [x1, y1] = p1;
        const [x2, y2] = p2;

        x1 -= x0;
        y1 -= y0;
        x2 -= x0;
        y2 -= y0;

        const z1 = x1 * x1 + y1 * y1;
        const z2 = x2 * x2 + y2 * y2;
        const D = 2 * (x1 * y2 - x2 * y1);

        const centerX = (z1 * y2 - z2 * y1) / D + x0;
        const centerY = (x1 * z2 - x2 * z1) / D + y0;

        return [centerX, centerY];
    }

    private onClick(): void {
        this.hitSound.play();
    }

    private getTimingCircle(): Phaser.Geom.Circle {
        const radius = this.HIT_RADIUS + this.timingRadius;
        const timingCircle = new Phaser.Geom.Circle(0, 0, radius);
        return timingCircle;
    }
}
