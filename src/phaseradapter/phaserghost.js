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

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.ghostModel.getPosX(), this.ghostModel.getPosY());
    }

    update() {
        let options = this.ghostModel.findPossibleMoves();
        let newDirection = Phaser.Math.RND.pick(options);
        this.ghostModel.setDirection(newDirection);          
        this.ghostModel.move(newDirection);

        let position = this.getTranslatedPosition();
        this.ghostImage.x = position.x;
        this.ghostImage.y = position.y;
    }

}
