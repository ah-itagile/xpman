import Phaser from "phaser";
import tilesImg from "./assets/super-mario.png";
import playerImg from "./assets/player16x16.png";
import ghostPng from "./assets/security.png";
import tileMapCsv from "./assets/stadium-tilemap.csv";

import Ghost from './model/ghost';
import PhaserGhost from './phaseradapter/phaserghost';
import * as ModelConstants from './model/constants';
import PhaserKeyControlsAdapter from "./phaseradapter/phaserKeyControlsAdapter";
import Player from "./model/player";
import PhaserPlayer from "./phaseradapter/phaserPlayer";

export default class MyScene extends Phaser.Scene {

  constructor (config) {
      super(config);
      this.tilesize = 16;
      this.offset = (this.tilesize / 2)
      this.map;
  }

  init(data) {}
  
  preload ()
  {
      this.load.image('tiles', tilesImg);
      this.load.image('player', playerImg);
      this.load.image('ghost', ghostPng);
      this.load.tilemapCSV('map', tileMapCsv);
  }
  
  create ()
  {
      this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
      var tileset = this.map.addTilesetImage('tiles', null, 16, 16, 0, 0);
      var layer = this.map.createStaticLayer(0, tileset, 0, 0);
      let phaserMap = this.map;
      let mapAdapter = {
        getTileAt: function(x,y) {
          const PhaserEmptyField = 33;
          const PhaserOccupiedField = 11;

          let phaserTile = phaserMap.getTileAt(x,y).index;
          if (phaserTile === PhaserEmptyField) {
            return ModelConstants.MAP_FREE;
          } else {
            return ModelConstants.MAP_WALL;              
          } 
        }
      }

      let ghostModel = new Ghost(mapAdapter, 500, 0);
      ghostModel.setPosX(2);
      ghostModel.setPosY(14);
      this.phaserGhost = new PhaserGhost(this, this.tilesize, 'ghost', ghostModel);

      let phaserKeyAdapter = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdapter, phaserKeyAdapter, 1, 250, 0);
      this.phaserPlayer = new PhaserPlayer(this, this.tilesize, 'player', playerModel);
  }
  
  update(time, delta) {
      if (this.phaserGhost.shouldUpdateAtTime(time)) {
        this.phaserGhost.update(time);
      }
      if (this.phaserPlayer.shouldUpdateAtTime(time)) {
        this.phaserPlayer.update(time);
      }
  }
}