import mainScene from "./main-scene.js";
import menuScene from "./game-menu.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    parent: 'game-container',
    scene: [menuScene, mainScene],
    physics: {
        default: "arcade",
        arcade:{
            debug: true,
            debugShowVelocity: true
        }
    },
}

new Phaser.Game(config);