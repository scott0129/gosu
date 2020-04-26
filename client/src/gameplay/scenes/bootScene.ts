export default class BootScene extends Phaser.Scene {

    private musicStream: Stream;
    private musicLoaded: boolean;

    constructor() {
        super({ key: 'boot' });
        this.musicStream = window.musicStream;
        this.musicLoaded = false;
    }

    public preload(): void {
        const bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
        const bar = this.add
            .rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff)
            .setScale(0, 1);

        this.load.image('sky', require('../../assets/sky.png'));
        this.load.image('star', require('../../assets/star.png'));

        this.sound.decodeAudio('music', this.musicStream);
        this.sound.addListener('decodedall', () => this.musicLoaded = true)

        this.load.audio(
            'softHitclap',
            require('../../assets/audio/soft-hitclap.wav')
        );

        this.load.on('progress', function (progress) {
            bar.setScale(progress, 1);
        });
    }

    public create(): void {
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    public update(): void {
        if (!this.musicLoaded) { return; }
        this.scene.start('menu');
    }
}
