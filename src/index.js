import Phaser from "phaser";
import GameScene from "./scenes/gameScene";
import TitleScene from "./scenes/titleScene"
import NextLevelScene from "./scenes/nextLevelScene"
import GameOverScene from "./scenes/gameOverScene";
import LifeLostScene from "./scenes/lifeLostScene";
import EndGameScene from "./scenes/endGameScene";
import XPManGame from "./model/xpmanGame";


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
        opponents: [{posX: 2, posY: 14},
                 {posX: 6, posY: 14}
        ],
        opponentStepTime: 500,
        spawnOpponents: {
          spawnX: 8,
          spawnY: 9          
        },
        player: {posX: 1, posY: 1}
      },
      {
        mapName: 'tileMapLevel2',
        opponents: [{posX: 2, posY: 14},
                {posX: 6, posY: 14}
        ],
        opponentStepTime: 250,
        spawnOpponents: {
          spawnX: 12,
          spawnY: 7          
        },
        player: {posX: 2, posY: 3}
      }
    ];

    let xpmanGame = new XPManGame();
    
    xpmanGame.setLevelConfigs(levelConfigs);
    this.scene.start('Title', xpmanGame);
  }
}
 
window.game = new Game();
