import Phaser from "phaser";

export default class PhaserKeyControlsAdaptor {
    constructor(scene) {
        this.scene = scene;
        this.reset();        
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

    reset() {
        // This has to be done when resuming a scene. Otherwise the old keydown-state will sometimes be present. Bug?
        this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
}