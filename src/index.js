import Phaser from "phaser";
import GameScene from "./scenes/gameScene";
import TitleScene from "./scenes/titleScene"
import NextLevelScene from "./scenes/nextLevelScene"
import GameOverScene from "./scenes/gameOverScene";
import LifeLostScene from "./scenes/lifeLostScene";
import EndGameScene from "./scenes/endGameScene";
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
    this.scene.add('EndGame', EndGameScene);
    
    let levelConfigs = [
      {
        mapName: 'tileMapLevel1',
        ghosts: [{posX: 2, posY: 14},
                 {posX: 6, posY: 14}
        ],
        ghostStepTime: 500,
        spawnGhosts: {
          spawnX: 8,
          spawnY: 9          
        },
        player: {posX: 1, posY: 1}
      },
      {
        mapName: 'tileMapLevel2',
        ghosts: [{posX: 2, posY: 14},
                {posX: 6, posY: 14}
        ],
        ghostStepTime: 250,
        spawnGhosts: {
          spawnX: 12,
          spawnY: 7          
        },
        player: {posX: 2, posY: 3}
      }
    ];

    let xpacmanGame = new XPacmanGame();
    
    xpacmanGame.setLevelConfigs(levelConfigs);
    this.scene.start('Title', xpacmanGame);
  }
}
 
window.game = new Game();
