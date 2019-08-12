import Phaser from "phaser";
import tilesImg from "./assets/super-mario.png";
import playerImg from "./assets/player16x16.png";
import ghostPng from "./assets/security.png";
import tileMapCsv from "./assets/stadium-tilemap.csv";

import Ghost from './model/ghost';
import PhaserGhost from './phaseradaptor/phaserghost';
import * as ModelConstants from './model/constants';
import PhaserKeyControlsAdapter from "./phaseradaptor/phaserKeyControlsAdaptor";
import PhaserMapAdaptor from './phaseradaptor/PhaserMapAdaptor';
import Player from "./model/player";
import PhaserPlayer from "./phaseradaptor/phaserPlayer";
import { constants } from "zlib";

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
      var layer = this.map.createDynamicLayer(0, tileset, 0, 0);
      let phaserMap = this.map;

      let mapAdaptor = new PhaserMapAdaptor(phaserMap);

      let ghostModel = new Ghost(mapAdaptor, 500, 0);
      ghostModel.setPosX(2);
      ghostModel.setPosY(14);
      this.phaserGhost = new PhaserGhost(this, this.tilesize, 'ghost', ghostModel);

      let phaserKeyAdaptor = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdaptor, phaserKeyAdaptor, 1, 250, 0);
      playerModel.setPosX(2);
      playerModel.setPosY(3);
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