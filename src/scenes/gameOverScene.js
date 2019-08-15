import 'phaser';
 
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOver');
  }
 
 
  create () {
    this.add.text(100, 100, 'GAME OVER');
    this.input.keyboard.on('keydown_ENTER', ()=> {
      this.scene.start('Title');          
    });
}
};