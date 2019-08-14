export default class PhaserLivesDisplay {

    constructor(scene) {
        this.phaserLivesDisplay = scene.add.text(100, 0, '0000');
    }

    update(lives) {
        this.phaserLivesDisplay.setText("Lives:"+lives);
    }
}