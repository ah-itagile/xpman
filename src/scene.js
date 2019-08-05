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
      this.lastPlayerUpdate=0;
      this.playerSpeedDelay = 500;
      this.player;
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

      this.ghost = new Ghost(mapAdapter);
      this.ghost.setPosX(2);
      this.ghost.setPosY(14);

      this.phaserGhost = new PhaserGhost(this, this.tilesize, 'ghost', this.ghost);

      let phaserKeyAdapter = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdapter, phaserKeyAdapter);
      this.phaserPlayer = new PhaserPlayer(this, this.tilesize, 'player', playerModel);

      // //  Left
      // this.input.keyboard.on('keydown_A', function (event) {
  
      //     var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);
  
      //     if (tile.index === 2)
      //     {
      //         //  Blocked, we can't move
      //     }
      //     else
      //     {
      //         player.x -= 32;
      //         player.angle = 180;
      //     }
  
      // });
  
      // //  Right
      // this.input.keyboard.on('keydown_D', function (event) {
  
      //     var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);
  
      //     if (tile.index === 2)
      //     {
      //         //  Blocked, we can't move
      //     }
      //     else
      //     {
      //         player.x += 32;
      //         player.angle = 0;
      //     }
  
      // });
  
      // //  Up
      // this.input.keyboard.on('keydown_W', function (event) {
  
      //     var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);
  
      //     if (tile.index === 2)
      //     {
      //         //  Blocked, we can't move
      //     }
      //     else
      //     {
      //         player.y -= 32;
      //         player.angle = -90;
      //     }
  
      // });
  
      // //  Down
      // this.input.keyboard.on('keydown_S', function (event) {
  
      //     var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);
  
      //     if (tile.index === 2)
      //     {
      //         //  Blocked, we can't move
      //     }
      //     else
      //     {
      //         player.y += 32;
      //         player.angle = 90;
      //     }
  
      // });
  
  }
  
  update(time, delta) {
      if (this.lastPlayerUpdate+this.playerSpeedDelay < time) {
          this.lastPlayerUpdate = time;
          this.phaserGhost.update();
          this.phaserPlayer.update();
      }
  }
}