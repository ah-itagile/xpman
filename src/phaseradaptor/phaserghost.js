import Phaser from "phaser";
import TilePositionToPhaserTranslator from "./TilePositionToPhaserTranslator";

export default class PhaserGhost {

    constructor(scene, tilesize, imageName, ghostModel, mazeOffsetY) {
        this.tilesize = tilesize;
        this.ghostModel = ghostModel;
        this.offset = tilesize / 2;
        this.mazeOffsetY = mazeOffsetY;
        this.tilePositionToPhaserTranslator = new TilePositionToPhaserTranslator(tilesize, mazeOffsetY);
        let position = this.getTranslatedPosition();

        this.ghostImage = scene.add.image(position.x, 
                                          position.y + mazeOffsetY, 
                                          imageName);    
    }

    getPosX() {
        return this.ghostModel.getPosX();
    }

    getPosY() {
        return this.ghostModel.getPosY();
    }

    setPosX(x) {
        this.ghostModel.setPosX(x);
    }

    setPosY(y) {
        this.ghostModel.setPosY(y);
    }

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.ghostModel.getPosX(), this.ghostModel.getPosY());
    }
    
    shouldUpdateAtTime(time) {
        return this.ghostModel.shouldUpdateAtTime(time);
    }
    update(time) {
        this.ghostModel.update(time);

        let position = this.getTranslatedPosition();
        this.ghostImage.x = position.x;
        this.ghostImage.y = position.y;
    }

}
