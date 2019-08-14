
export default class TilePositionToPhaserTranslator {
    constructor(tileSize, mazeOffsetY) {
        this.tileSize = tileSize;
        this.mazeOffsetY = mazeOffsetY;        
    }

    translate(x,y) {
        return { 
            x: x*this.tileSize + (this.tileSize/2), y: this.mazeOffsetY + y*this.tileSize + (this.tileSize/2)};
    }
}