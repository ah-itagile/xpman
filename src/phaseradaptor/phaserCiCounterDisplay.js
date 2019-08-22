export default class PhaserCiCounterDisplay {

    constructor(scene) {
        this.phaserCiCounterDisplay = scene.add.text(280, 0, 'CI Counter: 0000');
    }

    showMessage(counter) {
        if (counter < 100 && (counter % 20)) {
            this.phaserCiCounterDisplay.setColor('#f00');
        } else {
            this.phaserCiCounterDisplay.setColor('#fff');
        }
        this.phaserCiCounterDisplay.setText("CI Countdown:" + counter);
    }
}