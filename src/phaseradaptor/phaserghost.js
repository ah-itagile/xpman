import TilePositionToPhaserTranslator from "./TilePositionToPhaserTranslator";

export default class PhaserGhost {

    constructor(scene, tilesize, imageName, ghostModel, mazeOffsetY) {
        this.scene = scene;
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

    getKillableByPairProgramming() {
        return this.ghostModel.getKillableByPairProgramming();
    }

    getTranslatedPosition() {
        return this.tilePositionToPhaserTranslator.translate(this.ghostModel.getPosX(), this.ghostModel.getPosY());
    }
    
    shouldUpdateAtTime(time) {
        return this.ghostModel.shouldUpdateAtTime(time);
    }
    update(time, player) {
        this.ghostModel.update(time, player);

        let position = this.getTranslatedPosition();
        this.scene.tweens.add({
            targets: this.ghostImage,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: this.ghostModel.getSpeed(),
            repeat: 0,            // -1: infinity
            yoyo: false,
            x: position.x,
            y: position.y
        });    }

    destroy() {
        this.ghostImage.destroy();
    }

}
