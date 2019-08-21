import TilePositionToPhaserTranslator from "./TilePositionToPhaserTranslator";

export default class PhaserPlayer {

    constructor(scene, tilesize, imageName, model, mazeOffsetY) {
        this.scene = scene;
        this.tilesize = tilesize;
        this.model = model;
        this.offset = tilesize / 2;
        this.mazeOffsetY = mazeOffsetY;
        this.tilePositionToPhaserTranslator = new TilePositionToPhaserTranslator(tilesize, mazeOffsetY);
        let position = this.getTranslatedPosition();

        this.image = scene.add.image(position.x, 
                                    position.y, 
                                    imageName);                                        
    }

    getPosX() {
        return this.model.getPosX();
    }

    getPosY() {
        return this.model.getPosY();
    }

    setPosX(x) {
        this.model.setPosX(x);
    }

    setPosY(y) {
        this.model.setPosY(y);
    }

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.model.getPosX(), this.model.getPosY());
    }

    setDotEatenEventListener(listener) {
        this.model.setDotEatenEventListener(listener);
    }

    shouldUpdateAtTime(time) {
        return this.model.shouldUpdateAtTime(time);
    }

    getPairProgramming() {
        return this.model.getPairProgramming();
    }

    getEatenDots() {
        return this.model.getEatenDots();
    }
    update(time) {
        this.model.update(time);
        let position = this.getTranslatedPosition();
        this.scene.tweens.add({
            targets: this.image,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: this.model.getSpeed(),
            repeat: 0,            // -1: infinity
            yoyo: false,
            x: position.x,
            y: position.y
        });
    }

}
