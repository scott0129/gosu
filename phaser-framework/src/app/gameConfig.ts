import Phaser from 'phaser';
import bootScene from './bootScene';
import playScene from './playScene';
import menuScene from './menuScene';
import endScene from './endScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    title: 'Phaser 3 web-osu game',
    banner: {
        text: 'white',
        background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'],
    },
    scene: [bootScene, menuScene, playScene, endScene],
};

export default gameConfig;
