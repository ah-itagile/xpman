import TilePositionToPhaserTranslator from "./TilePositionToPhaserTranslator";

export default class PhaserPlayer {

    constructor(scene, tilesize, imageName, model) {
        this.tilesize = tilesize;
        this.model = model;
        this.offset = tilesize / 2;
        this.tilePositionToPhaserTranslator = new TilePositionToPhaserTranslator(tilesize);
        let position = this.getTranslatedPosition();

        this.image = scene.add.image(position.x, 
                                    position.y, 
                                    imageName);    
    }

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.model.getPosX(), this.model.getPosY());
    }

    shouldUpdateAtTime(time) {
        return this.model.shouldUpdateAtTime(time);
    }
    getEatenDots() {
        return this.model.getEatenDots();
    }
    update(time) {
        this.model.update(time);
        let position = this.getTranslatedPosition();
        this.image.x = position.x;
        this.image.y = position.y;
    }

}
