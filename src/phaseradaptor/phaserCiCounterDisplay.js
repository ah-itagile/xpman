export default class PhaserCiCounterDisplay {

    constructor(scene) {
        this.phaserCiCounterDisplay = scene.add.text(200, 0, 'CI Counter: 0000');
    }

    showMessage(counter) {
        this.phaserCiCounterDisplay.setText(counter);
    }
}