import 'phaser';

export default class LifeLostScene extends Phaser.Scene {
    constructor() {
        super('LifeLost');
    }

    init(message) {
        this.message = message;
    }
    create() {
        this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0.8)');
        this.add.text(100, 100, this.message);
        this.input.keyboard.on('keydown_ENTER', () => {
            this.scene.stop('LifeLost');
            this.scene.resume('Game');
        });
    }
};