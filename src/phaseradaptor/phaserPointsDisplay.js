export default class PhaserPointsDisplay {

    constructor(scene) {
        this.phaserPointsDisplay = scene.add.text(0, 0, '0000');
    }

    update(text) {
        this.phaserPointsDisplay.setText(text);
    }
}