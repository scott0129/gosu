import Phaser from 'phaser';

export default class Hittable {
    /* Max radius of the timing graphic */
    readonly MAX_TIMING_RADIUS: number = 300;

    /* Radius of clickable graphic */
    readonly HIT_RADIUS: number = 65;
    
    /* Width of timingGraphic and border around hitGraphic */
    readonly BORDER_WIDTH: number = 10;
}
