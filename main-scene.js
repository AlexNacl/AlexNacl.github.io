import ScoreTab from "./counter-module.js";
import InfoScreen from "./info-screen.js";
import Utils from "./utils.js";
import Tiles from "./tiles-module.js";

export default class mainScene extends Phaser.Scene {
	constructor() {
		super('mainScene')
	}

	init() {
		this.gameEnded = false;
		this.canMove = false;
		this.scoreTab = new ScoreTab(this, 400, 150);
		this.tilesLogic = new Tiles(this, this.scoreTab, this.anims);
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.Utils = new Utils();
		this.victoryScreen = new InfoScreen(this, 400, 400).setOrigin(0.5, 0.5);
		this.movementPause = 0;
	}

	create() {
		this.backgroundImage = this.add.image(400, 400, "background");
		this.backgroundImage.depth = -1;
		this.startButton = this.add.image(400, 650, "scoreBackground").setScale(0.5);
		this.startButtonText = this.add.text(400, 650, 'Start Game', { font: '16px Courier', fill: '#000000' }).setOrigin(0.5, 0.5);
		this.startButton.setInteractive();

		this.subscribe();
	}

	subscribe() {
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.startButton.on('pointerdown', this.startGame, this);
		this.input.on("pointerup", this.mouseMove, this);

		this.events.on("MainScene:restartGame", this.startGame, this);
		this.events.on("destroy", this.onDestroy, this);
	}

	onDestroy() {
		this.startButton.off('pointerdown', this.startGame, this);
		this.input.off("pointerup", this.mouseMove, this);
	}

	fillField() {
		this.tilesLogic.fillField();
	}

	startGame() {
		this.gameEnded = false;
		this.startButton.visible = true;
		this.startButtonText.setText(`Restart Game`);
		this.fillField();
		this.createTile();
		this.scoreTab.restartCount();
		this.movementPause = 500;
	}

	createTile() {
		let emptyTiles = this.tilesLogic.getEmptyTiles()
		let randomTile = Phaser.Utils.Array.GetRandom(emptyTiles);
		this.tilesLogic.setRandomTile(randomTile);
	}

	checkMovement() {
		if (!this.canMove || this.gameEnded || this.movementPause > 0) return;

		if (this.cursorKeys.left.isDown) {
			this.moveTiles(0, -1);
		} else if (this.cursorKeys.right.isDown) {
			this.moveTiles(0, 1);
		} else if (this.cursorKeys.up.isDown) {
			this.moveTiles(-1, 0);
		} else if (this.cursorKeys.down.isDown) {
			this.moveTiles(1, 0);
		}
	}

	mouseMove(event) {
		if (!this.canMove || this.gameEnded) return;

		let moveTime = event.upTime - event.downTime;
		let move = new Phaser.Geom.Point(event.upX - event.downX, event.upY - event.downY);
		let moveMagnitude = Phaser.Geom.Point.GetMagnitude(move);
		let moveNormal = new Phaser.Geom.Point(move.x / moveMagnitude, move.y / moveMagnitude);
		if (moveMagnitude > 20 && moveTime < 1000 && (Math.abs(moveNormal.y) > 0.8 || Math.abs(moveNormal.x) > 0.8)) {
			if (moveNormal.x > 0.8) {
				this.moveTiles(0, 1);
			}
			if (moveNormal.x < -0.8) {
				this.moveTiles(0, -1);
			}
			if (moveNormal.y > 0.8) {
				this.moveTiles(1, 0);
			}
			if (moveNormal.y < -0.8) {
				this.moveTiles(-1, 0);
			}
		}
	}

	moveTiles(rowChange, collumnChange) {
		let inMovement = false;
		this.canMove = false;
		this.movingTiles = 0;
		this.movementPause = 500;

		inMovement = this.tilesLogic.moveTiles(rowChange, collumnChange);

		if (!inMovement) {
			this.canMove = true;
		}
	}

	resetTiles() {
		this.tilesLogic.resetTiles();
	}

	victory() {
		this.gameEnded = true;
		this.startButton.visible = false;
		this.victoryScreen.setEnabled("restartGame", "VICTORY!", this.scoreTab);
	}

	gameOver() {
		this.gameEnded = true;
		this.startButton.visible = false;
		this.victoryScreen.setEnabled("restartGame", "NO MORE MOVES!\nTRY AGAIN!", this.scoreTab);
	}

	update(time, deltatime) {
		this.movementPause -= deltatime;
		this.checkMovement()
	}

}