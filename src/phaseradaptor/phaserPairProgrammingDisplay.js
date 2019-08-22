export default class PhaserPairProgrammingDisplay {

    constructor(scene) {
        this.phaserPairProgrammingDisplay = scene.add.text(450, 0, '');
    }

    update(timeLeft) {
        let secondsLeft = (Math.ceil(timeLeft/1000));
        if (Math.ceil(timeLeft/300) % 2) {
            this.phaserPairProgrammingDisplay.setColor('#0f0');
        } else {
            this.phaserPairProgrammingDisplay.setColor('#000');
        }
        this.phaserPairProgrammingDisplay.setText("Pairing:"+secondsLeft);
    }

    showNothing() {
        this.phaserPairProgrammingDisplay.setText("");
    }
}