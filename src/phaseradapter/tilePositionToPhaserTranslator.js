
export default class TilePositionToPhaserTranslator {
    constructor(tileSize) {
        this.tileSize = tileSize;
    }

    translate(x,y) {
        return { 
            x: x*this.tileSize + (this.tileSize/2), y: y*this.tileSize + (this.tileSize/2)};
    }
}