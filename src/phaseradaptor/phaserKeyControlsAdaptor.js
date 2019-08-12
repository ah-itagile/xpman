import Phaser from "phaser";

export default class PhaserKeyControlsAdaptor {
    constructor(scene) {
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    up() {
        return this.keyW.isDown;
    }
    left() {
        return this.keyA.isDown;
    }
    down() {
        return this.keyS.isDown;
    }
    right() {
        return this.keyD.isDown;
    }
}