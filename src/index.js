import Phaser from "phaser";
import GameScene from "./scenes/gameScene";
import TitleScene from "./scenes/titleScene"
import NextLevelScene from "./scenes/nextLevelScene"


const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
};


class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('Game', GameScene);
    this.scene.add('NextLevel', NextLevelScene);
    this.scene.add('Title', TitleScene);
    this.scene.start('Title');
  }
}
 
window.game = new Game();
