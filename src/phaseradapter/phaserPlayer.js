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

    update() {
        this.model.update();
        let position = this.getTranslatedPosition();
        this.image.x = position.x;
        this.image.y = position.y;
    }

}
