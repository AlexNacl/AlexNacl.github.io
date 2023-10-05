export default class Score extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, "scoreBackground");

        scene.add.existing(this);

        this.scene = scene;
        this.scoreText = scene.add.text(400, 150, 'Score: 0', { font: '20px Courier', fill: '#000000' }).setOrigin(0.5, 0.5);

        this.currentScore = 0;
        this.newScore = 0;
    }

    updateText(score){
        this.currentScore = this.newScore;
        this.newScore += score;
        this.scoreText.setText(`Score: ${this.newScore}`);
        if (this.updateTween && this.updateTween.isPlaying()) 
        {
            this.updateTween.updateTo('value', this.newScore);
        }
        else
        {
            this.updateTween = this.scene.tweens.addCounter({
                from: this.currentScore,
                to: this.newScore,
                duration: 200,
                ease: 'linear',
                onUpdate: tween =>
                {
                    const value = Math.round(tween.getValue());
                    this.scoreText.setText(`Score: ${value}`);
                }
            });
        }
    }

    restartCount() {
        this.currentScore = 0;
        this.newScore = 0;
        this.updateText(0);
    }
}