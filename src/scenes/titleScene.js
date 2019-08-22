import 'phaser';
import opponentPng from "../assets/manager.png";
import bugPng from "../assets/bug.png";
import ciServerPng from "../assets/ciServer.png";
import kentPng from "../assets/kent.png";

 
export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }
 
  preload () {
    this.load.image('opponentPng', opponentPng);
    this.load.image('bugPng', bugPng);
    this.load.image('ciServerPng', ciServerPng);
    this.load.image('kentPng', kentPng);
  }
 
  init(xpmanGame) {
      this.xpmanGame = xpmanGame;
  };

  create () {
    // this.add.image(400, 300, 'title');
    this.add.text(300, 150, "XPman", {
        fontFamily: 'Courier',
        fontSize: '48px',
        fontStyle: '',
        backgroundColor: null,
        color: '#fff',
        stroke: '#fff',
        strokeThickness: 0,
        shadow: {
            offsetX: 0,
            offsetY: 0,
            color: '#000',
            blur: 0,
            stroke: false,
            fill: false
        }});
    this.add.image(200, 300, 'opponentPng');
    this.add.text(240, 300, 'Avoid the SAFe managers');
    this.add.image(200, 340, 'ciServerPng');
    this.add.text(240, 330, 'Integrate at the CI Server');
    this.add.text(240, 360, 'before bugs appear!');
    this.add.image(450, 370, 'bugPng');
    this.add.image(200, 400, 'kentPng');
    this.add.text(240, 390, 'Pair with Kent to kill bugs');

    this.add.text(280, 500, 'Press ENTER to start');

    this.input.keyboard.on('keydown_ENTER', ()=> {
        this.scene.stop();
        this.xpmanGame.resetGame();
        this.scene.start('Game', this.xpmanGame);
    });
  }
};