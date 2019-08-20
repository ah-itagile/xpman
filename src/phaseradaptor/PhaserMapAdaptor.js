import * as ModelConstants from '../model/constants';
import * as TilesConstants from './TilesConstants';

export default class PhaserMapAdaptor {

  constructor(phaserMap) {
    this.phaserMap = phaserMap;
  }

  getTileAt(x, y) {
    let phaserTileField = this.phaserMap.getTileAt(x, y);
    if (phaserTileField === null) {
      return ModelConstants.MAP_UNSET;
    }
    let phaserTile = phaserTileField.index;
    if (phaserTile === TilesConstants.EmptyField) {
      return ModelConstants.MAP_FREE;
    } else if (phaserTile === TilesConstants.DotField) {
      return ModelConstants.MAP_DOT;
    } else if (phaserTile === TilesConstants.CiServerField) {
      return ModelConstants.MAP_CI_SERVER;
    } else if (phaserTile === TilesConstants.PairProgField) {
      return ModelConstants.MAP_PAIRPROG;
    } else {
      return ModelConstants.MAP_WALL;
    }
  }

  replaceTile(x, y, newTile) {
    if (newTile === ModelConstants.MAP_FREE) {
      this.phaserMap.putTileAt(TilesConstants.EmptyField, x, y);
    }
  }

  countDots() {
    let count = 0;
    for (var x = 0; x < this.phaserMap.width; x++) {
      for (var y = 0; y < this.phaserMap.height; y++) {
        if (this.getTileAt(x, y) === ModelConstants.MAP_DOT) {
          count++;
        }
      }
    }
    return count;
  }
} 