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

export class GameApp {
    private app: PIXI.Application;

    constructor(parent: HTMLElement, width: number, height: number) {
        this.app = new PIXI.Application({
            width,
            height,
            resolution: window.devicePixelRatio,
            autoResize: true,
            backgroundColor: 0x777777
        });
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

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
        let hitCircle = new HitCircle(500, 250, resources[currentSound]);
        hitCircle.mount(this.app.stage);
    }
}

class HitCircle {
    private x: number;
    private y: number;
    private duration: number;
    private hitSound: PIXI.LoaderResource;
    private graphics: PIXI.Graphics;

    readonly MAX_TIMING_RADIUS: number = 100;
    readonly HIT_RADIUS: number = 65;
    readonly DURATION_MS: number = 1000;

    constructor(x, y, hitSound) {
        this.hitSound = hitSound;
        const hitCircle: PIXI.Circle = new PIXI.Circle(600, 250, this.HIT_RADIUS);

        hitCircle.x = x;
        hitCircle.y = y;

        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(2, 0xffffff, 1);
        this.graphics.beginFill(0xaabbee, 1);
        this.graphics.drawShape(hitCircle);
        this.graphics.endFill();

        this.graphics.interactive = true;
        this.graphics.buttonMode = true;

        this.graphics.on("pointerdown", () => this.onClick());
    }

    mount(stage) {
        stage.addChild(this.graphics);
    }

    private onClick() {
        this.hitSound.sound.play();
    }
}
