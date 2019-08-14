import 'phaser';
import titleImg from "../assets/title.jpg";
 
export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }
 
  preload () {
    this.load.image('title', titleImg);
  }
 
  create () {
    this.add.image(400, 300, 'title');
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.input.keyboard.on('keydown_ENTER', ()=> {
        this.scene.start('Game');
    });
  }
};