export default class menuScene extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload(){
        this.load.image('background', '/img/background.png');
        this.load.image('scoreBackground', '/img/ScoreBackground.png');
        this.load.spritesheet('tileSprites', '/img/TileSprites.png', {frameWidth: 75, frameHeight: 75});
    }

    create(){
        this.add.text(20, 20, "loading game...");
        this.scene.start("mainScene");
    }
}