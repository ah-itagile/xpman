import Phaser from "phaser";

export default class EndGameScene extends Phaser.Scene {
    constructor () {
        super('EndGame');
    }

    init(xpmanGame) {
        this.xpmanGame = xpmanGame;
    };

    create() {
        this.add.text(100, 100, 'Congratulations! You finished the whole game!!!!');
        this.input.keyboard.on('keydown_ENTER', ()=> {
          this.scene.start('Title', this.xpmanGame);          
        });
    }
}
