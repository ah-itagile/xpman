import Phaser from "phaser";
import tilesImg from "../assets/xpman-tileset.png";
import playerImg from "../assets/player.png";
import ghostPng from "../assets/manager.png";
import bugPng from "../assets/bug.png";
import tileMapLevel1 from "../assets/xpman-level1.csv";
import tileMapLevel2 from "../assets/xpman-level2.csv";

import Ghost from '../model/ghost';
import PhaserGhost from '../phaseradaptor/phaserghost';
import PhaserKeyControlsAdapter from "../phaseradaptor/phaserKeyControlsAdaptor";
import PhaserMapAdaptor from '../phaseradaptor/PhaserMapAdaptor';
import PhaserPointsDisplay from '../phaseradaptor/phaserPointsDisplay';
import PhaserLivesDisplay from '../phaseradaptor/phaserLivesDisplay';
import Player from "../model/player";
import PhaserPlayer from "../phaseradaptor/phaserPlayer";
import XPacmanGame from '../model/xpacmanGame';
import PhaserRandomMoveDecider from "../phaseradaptor/phaserRandomMoveDecider";
import GhostPossibleMovesFinder from "../model/ghostPossibleMovesFinder";
import ChasingMoveDecider from "../model/chasingMoveDecider";
import PhaserCiCounterDisplay from "../phaseradaptor/phaserCiCounterDisplay";
import SpawnGhostsAction from "../phaseradaptor/SpawnGhostsAction";
import PhaserPairProgrammingDisplay from "../phaseradaptor/phaserPairProgrammingDisplay";
import PairProgrammingTimedAction from "../model/PairProgrammingTimedAction";


export default class GameScene extends Phaser.Scene {

  constructor (config) {
      super(config);
      this.tilesize = 32;
      this.offset = (this.tilesize / 2)
      this.mazeOffsetY = 20;
  }

  init(xpacmanGame) {
    this.xpacmanGame = xpacmanGame;
  }
  
  preload ()
  {
      this.load.image('tiles', tilesImg);
      this.load.image('player', playerImg);
      this.load.image('ghost', ghostPng);
      this.load.image('bug', bugPng);
      this.load.tilemapCSV('tileMapLevel1', tileMapLevel1);
      this.load.tilemapCSV('tileMapLevel2', tileMapLevel2);
  }
  
  create ()
  {
      let levelConfig = this.xpacmanGame.getLevelConfigs()[this.xpacmanGame.getCurrentLevel()-1];
      let pointsDisplay = new PhaserPointsDisplay(this);
      let playerLivesLeftDisplay = new PhaserLivesDisplay(this);
      let phaserTileMap = this.make.tilemap({ key: this.xpacmanGame.getLevelConfigs()[this.xpacmanGame.getCurrentLevel()-1].mapName, tileWidth: this.tilesize, tileHeight: this.tilesize });
      var tileset = phaserTileMap.addTilesetImage('tiles', null, this.tilesize, this.tilesize, 0, 0);
      phaserTileMap.createDynamicLayer(0, tileset, 0, this.mazeOffsetY);

      let mapAdaptor = new PhaserMapAdaptor(phaserTileMap);
      let phaserGhosts = [];
      let phaserRandomMoveDecider = new PhaserRandomMoveDecider();
      let possibleMovesFinder = new GhostPossibleMovesFinder();
      let chasingMoveDecider = new ChasingMoveDecider(phaserRandomMoveDecider);
      levelConfig.ghosts.forEach((ghost) => {
        let ghostModel = new Ghost(mapAdaptor, levelConfig.ghostStepTime, 0, chasingMoveDecider, possibleMovesFinder, false);
        phaserGhosts.push(new PhaserGhost(this, this.tilesize, 'ghost', ghostModel, this.mazeOffsetY));
      });
      this.phaserKeyAdaptor = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdaptor, this.phaserKeyAdaptor, 1, 250, 0, 5000);
      let phaserPlayer = new PhaserPlayer(this, this.tilesize, 'player', playerModel, this.mazeOffsetY);
      let ciCounterDisplay = new PhaserCiCounterDisplay(this);
      let pairProgrammingDisplay = new PhaserPairProgrammingDisplay(this);
      let pairProgrammingTimedAction = new PairProgrammingTimedAction(0, 0, playerModel, 2000, pairProgrammingDisplay);
      let spawnGhostsAction = new SpawnGhostsAction(200, 0, 500, 10, this.xpacmanGame, 
        levelConfig, mapAdaptor, this, this.tilesize, this.mazeOffsetY, ciCounterDisplay, 'bug');
      this.xpacmanGame.setTimedActions([spawnGhostsAction, pairProgrammingTimedAction]);
      this.levelFinishedCallback = () => { 
        this.scene.stop()        
        this.scene.start('NextLevel', this.xpacmanGame);
      };
      this.gameOverCallback = () => { 
        this.scene.stop()        
        this.scene.start('GameOver');
      };
      this.endGameCallback = () => { 
        this.scene.stop()        
        this.scene.start('EndGame', this.xpacmanGame);
      };
      this.lifeLostDisplay = { showMessage: (message) => { 
        this.scene.pause('Game')        
        this.scene.launch('LifeLost', message);
      }};
      this.xpacmanGame.setMapAdaptor(mapAdaptor);
      this.xpacmanGame.setInitialGhosts(phaserGhosts);
      this.xpacmanGame.setPlayer(phaserPlayer);
      this.xpacmanGame.setLevelFinishedCallback(this.levelFinishedCallback);
      this.xpacmanGame.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
      this.xpacmanGame.setGameOverCallback(this.gameOverCallback);
      this.xpacmanGame.setEndGameCallback(this.endGameCallback);
      this.xpacmanGame.setLifeLostDisplay(this.lifeLostDisplay);
      this.xpacmanGame.setPointsDisplay(pointsDisplay);      
      this.xpacmanGame.initializeLevel();
      this.events.on('resume', ()=>{
        this.phaserKeyAdaptor.reset();
        this.xpacmanGame.continueAfterLifeLost();
      });

      this.keyL_ONLY_FOR_DEVELOPMENT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
  }

  // only for development
  isLevelEndForced() {
    return this.keyL_ONLY_FOR_DEVELOPMENT.isDown;
  }
  
  update(time, delta) {
    let forceLevelEnd = this.isLevelEndForced();
    this.xpacmanGame.update(time, forceLevelEnd);
  }
}