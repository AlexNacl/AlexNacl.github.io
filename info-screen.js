export default class InfoScreen extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y) {
        super(scene, x, y, "background")
        scene.add.existing(this);

        this.setVisible(false);
        this.displayHeight = 400;
        this.displayWidth = 400;
        this.infoText = "";
        this.eventName = "";
        this.scene = scene;

        this.infoText = this.scene.add.text(400, 350, 'VICTORY!', { font: '40px Courier', fill: '#000000' }).setOrigin(0.5, 0.5);
        this.infoButton = this.scene.add.image(400, 500, "scoreBackground").setScale(0.5);
        this.infoButtonText = this.scene.add.text(400, 500, 'Restart', { font: '20px Courier', fill: '#000000' }).setOrigin(0.5, 0.5);
        this.infoButton.setInteractive();
        this.infoButton.on('pointerdown', this.fireFunction, this);

        this.setScreenObjectsDepth(-2);
    }

    setEnabled(eventName, infoText, scoreTab) {
        this.infoText.setText(infoText);
        this.eventName = eventName;
        this.setAllObjectEnabled();
        this.scoreTab = scoreTab;
    }

    fireFunction(){
        this.setAllObjectDisabled();
        this.scene.events.emit(`MainScene:${this.eventName}`, this);
    }

    setAllObjectDisabled() {
        this.setScreenObjectsDepth(-2);
        this.setScreenVisibility(false);
    }

    setAllObjectEnabled() {
        this.setScreenObjectsDepth(2);
        this.setScreenVisibility(true);
    }

    setScreenObjectsDepth(depth) {
        this.setDepth(depth);
        this.infoText.setDepth(depth);
        this.infoButton.setDepth(depth);
        this.infoButtonText.setDepth(depth);
    }

    setScreenVisibility(enabled) {
        this.setVisible(enabled);
        this.infoText.setVisible(enabled);
        this.infoButton.setVisible(enabled);
        this.infoButtonText.setVisible(enabled);
    }
}