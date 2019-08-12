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
        } else if (phaserTile === TilesConstants.PillField) {
          return ModelConstants.MAP_PILL;              
        } else {
          return ModelConstants.MAP_WALL;              
        } 
    }

    replaceTile(x,y,newTile) {  
        if (newTile===ModelConstants.MAP_FREE) {
          this.phaserMap.putTileAt(TilesConstants.EmptyField, x,y);
        }
    }
} 