export default class PhaserPointsDisplay {

    constructor(scene) {
        this.phaserPointsDisplay = scene.add.text(0, 0, 'Storypoints:0');
    }

    update(text) {
        this.phaserPointsDisplay.setText("Storypoints:" + text);
    }
}