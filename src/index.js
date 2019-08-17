import Phaser from "phaser";
import GameScene from "./scenes/gameScene";
import TitleScene from "./scenes/titleScene"
import NextLevelScene from "./scenes/nextLevelScene"
import GameOverScene from "./scenes/gameOverScene";
import LifeLostScene from "./scenes/lifeLostScene";
import XPacmanGame from "./model/xpacmanGame";


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
    this.scene.add('GameOver', GameOverScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('LifeLost', LifeLostScene);

    
    let levelConfig = {
      ghosts: [{posX: 2, posY: 14},
               {posX: 6, posY: 14}
      ],
      player: {posX: 2, posY: 3}
    };

    let xpacmanGame = new XPacmanGame([levelConfig]);
    this.scene.start('Title', xpacmanGame);
  }
}
 
window.game = new Game();
