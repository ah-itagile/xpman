import TilePositionToPhaserTranslator from "./TilePositionToPhaserTranslator";

export default class PhaserOpponent {

    constructor(scene, tilesize, imageName, opponentModel, mazeOffsetY) {
        this.scene = scene;
        this.tilesize = tilesize;
        this.opponentModel = opponentModel;        
        this.offset = tilesize / 2;
        this.mazeOffsetY = mazeOffsetY;
        this.tilePositionToPhaserTranslator = new TilePositionToPhaserTranslator(tilesize, mazeOffsetY);
        let position = this.getTranslatedPosition();

        this.opponentImage = scene.add.image(position.x, 
                                          position.y + mazeOffsetY, 
                                          imageName);    
    }

    getPosX() {
        return this.opponentModel.getPosX();
    }

    getPosY() {
        return this.opponentModel.getPosY();
    }

    setPosX(x) {
        this.opponentModel.setPosX(x);
    }

    setPosY(y) {
        this.opponentModel.setPosY(y);
    }

    getKillableByPairProgramming() {
        return this.opponentModel.getKillableByPairProgramming();
    }

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.opponentModel.getPosX(), this.opponentModel.getPosY());
    }
    
    shouldUpdateAtTime(time) {
        return this.opponentModel.shouldUpdateAtTime(time);
    }
    update(time, player) {
        this.opponentModel.update(time, player);

        let position = this.getTranslatedPosition();
        this.scene.tweens.add({
            targets: this.opponentImage,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: this.opponentModel.getSpeed(),
            repeat: 0,            // -1: infinity
            yoyo: false,
            x: position.x,
            y: position.y
        });    
    }

    destroy() {
        this.opponentImage.destroy();
    }

}
