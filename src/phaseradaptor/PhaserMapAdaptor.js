import * as ModelConstants from '../model/constants';
import * as TilesConstants from './TilesConstants';

export default class PhaserMapAdaptor{

    constructor(phaserMap) {
        this.phaserMap = phaserMap;
    }

    getTileAt(x,y) {
        let phaserTile = this.phaserMap.getTileAt(x,y).index;
        if (phaserTile === TilesConstants.EmptyField) {
          return ModelConstants.MAP_FREE;
        } else if (phaserTile === TilesConstants.DotField) {
          return ModelConstants.MAP_DOT;              
        } else {
          return ModelConstants.MAP_WALL;              
        } 
    }

    replaceTile(x,y,newTile) {  
        if (newTile===ModelConstants.MAP_FREE) {
          this.phaserMap.putTileAt(TilesConstants.EmptyField, x,y);
        }
    }

    countDots(){
      let count = 0;
      for (var x=0; x<this.phaserMap.width; x++) {
        for (var y=0; y<this.phaserMap.height; y++) {
          if (this.getTileAt(x,y)===ModelConstants.MAP_DOT) {
            count++;
          }
        }
      } 
      return count;
    } 
} 