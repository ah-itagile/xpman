export default class PhaserPairProgrammingDisplay {

    constructor(scene) {
        this.phaserPairProgrammingDisplay = scene.add.text(450, 0, '');
    }

    update(timeLeft) {
        this.phaserPairProgrammingDisplay.setText("Pairing:"+(Math.ceil(timeLeft/1000)));
    }

    showNothing() {
        this.phaserPairProgrammingDisplay.setText("");
    }
}