import Phaser from "phaser";
import tilesImg from "../assets/super-mario.png";
import playerImg from "../assets/player16x16.png";
import ghostPng from "../assets/security.png";
import tileMapLevel1 from "../assets/xpacman-level1.csv";
import tileMapLevel2 from "../assets/xpacman-level2.csv";

import Ghost from '../model/ghost';
import PhaserGhost from '../phaseradaptor/phaserghost';
import PhaserKeyControlsAdapter from "../phaseradaptor/phaserKeyControlsAdaptor";
import PhaserMapAdaptor from '../phaseradaptor/PhaserMapAdaptor';
import PhaserPointsDisplay from '../phaseradaptor/phaserPointsDisplay';
import PhaserLivesDisplay from '../phaseradaptor/phaserLivesDisplay';
import Player from "../model/player";
import PhaserPlayer from "../phaseradaptor/phaserPlayer";
import XPacmanGame from '../model/xpacmanGame';


export default class GameScene extends Phaser.Scene {

  constructor (config) {
      super(config);
      this.tilesize = 16;
      this.offset = (this.tilesize / 2)
      this.mazeOffsetY = 20;
  }

  init(data) {}
  
  preload ()
  {
      this.load.image('tiles', tilesImg);
      this.load.image('player', playerImg);
      this.load.image('ghost', ghostPng);
      this.load.tilemapCSV('tileMapLevel1', tileMapLevel1);
  }
  
  create ()
  {

      let levelConfig = {
        ghosts: [{posX: 2, posY: 14},
                 {posX: 6, posY: 14}
        ],
        player: {posX: 2, posY: 3}
      };

      
      let pointsDisplay = new PhaserPointsDisplay(this);
      let playerLivesLeftDisplay = new PhaserLivesDisplay(this);
      let phaserTileMap = this.make.tilemap({ key: 'tileMapLevel1', tileWidth: 16, tileHeight: 16 });
      var tileset = phaserTileMap.addTilesetImage('tiles', null, 16, 16, 0, 0);
      phaserTileMap.createDynamicLayer(0, tileset, 0, this.mazeOffsetY);

      let mapAdaptor = new PhaserMapAdaptor(phaserTileMap);
      let phaserGhosts = [];
      levelConfig.ghosts.forEach((ghost) => {
        let ghostModel = new Ghost(mapAdaptor, 500, 0);
        phaserGhosts.push(new PhaserGhost(this, this.tilesize, 'ghost', ghostModel, this.mazeOffsetY));
      });
      this.phaserKeyAdaptor = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdaptor, this.phaserKeyAdaptor, 1, 250, 0, 2);
      let phaserPlayer = new PhaserPlayer(this, this.tilesize, 'player', playerModel, this.mazeOffsetY);

      this.endGameCallback = () => { 
        this.scene.stop()        
        this.scene.start('NextLevel');
      };
      this.gameOverCallback = () => { 
        this.scene.stop()        
        this.scene.start('GameOver');
      };
      this.lifeLostDisplay = { showMessage: (message) => { 
        this.scene.pause('Game')        
        this.scene.launch('LifeLost', message);
      }};
      this.game = new XPacmanGame([levelConfig]);
      this.game.setMapAdaptor(mapAdaptor);
      this.game.setGhosts(phaserGhosts);
      this.game.setPlayer(phaserPlayer);
      this.game.setEndGameCallback(this.endGameCallback);
      this.game.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
      this.game.setGameOverCallback(this.gameOverCallback);
      this.game.setLifeLostDisplay(this.lifeLostDisplay);
      this.game.setPointsDisplay(pointsDisplay);
      this.game.resetLevel();
      this.game.initialize();
      this.events.on('resume', ()=>{
        this.phaserKeyAdaptor.reset();
        this.game.continueAfterLifeLost();
      });

      this.keyL_ONLY_FOR_DEVELOPMENT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
  }

  // only for development
  isLevelEndForced() {
    return this.keyL_ONLY_FOR_DEVELOPMENT.isDown;
  }
  
  update(time, delta) {
    let forceLevelEnd = this.isLevelEndForced();
    this.game.update(time, forceLevelEnd);
  }
}