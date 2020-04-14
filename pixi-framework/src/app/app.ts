import { soundEffects } from "../assets/loader";
import * as PIXI from "pixi.js";
import "pixi-sound";

interface SoundEffects {
    softHitclap: string[];
}

// Prepare frames
const gameSounds: SoundEffects = soundEffects;

// IMPORTANT: Change this value in order to see the Hot Module Reloading!
const currentSound: keyof SoundEffects = "softHitclap";

class GameApp {
    private app: PIXI.Application;
    private gameElements: HitCircle[];

    constructor(parent: HTMLElement, width: number, height: number) {
        this.app = new PIXI.Application({
            width,
            height,
            resolution: window.devicePixelRatio,
            // @ts-ignore: Syntax error
            autoResize: true,
            backgroundColor: 0x777777
        });
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        this.gameElements = [];

        // init Pixi loader
        let loader = new PIXI.Loader();

        // Add user player assets
        console.log("Sounds to load", currentSound);
        Object.keys(gameSounds).forEach(key => {
            loader.add(key, gameSounds[key]);
        });

        // Load assets
        loader.load(this.onAssetsLoaded.bind(this));
    }

    private onAssetsLoaded(loader, resources) {
        this.addCircle(500, 250, resources[currentSound]);
        setTimeout(() => this.addCircle(800, 400, resources[currentSound]), 1000);
        requestAnimationFrame(() => this.tick());
    }
    
    private addCircle(x, y, hitSound) {
        let hitCircle = new HitCircle(x, y, hitSound);
        hitCircle.mount(this.app.stage);
        this.gameElements.push(hitCircle);
    }

    private tick() {
        for (let i = 0; i < this.gameElements.length; ++i) {
            this.gameElements[i].update();
        }
        requestAnimationFrame(() => this.tick());
    }
}

class HitCircle {
    private x: number;
    private y: number;
    private hitSound: PIXI.LoaderResource;
    private rootGraphic: PIXI.Graphics;
    private hitGraphic: PIXI.Graphics;
    private timingGraphic: PIXI.Graphics;
    private startTime: number;

    readonly MAX_TIMING_RADIUS: number = 300;
    readonly HIT_RADIUS: number = 65;
    readonly DURATION_MS: number = 2000;

    constructor(x, y, hitSound) {
        this.hitSound = hitSound;
        this.startTime = Date.now();
        this.x = x;
        this.y = y;

        const hitCircle = new PIXI.Circle(600, 250, this.HIT_RADIUS);

        hitCircle.x = x;
        hitCircle.y = y;

        this.hitGraphic = new PIXI.Graphics();

        this.hitGraphic.lineStyle(10, 0xffffff, 1);
        this.hitGraphic.beginFill(0x112288, 1);
        this.hitGraphic.drawShape(hitCircle);
        this.hitGraphic.endFill();

        this.hitGraphic.interactive = true;
        this.hitGraphic.buttonMode = true;



        this.timingGraphic = new PIXI.Graphics();

        this.timingGraphic.lineStyle(10, 0xabcede, 1);
        this.timingGraphic.drawShape(this.getTimingCircle(0.0));
        this.timingGraphic.endFill();

        this.rootGraphic = new PIXI.Graphics();

        this.rootGraphic.addChild(this.timingGraphic);
        this.rootGraphic.addChild(this.hitGraphic);

        this.hitGraphic.on("pointerdown", () => this.onClick());
    }

    update() {
        const progress = (Date.now() - this.startTime) / this.DURATION_MS
        this.timingGraphic.clear();
        this.timingGraphic.lineStyle(10, 0xabcede, 1);
        this.timingGraphic.drawShape(this.getTimingCircle(progress));
        this.timingGraphic.endFill();
    }

    mount(stage) {
        stage.addChild(this.rootGraphic);
    }

    getTimingCircle(progress: number): PIXI.Circle {
        const radius = (1 - progress) * this.MAX_TIMING_RADIUS + this.HIT_RADIUS;
        const timingCircle = new PIXI.Circle(600, 250, radius);
        timingCircle.x = this.x;
        timingCircle.y = this.y;
        return timingCircle;
    }

    private onClick() {
        this.hitSound.sound.play();
    }
}

export { GameApp, HitCircle };
