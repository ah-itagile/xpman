import Phaser from "phaser";
import tilesImg from "../assets/super-mario.png";
import playerImg from "../assets/player16x16.png";
import ghostPng from "../assets/security.png";
import tileMapCsv from "../assets/stadium-tilemap.csv";

import Ghost from '../model/ghost';
import PhaserGhost from '../phaseradaptor/phaserghost';
import PhaserKeyControlsAdapter from "../phaseradaptor/phaserKeyControlsAdaptor";
import PhaserMapAdaptor from '../phaseradaptor/PhaserMapAdaptor';
import Player from "../model/player";
import PhaserPlayer from "../phaseradaptor/phaserPlayer";
import Game from '../model/game'


export default class GameScene extends Phaser.Scene {

  constructor (config) {
      super(config);
      this.tilesize = 16;
      this.offset = (this.tilesize / 2)
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

      let levelConfig = {
        ghosts: [{posX: 2, posY: 14},
                 {posX: 6, posY: 14}
        ],
        player: {posX: 2, posY: 3}
      };

      let phaserTileMap = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
      var tileset = phaserTileMap.addTilesetImage('tiles', null, 16, 16, 0, 0);
      phaserTileMap.createDynamicLayer(0, tileset, 0, 0);

      let mapAdaptor = new PhaserMapAdaptor(phaserTileMap);
      let phaserGhosts = [];
      levelConfig.ghosts.forEach((ghost) => {
        let ghostModel = new Ghost(mapAdaptor, 500, 0);
        ghostModel.setPosX(ghost.posX);
        ghostModel.setPosY(ghost.posY);
        phaserGhosts.push(new PhaserGhost(this, this.tilesize, 'ghost', ghostModel));
      });
      let phaserKeyAdaptor = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdaptor, phaserKeyAdaptor, 1, 250, 0, 2);
      playerModel.setPosX(levelConfig.player.posX);
      playerModel.setPosY(levelConfig.player.posY);
      let phaserPlayer = new PhaserPlayer(this, this.tilesize, 'player', playerModel);

      this.endGameCallback = () => { console.log("Game finished!");};

      this.game = new Game(mapAdaptor, phaserGhosts, phaserPlayer, this.endGameCallback);
  }
  
  update(time, delta) {
    this.game.update(time);
  }
}