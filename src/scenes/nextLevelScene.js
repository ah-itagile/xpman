import Phaser from "phaser";

export default class NextLevelScene extends Phaser.Scene {
    constructor () {
        super('NextLevel');
    }

    init(xpmanGame) {
        this.xpmanGame = xpmanGame;
    };

    create() {
        this.add.text(100, 100, 'Congrats! You finished the level!');
        this.input.keyboard.on('keydown_ENTER', ()=> {
          this.scene.start('Game', this.xpmanGame);          
        });
    }
}
