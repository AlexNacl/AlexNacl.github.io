import Utils from "./utils.js";

export default class Tiles {
    constructor(scene, scoreTab, anims) {
        this.tiles = [];
        this.Utils = new Utils();
        this.scene = scene;
        this.tilesGroup = this.scene.add.group();
        this.scoreTab = scoreTab;
    }

    fillField() {
        this.tilesGroup.destroy(true, true);
        this.tilesGroup = this.scene.add.group();

        for (let i = 0; i < 4; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < 4; j++) {
                let tile = this.scene.add.sprite(this.Utils.tilePosition(j), this.Utils.tilePosition(i), "tileSprites");
                tile.alpha = 0;
                tile.visible = 0;
                this.tilesGroup.add(tile);
                this.tiles[i][j] = {
                    tileValue: 0,
                    tileSprite: tile,
                    canCombine: true
                }
            }
        }
    }

    setRandomTile(randomTile) {
        if (randomTile) {
            let randomValue = parseInt(this.Utils.getRandomNumber({ 1: 0.9, 2: 0.1 }))
            this.tiles[randomTile.row][randomTile.col].tileValue = randomValue;
            this.tiles[randomTile.row][randomTile.col].tileSprite.visible = true;
            this.tiles[randomTile.row][randomTile.col].tileSprite.setFrame(randomValue - 1);
            this.scene.tweens.add({
                targets: [this.tiles[randomTile.row][randomTile.col].tileSprite],
                alpha: 1,
                duration: 200,
                onComplete: function (tween) {
                    tween.parent.scene.canMove = true;
                },
            });
        }
        this.checkAllPossibleMovement();
    }

    getEmptyTiles() {
        let emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tiles[i][j].tileValue === 0) {
                    emptyTiles.push({ row: i, col: j })
                }
            }
        }
        return emptyTiles;
    }

    moveTiles(rowChange, collumnChange) {
        let inMovement = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let checkedRow = rowChange === 1 ? 3 - i : i;
                let checkedCollumn = collumnChange === 1 ? 3 - j : j;
                let tileValue = this.tiles[checkedRow][checkedCollumn].tileValue;

                if (tileValue != 0) {
                    let collumnDistance = collumnChange;
                    let rowDistance = rowChange;

                    while (this.Utils.isInsideBoard(checkedRow + rowDistance, checkedCollumn + collumnDistance) &&
                        this.tiles[checkedRow + rowDistance][checkedCollumn + collumnDistance].tileValue === 0) {
                        collumnDistance += collumnChange;
                        rowDistance += rowChange;
                    }
                    let resultCollumn = checkedCollumn + collumnDistance;

                    let resultRow = checkedRow + rowDistance;

                    if (this.Utils.isInsideBoard(resultRow, resultCollumn) &&
                        (this.tiles[resultRow][resultCollumn].tileValue === tileValue) &&
                        this.tiles[resultRow][resultCollumn].canCombine &&
                        this.tiles[checkedRow][checkedCollumn].canCombine) {
                        this.tiles[resultRow][resultCollumn].tileValue++;
                        this.scoreTab.updateText(Math.pow(2, this.tiles[resultRow][resultCollumn].tileValue))
                        this.tiles[resultRow][resultCollumn].canCombine = false;
                        this.tiles[checkedRow][checkedCollumn].tileValue = 0;
                        this.moveTile(this.tiles[checkedRow][checkedCollumn], resultRow, resultCollumn, Math.abs(rowDistance + collumnDistance));
                        inMovement = true;
                    } else {
                        collumnDistance = collumnDistance - collumnChange;
                        rowDistance = rowDistance - rowChange;

                        resultCollumn = checkedCollumn + collumnDistance;
                        resultRow = checkedRow + rowDistance;

                        if (collumnDistance != 0 || rowDistance != 0) {
                            this.tiles[resultRow][resultCollumn].tileValue = tileValue;
                            this.tiles[checkedRow][checkedCollumn].tileValue = 0;
                            this.moveTile(this.tiles[checkedRow][checkedCollumn], resultRow, resultCollumn, Math.abs(rowDistance + collumnDistance));
                            inMovement = true;
                        }
                    }
                }
            }
        }

        return inMovement;
    }

    moveTile(tile, row, col, distance) {
        this.scene.movingTiles++;
        this.scene.tweens.add({
            targets: [tile.tileSprite],
            x: this.Utils.tilePosition(col),
            y: this.Utils.tilePosition(row),
            duration: 200 * distance,
            onComplete: function (tween) {
                tween.parent.scene.movingTiles--;
                if (tween.parent.scene.movingTiles === 0) {
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.createTile();
                }
            }
        })
    }

    resetTiles() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.tiles[i][j].canCombine = true;
                this.tiles[i][j].tileSprite.x = this.Utils.tilePosition(j);
                this.tiles[i][j].tileSprite.y = this.Utils.tilePosition(i);
                if (this.tiles[i][j].tileValue > 0) {
                    this.tiles[i][j].tileSprite.alpha = 1;
                    this.tiles[i][j].tileSprite.visible = true;
                    this.tiles[i][j].tileSprite.setFrame(this.tiles[i][j].tileValue - 1);
                }
                else {
                    this.tiles[i][j].tileSprite.alpha = 0;
                    this.tiles[i][j].tileSprite.visible = false;
                }
                if (this.tiles[i][j].tileValue > 10) this.scene.victory();
            }
        }
    }

    checkAllPossibleMovement() {
        if (this.scene.gameEnded) return;
        let hasLeft = this.checkPossibleMovement(0, -1);
        let hasRight = this.checkPossibleMovement(0, 1);
        let hasUp  = this.checkPossibleMovement(-1, 0);
        let hasDown = this.checkPossibleMovement(1, 0);
        if (!hasLeft && !hasRight && !hasUp && !hasDown) this.scene.gameOver();
    }

    checkPossibleMovement(rowChange, collumnChange) {
        let hasMoves = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let checkedRow = rowChange === 1 ? 3 - i : i;
                let checkedCollumn = collumnChange === 1 ? 3 - j : j;
                let tileValue = this.tiles[checkedRow][checkedCollumn].tileValue;

                if (tileValue != 0) {
                    let collumnDistance = collumnChange;
                    let rowDistance = rowChange;

                    while (this.Utils.isInsideBoard(checkedRow + rowDistance, checkedCollumn + collumnDistance) &&
                        this.tiles[checkedRow + rowDistance][checkedCollumn + collumnDistance].tileValue === 0) {
                        collumnDistance += collumnChange;
                        rowDistance += rowChange;
                    }
                    let resultCollumn = checkedCollumn + collumnDistance;

                    let resultRow = checkedRow + rowDistance;

                    if (this.Utils.isInsideBoard(resultRow, resultCollumn) &&
                        (this.tiles[resultRow][resultCollumn].tileValue === tileValue) &&
                        this.tiles[resultRow][resultCollumn].canCombine &&
                        this.tiles[checkedRow][checkedCollumn].canCombine) {

                        hasMoves = true;
                    } else {
                        collumnDistance = collumnDistance - collumnChange;
                        rowDistance = rowDistance - rowChange;

                        resultCollumn = checkedCollumn + collumnDistance;
                        resultRow = checkedRow + rowDistance;

                        if (collumnDistance != 0 || rowDistance != 0) {
                            hasMoves = true;
                        }
                    }
                }
            }
        }
        return hasMoves;
    }
}