import 'phaser';
import titleImg from "../assets/title.jpg";
import { runInThisContext } from 'vm';
 
export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }
 
  preload () {
    this.load.image('title', titleImg);
  }
 
  init(xpacmanGame) {
      this.xpacmanGame = xpacmanGame;
  };

  create () {
    this.add.image(400, 300, 'title');
    this.input.keyboard.on('keydown_ENTER', ()=> {
        this.scene.stop();
        this.xpacmanGame.resetGame();
        this.scene.start('Game', this.xpacmanGame);
    });
  }
};