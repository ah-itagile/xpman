import Phaser from "phaser";
import TilePositionToPhaserTranslator from "./TilePositionToPhaserTranslator";

export default class PhaserGhost {

    constructor(scene, tilesize, imageName, ghostModel) {
        this.tilesize = tilesize;
        this.ghostModel = ghostModel;
        this.offset = tilesize / 2;
        this.tilePositionToPhaserTranslator = new TilePositionToPhaserTranslator(tilesize);
        let position = this.getTranslatedPosition();

        this.ghostImage = scene.add.image(position.x, 
                                          position.y, 
                                          imageName);    
    }

    getPosX() {
        return this.ghostModel.getPosX();
    }

    getPosY() {
        return this.ghostModel.getPosY();
    }

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.ghostModel.getPosX(), this.ghostModel.getPosY());
    }
    
    shouldUpdateAtTime(time) {
        return this.ghostModel.shouldUpdateAtTime(time);
    }
    update(time) {
        let options = this.ghostModel.findPossibleMoves();
        let newDirection = Phaser.Math.RND.pick(options);
        this.ghostModel.setDirection(newDirection);          
        this.ghostModel.move(newDirection);
        this.ghostModel.update(time);

        let position = this.getTranslatedPosition();
        this.ghostImage.x = position.x;
        this.ghostImage.y = position.y;
    }

}
